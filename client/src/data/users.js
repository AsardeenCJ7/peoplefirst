import api from '../services/api';

// ── Users & Feedback Data Helper (syncs with MongoDB backend) ───────────────
const USERS_KEY = 'pf_admin_users';
const FEEDBACK_KEY_PREFIX = 'pf_comments_';
let inMemoryUsers = null;
let inMemoryFeedback = null;

const seedUsers = [
  { id: 'u1', name: 'Dilshan Perera',    email: 'dilshan@gmail.com',  district: 'Colombo',    role: 'reader', status: 'active',    joined: '2026-08-01', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'u2', name: 'Amara Silva',       email: 'amara@yahoo.com',    district: 'Kandy',      role: 'reader', status: 'active',    joined: '2026-08-12', avatar: 'https://i.pravatar.cc/150?img=5'  },
  { id: 'u3', name: 'Priya Navaratnam', email: 'priya@hotmail.com',  district: 'Jaffna',     role: 'reader', status: 'active',    joined: '2026-08-20', avatar: 'https://i.pravatar.cc/150?img=9'  },
  { id: 'u4', name: 'Kasun Jayaweera',  email: 'kasun@gmail.com',    district: 'Galle',      role: 'reader', status: 'suspended', joined: '2026-09-01', avatar: 'https://i.pravatar.cc/150?img=3'  },
  { id: 'u5', name: 'Nadeesha Fernando',email: 'nadeesh@gmail.com',  district: 'Matara',     role: 'reader', status: 'active',    joined: '2026-09-03', avatar: 'https://i.pravatar.cc/150?img=16' },
  { id: 'u6', name: 'Ruwan Bandara',    email: 'ruwan@slt.lk',       district: 'Kurunegala', role: 'reader', status: 'active',    joined: '2026-09-05', avatar: 'https://i.pravatar.cc/150?img=8'  },
];

const IS_PRODUCTION = import.meta.env.PROD;

function getStoredUsers() {
  try { const r = localStorage.getItem(USERS_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

function initUsers() {
  if (inMemoryUsers && inMemoryUsers.length > 0) return inMemoryUsers;
  const stored = getStoredUsers();
  // In production never seed dummy users — only real API data
  if (IS_PRODUCTION) {
    inMemoryUsers = stored || [];
    return inMemoryUsers;
  }
  if (!stored) { localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers)); return seedUsers; }
  return stored;
}

export function getAllUsers() { return initUsers(); }

export async function fetchUsersFromApi() {
  try {
    const res = await api.get('/users');
    if (res.success && Array.isArray(res.users)) {
      const normalized = res.users.map(u => ({
        ...u,
        id: u._id || u.id,
      }));
      inMemoryUsers = normalized;
      localStorage.setItem(USERS_KEY, JSON.stringify(normalized));
      return normalized;
    }
  } catch (err) {
    console.warn('API fetch for users failed:', err.message);
  }
  // In production return [] so admin panel shows empty state, not dummy users
  return IS_PRODUCTION ? [] : getAllUsers();
}

export async function saveUser(user) {
  try {
    const current = initUsers();
    const isEdit = user._id || (typeof user.id === 'string' && user.id.length === 24);
    if (isEdit) {
      // User updates via profile or status endpoint
    }
    const idx = current.findIndex(u => u.id === user.id || u._id === user._id);
    const updated = idx >= 0 ? current.map(u => (u.id === user.id || u._id === user._id) ? { ...u, ...user } : u) : [user, ...current];
    inMemoryUsers = updated;
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    return user;
  } catch (e) { console.error(e); return null; }
}

export async function deleteUser(userId) {
  try {
    if (typeof userId === 'string' && userId.length === 24) {
      await api.delete(`/users/${userId}`);
    }
  } catch (e) { console.warn('Error deleting user via API:', e.message); }
  const filtered = initUsers().filter(u => u.id !== userId && u._id !== userId);
  inMemoryUsers = filtered;
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  return filtered;
}

export async function toggleUserStatus(userId) {
  try {
    if (typeof userId === 'string' && userId.length === 24) {
      await api.put(`/users/${userId}/status`);
    }
  } catch (e) { console.warn('Error toggling user status via API:', e.message); }
  const updated = initUsers().map(u =>
    (u.id === userId || u._id === userId) ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
  );
  inMemoryUsers = updated;
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  return updated;
}

export function getAllFeedback() {
  if (inMemoryFeedback && inMemoryFeedback.length > 0) return inMemoryFeedback;
  const feedback = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(FEEDBACK_KEY_PREFIX)) {
        const achieverId = key.replace(FEEDBACK_KEY_PREFIX, '');
        const raw = localStorage.getItem(key);
        if (raw) JSON.parse(raw).forEach(c => feedback.push({ ...c, achieverId, storageKey: key }));
      }
    }
  } catch (e) { console.error(e); }
  return feedback.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export async function fetchFeedbackFromApi() {
  try {
    const res = await api.get('/achievers/feedback');
    if (res.success && Array.isArray(res.data)) {
      inMemoryFeedback = res.data;
      return res.data;
    }
  } catch (err) {
    console.warn('API fetch feedback failed:', err.message);
  }
  return getAllFeedback();
}

export function deleteFeedback(achieverId, commentId) {
  try {
    const key = `${FEEDBACK_KEY_PREFIX}${achieverId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    localStorage.setItem(key, JSON.stringify(JSON.parse(raw).filter(c => c.id !== commentId)));
  } catch (e) { console.error(e); }
}

export function updateFeedbackStatus(achieverId, commentId, status) {
  try {
    const key = `${FEEDBACK_KEY_PREFIX}${achieverId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    localStorage.setItem(key, JSON.stringify(JSON.parse(raw).map(c => c.id === commentId ? { ...c, status } : c)));
  } catch (e) { console.error(e); }
}

