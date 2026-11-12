const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const getToken = () => localStorage.getItem('token');

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running on ' + BASE + ' ?');
  }
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) {
    // Session expired / token invalidated (not for the login call itself)
    if (res.status === 401 && token) {
      localStorage.removeItem('token'); localStorage.removeItem('user');
      window.location.assign(import.meta.env.BASE_URL + 'inventory/login');
    }
    const fields = data.errors ? Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join(' · ') : '';
    const err = new Error(fields || data.message || `Request failed (${res.status})`);
    err.status = res.status; err.fields = data.errors || {};
    throw err;
  }
  return data;
}

// ---------- AUTH (matches Spring Boot AuthController) ----------
export const loginApi = (identifier, password) => request('/auth/login', { method: 'POST', body: { identifier, password } });
export const registerApi = (payload) => request('/auth/register', { method: 'POST', body: payload });
export const meApi = () => request('/auth/me');
export const logoutApi = () => request('/auth/logout', { method: 'POST' });
export const changePasswordApi = (currentPassword, newPassword) =>
  request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });

// ---------- ADMIN USERS (ADMIN role only) ----------
export const adminApi = {
  list: (status) => request(`/admin/users${status ? `?status=${status}` : ''}`),
  act: (id, action) => request(`/admin/users/${id}/${action}`, { method: 'PUT' }), // approve|reject|disable|unlock
  resetPassword: (id, newPassword) => request(`/admin/users/${id}/reset-password`, { method: 'PUT', body: { newPassword } }),
};

// ---------- EQUIPMENT (Spring Boot /api/equipment) ----------
export const equipmentApi = {
  list: () => request('/equipment'),
  get: (id) => request(`/equipment/${id}`),
  create: (item) => request('/equipment', { method: 'POST', body: item }),
  update: (id, item) => request(`/equipment/${id}`, { method: 'PUT', body: item }),
  remove: (id) => request(`/equipment/${id}`, { method: 'DELETE' }),
};

 // ---------- CATEGORIES (Spring Boot /api/categories) ----------
export const categoryApi = {
  list: (activeOnly = false) => request(`/categories${activeOnly ? '?activeOnly=true' : ''}`),
  create: (c) => request('/categories', { method: 'POST', body: c }),
  update: (id, c) => request(`/categories/${id}`, { method: 'PUT', body: c }),
  remove: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};



// ---------- MAINTENANCE (Spring Boot /api/maintenance) ----------
export const maintenanceApi = {
  list: (equipmentId) => request(`/maintenance${equipmentId ? `?equipmentId=${encodeURIComponent(equipmentId)}` : ''}`),
  summary: () => request('/maintenance/summary'),
  create: (job) => request('/maintenance', { method: 'POST', body: job }),
  repair: (report) => request('/maintenance/repair-requests', { method: 'POST', body: report }),
  update: (id, job) => request(`/maintenance/${id}`, { method: 'PUT', body: job }),
  start: (id) => request(`/maintenance/${id}/start`, { method: 'PUT' }),
  complete: (id, result) => request(`/maintenance/${id}/complete`, { method: 'PUT', body: result }),
  cancel: (id) => request(`/maintenance/${id}/cancel`, { method: 'PUT' }),
};



// ---------- ASSIGNMENTS (Spring Boot /api/assignments) ----------
export const assignmentApi = {
  list: (equipmentId) => request(`/assignments${equipmentId ? `?equipmentId=${encodeURIComponent(equipmentId)}` : ''}`),
  summary: () => request('/assignments/summary'),
  assignees: () => request('/assignments/assignees'),
  create: (a) => request('/assignments', { method: 'POST', body: a }),
  returnEquipment: (id, r) => request(`/assignments/${id}/return`, { method: 'PUT', body: r }),
  transfer: (id, a) => request(`/assignments/${id}/transfer`, { method: 'PUT', body: a }),
};


// ---------- STOCK (Spring Boot /api/stock) ----------
export const stockApi = {
  items: () => request('/stock/items'),
  summary: () => request('/stock/summary'),
  create: (item) => request('/stock/items', { method: 'POST', body: item }),
  update: (id, item) => request(`/stock/items/${id}`, { method: 'PUT', body: item }),
  remove: (id) => request(`/stock/items/${id}`, { method: 'DELETE' }),
  move: (id, movement) => request(`/stock/items/${id}/movements`, { method: 'POST', body: movement }),
  itemMovements: (id) => request(`/stock/items/${id}/movements`),
  movements: () => request('/stock/movements'),
};

// ---------- SUPPLIERS (Spring Boot /api/suppliers) ----------
export const supplierApi = {
  list: () => request('/suppliers'),
  create: (s) => request('/suppliers', { method: 'POST', body: s }),
  update: (id, s) => request(`/suppliers/${id}`, { method: 'PUT', body: s }),
};

// ---------- PURCHASE ORDERS (Spring Boot /api/purchase-orders) ----------
export const purchaseApi = {
  list: () => request('/purchase-orders'),
  get: (id) => request(`/purchase-orders/${id}`),
  summary: () => request('/purchase-orders/summary'),
  suggestions: () => request('/purchase-orders/suggestions'),
  create: (po) => request('/purchase-orders', { method: 'POST', body: po }),
  update: (id, po) => request(`/purchase-orders/${id}`, { method: 'PUT', body: po }),
  remove: (id) => request(`/purchase-orders/${id}`, { method: 'DELETE' }),
  place: (id) => request(`/purchase-orders/${id}/place`, { method: 'PUT' }),
  receive: (id, r) => request(`/purchase-orders/${id}/receive`, { method: 'PUT', body: r }),
  close: (id) => request(`/purchase-orders/${id}/close`, { method: 'PUT' }),
  cancel: (id) => request(`/purchase-orders/${id}/cancel`, { method: 'PUT' }),
};

// ---------- REPORTS (Spring Boot /api/reports) ----------
export const reportApi = {
  catalog: () => request('/reports'),
  run: (key, { from, to, filter } = {}) => {
    const p = new URLSearchParams();
    if (from) p.set('from', from);
    if (to) p.set('to', to);
    if (filter) p.set('filter', filter);
    const qs = p.toString();
    return request(`/reports/${key}${qs ? `?${qs}` : ''}`);
  },
};



// ---------- DASHBOARD (Spring Boot /api/dashboard) ----------
export const dashboardApi = {
  get: () => request('/dashboard'),
};