import axios from 'axios'

/**
 * API base:
 * - Default: import.meta.env.VITE_API_BASE (e.g. https://api.kelashub.my)
 * - When behind reverse proxy at same domain: set BASE = '/api'
 */
const BASE = import.meta.env.VITE_API_BASE || '/api';

const api = axios.create({
  baseURL: BASE,
  withCredentials: false,
  timeout: 15000
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('kh_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const get = (url, params) => api.get(url, { params }).then(r => r.data);
export const post = (url, data) => api.post(url, data).then(r => r.data);

export default api;
