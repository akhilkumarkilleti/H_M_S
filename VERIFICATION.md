# Frontend Verification Report

Date: 2026-11-12
Scope: banner/image audit and post-cleanup deployment check of the merged
`HMS-Medico-Frontend` app (hospital site + `/inventory` module).
Live URL: https://akhilkumarkilleti.github.io/H_M_S/

## 1. Banner & image audit

All static banners use production-safe ES imports (no absolute `/src/assets`
paths, no external/CDN image URLs, no CSS `url()` banners). `npm run build`
emits every image with a hashed name under the `/H_M_S/` base.

| Image | Location | Live status |
| --- | --- | --- |
| `home1.png` (hero banner) | `src/pages/HospitalHome.jsx` | 200 |
| `doctorarticlepic.jpg` (about/blogs) | `src/pages/HospitalHome.jsx` | 200 |
| `Mainpage.jpg` (rare-cases cards x3) | `src/pages/HospitalHome.jsx` | 200 |
| `login.jpg` (auth banner) | patient/admin login, register, forgot-password | 200 |

- Home page: 5 images rendered, 0 broken, no console errors.
- Dynamic doctor/patient profile photos are backend-served and all have
  `onError` fallbacks (initial/emoji), so a missing photo never shows a broken icon.
- The auth banner is a 50% left panel on desktop and intentionally hidden below
  900px (`PatientLogin.css` media query) — responsive by design, not a defect.

## 2. Post-cleanup deployment check

The standalone `inventory-frontend` folder was removed (commit `48c83a5`); its
code lives on in `HMS-Medico-Frontend/src/inventory` under `/inventory`. The
deploy is built from the merged frontend, so the removal does not affect it.

- Hospital site (`/H_M_S/`): React renders, 5 images load (0 broken), Inventory
  nav link present, zero console errors.
- Inventory section (`/H_M_S/inventory/`): MedCare landing page renders; all
  JS/CSS assets return 200, including the lazy-loaded inventory chunk
  (`entry-*.js` + `entry-*.css`), confirming the code-split module works.
- Note: a direct deep link to `/inventory/` logs one 404 on the document URL.
  This is the GitHub Pages SPA `404.html` fallback (Pages returns a 404 status
  but serves the app shell, which then routes correctly). It is inherent to the
  deploy method, unrelated to the cleanup, and the page renders fully.

## 3. Verification commands

- `npm run build` (from `HMS-Medico-Frontend`) — clean; 4 images emitted.
- Browser checks of the live URL: image `naturalWidth` audit, console
  error/warn scan, and network request status review for both `/` and
  `/inventory/`.

## 4. Observations (non-blocking)

- The three rare-case cards reuse the same `Mainpage.jpg` despite describing
  different procedures.
- `home1.png` (~606 KB) and `doctorarticlepic.jpg` (~611 KB, 2624x3936) are large
  and could be compressed/resized for faster first paint.
- Unused assets in `src/assets`: `hero.png`, `download.png`, `react.svg`,
  `vite.svg`.