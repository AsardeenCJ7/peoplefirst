import api from '../services/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Submit a new achiever suggestion with documents (FormData) ─────────────
export async function submitAchieverSuggestion(formData) {
  try {
    const token = localStorage.getItem('pf_jwt');
    const response = await fetch(`${BASE_URL}/suggestions`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData, // FormData with files
    });
    const data = await response.json().catch(() => ({ success: false, message: 'Server error' }));
    return data;
  } catch (err) {
    console.error('submitAchieverSuggestion error:', err);
    return { success: false, message: err.message };
  }
}

// ── Get suggestions submitted by current user ──────────────────────────────
export async function getMySuggestions() {
  try {
    const res = await api.get('/suggestions/mine');
    return res.data || [];
  } catch (err) {
    console.warn('getMySuggestions error:', err.message);
    return [];
  }
}

// ── Admin: Get all suggestions ─────────────────────────────────────────────
export async function getAllSuggestions(status = 'all') {
  try {
    const query = status !== 'all' ? `?status=${status}` : '';
    const res = await api.get(`/suggestions${query}`);
    return res.data || [];
  } catch (err) {
    console.warn('getAllSuggestions error:', err.message);
    return [];
  }
}

// ── Admin: Review (approve/reject/promote) a suggestion ───────────────────
export async function reviewSuggestion(id, status, adminNote = '') {
  try {
    const res = await api.put(`/suggestions/${id}/review`, { status, adminNote });
    return res;
  } catch (err) {
    console.error('reviewSuggestion error:', err.message);
    return { success: false, message: err.message };
  }
}

// ── Admin: Delete a suggestion ─────────────────────────────────────────────
export async function deleteSuggestion(id) {
  try {
    const res = await api.delete(`/suggestions/${id}`);
    return res;
  } catch (err) {
    console.error('deleteSuggestion error:', err.message);
    return { success: false, message: err.message };
  }
}
