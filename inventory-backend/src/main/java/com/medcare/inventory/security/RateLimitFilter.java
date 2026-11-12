package com.medcare.inventory.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Limits login/register calls per IP address (in-memory, resets every minute). */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 20;
    private static final long WINDOW_MS = 60_000;

    // ip -> [windowStartMillis, requestCount]
    private final Map<String, long[]> hits = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !(path.equals("/api/auth/login") || path.equals("/api/auth/register"));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        long now = System.currentTimeMillis();
        if (hits.size() > 10_000) {
            hits.entrySet().removeIf(e -> now - e.getValue()[0] > WINDOW_MS);
        }

        // If the app runs behind a proxy/load balancer, use the forwarded client IP here instead.
        String ip = request.getRemoteAddr();
        long[] window = hits.compute(ip, (k, v) -> {
            if (v == null || now - v[0] > WINDOW_MS) return new long[]{now, 1};
            v[1]++;
            return v;
        });

        if (window[1] > MAX_REQUESTS) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":429,\"message\":\"Too many requests. Please wait a minute and try again.\"}");
            return;
        }
        chain.doFilter(request, response);
    }
}