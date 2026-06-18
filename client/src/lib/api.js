import axios from 'axios';

// Normalise the configured API base URL so we always end up with exactly one
// `/api` segment in the final request URL.
//
// All endpoint paths in this file are written WITH the `/api` prefix
// (e.g. `/api/auth/register`). Therefore the baseURL must NOT itself end in
// `/api`. We defensively strip a trailing `/api` (and any trailing slash) from
// VITE_API_URL, so it works whether the env var is set to:
//   https://host.com        → https://host.com   → /api/auth/register ✓
//   https://host.com/api    → https://host.com   → /api/auth/register ✓
//   https://host.com/api/   → https://host.com   → /api/auth/register ✓
//   (empty, dev)            → ''                 → /api/... (Vite proxy) ✓
function normalizeBaseUrl(raw) {
  let base = (raw || '').trim();
  if (!base) return '';
  base = base.replace(/\/+$/, ''); // drop trailing slashes
  base = base.replace(/\/api$/i, ''); // drop a trailing /api (paths add it)
  return base;
}

const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL,
  // Network errors should fail fast rather than hang indefinitely.
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'bloomgift_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Attach the JWT to every request when present.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise errors into user-friendly messages and never throw raw/blank errors.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    let message;
    if (error.response) {
      // Server responded with an error status.
      const status = error.response.status;
      const serverMsg = error.response.data?.error || error.response.data?.message;
      if (serverMsg) {
        message = serverMsg;
      } else if (status === 404) {
        message = 'That resource was not found (404).';
      } else if (status >= 500) {
        message = 'The server had a problem (500). Please try again shortly.';
      } else {
        message = `Request failed (${status}). Please try again.`;
      }
    } else if (error.code === 'ECONNABORTED') {
      message = 'The server took too long to respond. Please try again.';
    } else {
      // No response at all — network/CORS/DNS/offline.
      message = 'Could not connect to server. Please try again.';
    }
    const normalized = new Error(message);
    normalized.status = error.response?.status;
    normalized.isNetworkError = !error.response;
    return Promise.reject(normalized);
  }
);

// Convenience API methods.
export const AuthAPI = {
  register: (payload) => api.post('/api/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/api/auth/login', payload).then((r) => r.data),
  me: () => api.get('/api/auth/me').then((r) => r.data),
};

export const GiftAPI = {
  create: (payload) => api.post('/api/gifts', payload).then((r) => r.data),
  mine: () => api.get('/api/gifts/mine').then((r) => r.data),
  bySlug: (slug) => api.get(`/api/gifts/${slug}`).then((r) => r.data),
  remove: (id) => api.delete(`/api/gifts/${id}`).then((r) => r.data),
};

export const BouquetAPI = {
  create: (payload) => api.post('/api/bouquets', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/api/bouquets/${id}`, payload).then((r) => r.data),
  mine: () => api.get('/api/bouquets/mine').then((r) => r.data),
  byId: (id) => api.get(`/api/bouquets/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/api/bouquets/${id}`).then((r) => r.data),
};

export const UploadAPI = {
  files: (formData) =>
    api
      .post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};
