import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ─── Production: flush stale dummy/seed localStorage data ─────────────────────
// These keys were previously seeded with hardcoded dummy content.
// In production we only want real API data, so we clear them once.
// We use a version flag so this only runs once per cache version.
if (import.meta.env.PROD) {
  const CACHE_VERSION = 'pf_cache_v2'; // bump this if you need to clear again
  if (!localStorage.getItem(CACHE_VERSION)) {
    const keysToRemove = [
      'peoplefirst_custom_news',
      'peoplefirst_custom_achievers',
      'pf_admin_awards',
      'pf_admin_users',
      'pf_award_voting_config',
      'pf_award_categories',
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    localStorage.setItem(CACHE_VERSION, '1');
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
