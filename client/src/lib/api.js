import axios from 'axios';

// In dev, Vite proxies /api to the backend, so a relative baseURL works.
// In production, set VITE_API_URL to the API origin.
const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
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

// Normalise error messages.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
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
