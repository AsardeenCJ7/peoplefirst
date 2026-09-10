// ── Users & Feedback Data Helper ─────────────────────────────────────────────
const USERS_KEY = 'pf_admin_users';
const FEEDBACK_KEY_PREFIX = 'pf_comments_';

const seedUsers = [
  { id: 'u1', name: 'Dilshan Perera',    email: 'dilshan@gmail.com',  district: 'Colombo',    role: 'reader', status: 'active',    joined: '2026-08-01', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'u2', name: 'Amara Silva',       email: 'amara@yahoo.com',    district: 'Kandy',      role: 'reader', status: 'active',    joined: '2026-08-12', avatar: 'https://i.pravatar.cc/150?img=5'  },
  { id: 'u3', name: 'Priya Navaratnam', email: 'priya@hotmail.com',  district: 'Jaffna',     role: 'reader', status: 'active',    joined: '2026-08-20', avatar: 'https://i.pravatar.cc/150?img=9'  },
  { id: 'u4', name: 'Kasun Jayaweera',  email: 'kasun@gmail.com',    district: 'Galle',      role: 'reader', status: 'suspended', joined: '2026-09-01', avatar: 'https://i.pravatar.cc/150?img=3'  },
  { id: 'u5', name: 'Nadeesha Fernando',email: 'nadeesh@gmail.com',  district: 'Matara',     role: 'reader', status: 'active',    joined: '2026-09-03', avatar: 'https://i.pravatar.cc/150?img=16' },
  { id: 'u6', name: 'Ruwan Bandara',    email: 'ruwan@slt.lk',       district: 'Kurunegala', role: 'reader', status: 'active',    joined: '2026-09-05', avatar: 'https://i.pravatar.cc/150?img=8'  },
];

function getStoredUsers() {
  try { const r = localStorage.getItem(USERS_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

function initUsers() {
  const stored = getStoredUsers();
  if (!stored) { localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers)); return seedUsers; }
  return stored;
}

export function getAllUsers() { return initUsers(); }

export function saveUser(user) {
  try {
    const current = initUsers();
    const idx = current.findIndex(u => u.id === user.id);
    const updated = idx >= 0 ? current.map(u => u.id === user.id ? { ...u, ...user } : u) : [user, ...current];
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    return user;
  } catch (e) { console.error(e); return null; }
}

export function deleteUser(userId) {
  try {
    const filtered = initUsers().filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  } catch (e) { console.error(e); }
}

export function toggleUserStatus(userId) {
  try {
    const updated = initUsers().map(u =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) { console.error(e); return []; }
}

export function getAllFeedback() {
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
