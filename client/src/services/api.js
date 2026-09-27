/**
 * api.js – Centralized Axios-free fetch wrapper for PeopleFirst API
 *
 * Usage:
 *   import api from './api';
 *   const data = await api.get('/auth/me');
 *   await api.post('/auth/login', { email, password });
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('pf_jwt');
export const setToken = (t) => localStorage.setItem('pf_jwt', t);
export const removeToken = () => localStorage.removeItem('pf_jwt');

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(method, path, body = null, isFormData = false) {
  const headers = {};

  if (!isFormData) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, config);
  const data = await response.json().catch(() => ({ success: false, message: 'Server returned non-JSON response' }));

  if (!response.ok) {
    // Attach HTTP status to the error object so callers can check it
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── HTTP verb shortcuts ──────────────────────────────────────────────────────
const api = {
  get:    (path)              => request('GET',    path),
  post:   (path, body)        => request('POST',   path, body),
  put:    (path, body)        => request('PUT',    path, body),
  delete: (path)              => request('DELETE', path),
  upload: (path, formData)    => request('POST',   path, formData, true),
};

export default api;
