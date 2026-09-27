// ── Awards Data Helper ─────────────────────────────────────────────────────
const AWARDS_KEY = 'pf_admin_awards';
const VOTING_CONFIG_KEY = 'pf_award_voting_config';

const seedAwards = [
  {
    id: 1,
    title: "National Healthcare Pioneer Award 2026",
    category: "Healthcare",
    nominee: "Dr. Nilanthi Jayasinghe",
    nomineeId: 1,
    description: "For revolutionary contributions to rural healthcare access through tele-medicine clinics in Uva province.",
    status: "Nominee",
    year: 2026,
    presenter: "College of Community Physicians Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    votes: 0,
    icon: "🏆"
  },
  {
    id: 101,
    title: "Community Child Health Award",
    category: "Healthcare",
    nominee: "Dr. Rohan Abeyratne",
    nomineeId: null,
    description: "Pioneered mobile diagnostic vans screening 45,000 rural children for congenital cardiac and eye diseases.",
    status: "Nominee",
    year: 2026,
    presenter: "Sri Lanka Paediatric Association",
    thumbnail: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    votes: 0,
    icon: "🩺"
  },
  {
    id: 201,
    title: "Distinguished Public Health & Epidemiology Laureate",
    category: "Healthcare",
    nominee: "Dr. Anula Wijesundera",
    nomineeId: null,
    description: "Spearheaded national dengue containment strategies and mobile diagnostic clinical labs serving over 60,000 plantation workers.",
    status: "Nominee",
    year: 2026,
    presenter: "Sri Lanka Medical Association",
    thumbnail: "https://images.unsplash.com/photo-1594824813576-90f70a7f14b6?w=400&q=80",
    votes: 0,
    icon: "🩺"
  },
  {
    id: 2,
    title: "Cultural Heritage Preservation Award",
    category: "Arts & Culture",
    nominee: "Prof. Shantha Wickramasinghe",
    nomineeId: 2,
    description: "Lifetime achievement in digital preservation of 12,000 ancient Sri Lankan palm-leaf ola manuscripts.",
    status: "Nominee",
    year: 2026,
    presenter: "Ministry of Cultural Affairs & Heritage",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    votes: 0,
    icon: "🎖️"
  },
  {
    id: 102,
    title: "Traditional Arts Revitalization Prize",
    category: "Arts & Culture",
    nominee: "Kalasuri Rohana Baddegama",
    nomineeId: null,
    description: "Preserved Sabaragamuwa folk rituals and founded free training academies for over 3,000 rural youth.",
    status: "Nominee",
    year: 2026,
    presenter: "Arts Council of Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    votes: 0,
    icon: "🎭"
  },
  {
    id: 202,
    title: "Indigenous Performing Arts & Dance Master",
    category: "Arts & Culture",
    nominee: "Heshma Wignaraja",
    nomineeId: null,
    description: "Global ambassador for Sri Lankan classical Kandyan dance theater, mentoring young dancers across 20 international cultural tours.",
    status: "Nominee",
    year: 2026,
    presenter: "Chitrasena Cultural Foundation & UNESCO Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    votes: 0,
    icon: "💃"
  },
  {
    id: 3,
    title: "Green Innovation Pioneer Award",
    category: "Environment & Technology",
    nominee: "Eng. Priyantha Dissanayake",
    nomineeId: 3,
    description: "Engineered micro-solar power solutions powering 150,000 off-grid agrarian households across the Dry Zone.",
    status: "Nominee",
    year: 2026,
    presenter: "Sri Lanka Sustainable Energy Authority",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    votes: 0,
    icon: "⚡"
  },
  {
    id: 103,
    title: "Marine Ecology Restoration Award",
    category: "Environment & Technology",
    nominee: "Chamari Senaratne",
    nomineeId: null,
    description: "Developed biodegradable coral-reef seeding matrices restoring 40 kilometers of southern coastal reef ecosystems.",
    status: "Nominee",
    year: 2026,
    presenter: "National Aquatic Resources Agency (NARA)",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    votes: 0,
    icon: "🌊"
  },
  {
    id: 203,
    title: "Biodiversity & Wildlife Conservation Fellowship",
    category: "Environment & Technology",
    nominee: "Dr. Sumith Pilapitiya",
    nomineeId: null,
    description: "Architect of community-based human-elephant conflict mitigation fences protecting 45 agrarian villages across the North Central Province.",
    status: "Nominee",
    year: 2026,
    presenter: "Wildlife and Nature Protection Society (WNPS)",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    votes: 0,
    icon: "🐘"
  },
  {
    id: 4,
    title: "Social Impact Champion Award",
    category: "Social Service",
    nominee: "Mrs. Kamala Perera",
    nomineeId: 4,
    description: "Guaranteed secondary education and university sponsorships for 10,000+ girls in vulnerable communities.",
    status: "Nominee",
    year: 2026,
    presenter: "National Commission for Women",
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    votes: 0,
    icon: "💛"
  },
  {
    id: 104,
    title: "Elder Care & Dignity Honor",
    category: "Social Service",
    nominee: "Ven. Ananda Thero",
    nomineeId: null,
    description: "Established 8 community hospices and elder shelters providing compassionate dignity care without fee.",
    status: "Nominee",
    year: 2026,
    presenter: "National Social Services Council",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    votes: 0,
    icon: "🕊️"
  },
  {
    id: 204,
    title: "Grassroots Community Empowerment Prize",
    category: "Social Service",
    nominee: "K. Rathnasingham",
    nomineeId: null,
    description: "Rebuilt 32 village water irrigation reservoirs and community micro-credit banks supporting over 8,000 war-affected families.",
    status: "Nominee",
    year: 2026,
    presenter: "National Council for Voluntary Social Services",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    votes: 0,
    icon: "🌱"
  },
  {
    id: 5,
    title: "Sports Excellence & Mentorship Award",
    category: "Sports",
    nominee: "Ravi Jayawardena",
    nomineeId: 5,
    description: "Coached 14 national athletes to Asian Games podiums and runs free sports camps for underprivileged schools.",
    status: "Nominee",
    year: 2026,
    presenter: "Sri Lanka Sports Ministry & Olympic Committee",
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    votes: 0,
    icon: "🥇"
  },
  {
    id: 105,
    title: "Para-Athletics Trailblazer Award",
    category: "Sports",
    nominee: "Dilani Fernando",
    nomineeId: null,
    description: "Paralympic archery medalist advocating and creating adaptive sports training facilities island-wide.",
    status: "Nominee",
    year: 2026,
    presenter: "National Paralympic Committee",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    votes: 0,
    icon: "🎯"
  },
  {
    id: 205,
    title: "Youth Athletics & Olympic Promise Honor",
    category: "Sports",
    nominee: "Tharushi Karunarathne",
    nomineeId: null,
    description: "Asian Games 800m Gold Medalist inspiring a generation of schoolgirl athletes from rural schools to compete on world athletic stages.",
    status: "Nominee",
    year: 2026,
    presenter: "Athletics Association of Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    votes: 0,
    icon: "🏃‍♀️"
  },
  {
    id: 6,
    title: "Humanitarian Service Leadership Award",
    category: "Humanitarian Service",
    nominee: "Maj. Gen. (Ret.) Arjuna Silva",
    nomineeId: 8,
    description: "Led humanitarian mine-clearing of 15,000 hectares, enabling 80,000 displaced citizens to rebuild their lives in peace.",
    status: "Nominee",
    year: 2026,
    presenter: "United Nations Human Rights Council & Sri Lanka Office",
    thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    votes: 0,
    icon: "🌟"
  },
  {
    id: 106,
    title: "Disaster Relief Vanguard Honor",
    category: "Humanitarian Service",
    nominee: "Sister Mary Bernadette",
    nomineeId: null,
    description: "Coordinated emergency flood and landslide rescue feeding stations serving 200,000 meals during monsoon emergencies.",
    status: "Nominee",
    year: 2026,
    presenter: "Sri Lanka Red Cross Society",
    thumbnail: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80",
    votes: 0,
    icon: "🤝"
  },
  {
    id: 206,
    title: "Crisis Response & Resettlement Fellowship",
    category: "Humanitarian Service",
    nominee: "Dr. Kasun Pathirana",
    nomineeId: null,
    description: "Directed volunteer doctors network providing 24/7 trauma and emergency surgeries across drought and flood disaster corridors.",
    status: "Nominee",
    year: 2026,
    presenter: "Disaster Management Center & WHO Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    votes: 0,
    icon: "🕊️"
  },
  {
    id: 7,
    title: "National Education Vanguard & STEM Leadership Award",
    category: "Education",
    nominee: "Prof. Malik Ranasinghe",
    nomineeId: null,
    description: "Transformed digital engineering education and university research incubation, graduating 15,000 modern IT and engineering innovators.",
    status: "Nominee",
    year: 2026,
    presenter: "National Science Foundation Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    votes: 0,
    icon: "🎓"
  },
  {
    id: 107,
    title: "Rural Schools Literacy & Digital Access Prize",
    category: "Education",
    nominee: "Sandamali Jayakody",
    nomineeId: null,
    description: "Equipped 120 remote rural schools with off-grid solar computer labs and digital Sinhala/Tamil multimedia libraries.",
    status: "Nominee",
    year: 2026,
    presenter: "Ministry of Education & NIE Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    votes: 0,
    icon: "📚"
  },
  {
    id: 207,
    title: "Inclusive Special Needs Education Laureate",
    category: "Education",
    nominee: "K. Sivalingam",
    nomineeId: null,
    description: "Pioneered trilingual braille and sign-language learning frameworks integrated into over 200 mainstream secondary schools.",
    status: "Nominee",
    year: 2026,
    presenter: "Sri Lanka Special Education Teachers Guild",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    votes: 0,
    icon: "📖"
  }
];

// ── VOTING CONFIGURATION & DURATION HELPER ──────────────────────────────────
// Voting runs for a specific time duration. When deadline expires, the nominee with the
// highest votes in each category is automatically decided and published as Winner!
function getDefaultVotingConfig() {
  // Default deadline: 3 days from current time
  const defaultDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  return {
    seasonTitle: "National Honors Community Voting 2026",
    deadline: defaultDeadline,
    isActive: true,
    autoDecideWinners: true,
    lastResolvedAt: null,
    totalVoters: 0,
  };
}

export function getVotingConfig() {
  try {
    const raw = localStorage.getItem(VOTING_CONFIG_KEY);
    if (!raw) {
      const cfg = getDefaultVotingConfig();
      localStorage.setItem(VOTING_CONFIG_KEY, JSON.stringify(cfg));
      return cfg;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultVotingConfig();
  }
}

export function saveVotingConfig(updatedConfig) {
  try {
    const current = getVotingConfig();
    const merged = { ...current, ...updatedConfig };
    localStorage.setItem(VOTING_CONFIG_KEY, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.error('Error saving voting config', e);
    return updatedConfig;
  }
}

// ── AUTOMATIC WINNER RESOLUTION ───────────────────────────────────────────
// In each category, determines candidate with highest votes as Winner.
export function checkAndResolveWinners(forceNow = false) {
  const config = getVotingConfig();
  const deadlineTime = new Date(config.deadline).getTime();
  const isExpired = Date.now() >= deadlineTime;

  if (!forceNow && (!isExpired || !config.isActive)) {
    return { resolved: false, isExpired, config };
  }

  // Load all awards
  const allAwards = getAllAwards();
  const byCategory = {};

  // Group by category
  allAwards.forEach((item) => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  const winnersList = [];
  const updatedAwards = [];

  // For each category, nominee with maximum votes is Winner
  Object.keys(byCategory).forEach((cat) => {
    const list = byCategory[cat];
    // Sort descending by votes
    const sorted = [...list].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const highestVote = sorted[0]?.votes || 0;

    sorted.forEach((item, index) => {
      // Top vote candidate is Winner
      if (index === 0 && highestVote > 0) {
        const winnerItem = {
          ...item,
          status: 'Winner',
          wonDate: new Date().toISOString(),
          decisionMethod: 'Community Vote (Auto-Resolved)'
        };
        winnersList.push(winnerItem);
        updatedAwards.push(winnerItem);
      } else {
        updatedAwards.push({
          ...item,
          status: 'Nominee'
        });
      }
    });
  });

  // Save updated awards
  localStorage.setItem(AWARDS_KEY, JSON.stringify(updatedAwards));

  // Mark voting config as concluded
  const updatedConfig = saveVotingConfig({
    isActive: false,
    lastResolvedAt: new Date().toISOString()
  });

  return {
    resolved: true,
    isExpired: true,
    winners: winnersList,
    config: updatedConfig
  };
}

function getStoredAwards() {
  try {
    const r = localStorage.getItem(AWARDS_KEY);
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

function initAwards() {
  const stored = getStoredAwards();
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    localStorage.setItem(AWARDS_KEY, JSON.stringify(seedAwards));
    return seedAwards;
  }

  // Ensure all seed awards exist in stored and clean legacy mock vote counts (>1000)
  const existingIds = new Set(stored.map(a => a.id));
  let modified = false;
  const merged = stored.map(item => {
    // Reset legacy mock counts (>1000) from previous hardcoded seeds
    if (typeof item.votes === 'number' && item.votes > 1000) {
      modified = true;
      return { ...item, votes: 0 };
    }
    return item;
  });

  seedAwards.forEach(seed => {
    if (!existingIds.has(seed.id)) {
      merged.push(seed);
      modified = true;
    }
  });

  if (modified) {
    localStorage.setItem(AWARDS_KEY, JSON.stringify(merged));
  }

  return merged;
}

import api from '../services/api';

let inMemoryAwards = null;

export function setCachedAwards(awardsList) {
  if (Array.isArray(awardsList)) {
    inMemoryAwards = awardsList;
    try {
      localStorage.setItem(AWARDS_KEY, JSON.stringify(awardsList));
    } catch (e) {
      console.error('Error caching awards:', e);
    }
  }
}

export function getAllAwards() {
  if (inMemoryAwards && inMemoryAwards.length > 0) {
    return inMemoryAwards;
  }
  const awards = initAwards();
  inMemoryAwards = awards;
  // Auto-check if deadline expired and resolve winners if active
  const cfg = getVotingConfig();
  if (cfg.isActive && cfg.autoDecideWinners && Date.now() >= new Date(cfg.deadline).getTime()) {
    checkAndResolveWinners();
    return initAwards();
  }
  return awards;
}

export async function fetchAwardsFromApi(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/awards${query ? `?${query}` : ''}`);
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const normalized = res.data.map(item => ({
        ...item,
        id: item._id || item.id,
      }));
      inMemoryAwards = normalized;
      localStorage.setItem(AWARDS_KEY, JSON.stringify(normalized));
      return normalized;
    }
  } catch (err) {
    console.warn('API fetch for awards failed, using cache:', err.message);
  }
  return getAllAwards();
}

export async function saveAward(awardData) {
  try {
    const isEdit = awardData._id || (typeof awardData.id === 'string' && awardData.id.length === 24);
    let resultAward;

    if (isEdit) {
      const id = awardData._id || awardData.id;
      const res = await api.put(`/awards/${id}`, awardData);
      resultAward = res.data ? { ...res.data, id: res.data._id || id } : awardData;
    } else {
      const res = await api.post('/awards', awardData);
      resultAward = res.data ? { ...res.data, id: res.data._id } : { ...awardData, id: Date.now() };
    }

    const current = getAllAwards();
    const updated = [
      resultAward,
      ...current.filter(a => a.id !== resultAward.id && a._id !== resultAward._id)
    ];
    inMemoryAwards = updated;
    localStorage.setItem(AWARDS_KEY, JSON.stringify(updated));
    return resultAward;
  } catch (e) {
    console.error('Error saving award via API, saving to local cache', e);
    const current = initAwards();
    const award = { ...awardData, id: awardData.id || Date.now() };
    const updated = [award, ...current.filter(a => a.id !== award.id)];
    inMemoryAwards = updated;
    localStorage.setItem(AWARDS_KEY, JSON.stringify(updated));
    return award;
  }
}

// ── USER NOMINATION / SUGGESTION ──────────────────────────────────────────
export async function nominateCandidate(nominationData) {
  const newAwardData = {
    title: nominationData.title || `${nominationData.category} Community Laureate 2026`,
    category: nominationData.category || 'Social Service',
    nominee: nominationData.nominee,
    nomineeId: nominationData.nomineeId || '',
    description: nominationData.description || 'Nominated by community member for distinguished national contributions.',
    status: 'Nominee',
    year: 2026,
    presenter: nominationData.presenter || `Nominated by ${nominationData.nominatorName || 'Community Member'} (${nominationData.nominatorDistrict || 'Sri Lanka'})`,
    thumbnail: nominationData.thumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    votes: 1,
    icon: nominationData.icon || '🏅',
  };

  try {
    const saved = await saveAward(newAwardData);
    if (newAwardData.category) {
      addAwardCategory(newAwardData.category);
    }
    return saved;
  } catch (e) {
    console.error('Error adding nomination', e);
    return null;
  }
}

export async function deleteAward(id) {
  try {
    if (typeof id === 'string' && id.length === 24) {
      await api.delete(`/awards/${id}`);
    }
  } catch (e) {
    console.warn('Error deleting award via API:', e.message);
  }
  const current = getAllAwards();
  const filtered = current.filter(a => a.id !== id && a._id !== id);
  inMemoryAwards = filtered;
  localStorage.setItem(AWARDS_KEY, JSON.stringify(filtered));
  return filtered;
}

export async function voteForAwardApi(id) {
  try {
    const res = await api.post(`/awards/${id}/vote`);
    return res;
  } catch (e) {
    console.warn('Error voting for award via API:', e.message);
    return null;
  }
}

// ── DYNAMIC CATEGORY MANAGEMENT ─────────────────────────────────────────
const CATEGORIES_KEY = 'pf_award_categories';

export const defaultAwardCategories = [
  "Healthcare",
  "Arts & Culture",
  "Environment & Technology",
  "Social Service",
  "Sports",
  "Humanitarian Service",
  "Education"
];

export function getAllAwardCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultAwardCategories));
      return ["All", ...defaultAwardCategories];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultAwardCategories));
      return ["All", ...defaultAwardCategories];
    }
    // Ensure all default categories are present
    const combined = [...parsed];
    defaultAwardCategories.forEach(defCat => {
      if (!combined.some(c => c.toLowerCase() === defCat.toLowerCase())) {
        combined.push(defCat);
      }
    });
    return ["All", ...combined];
  } catch {
    return ["All", ...defaultAwardCategories];
  }
}

export function addAwardCategory(categoryName) {
  const trimmed = categoryName?.trim();
  if (!trimmed) return { success: false, message: 'Category name cannot be empty' };

  try {
    const categories = getAllAwardCategories().filter(c => c !== 'All');
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, message: `Category "${trimmed}" already exists.` };
    }
    const updated = [...categories, trimmed];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    return { success: true, message: `Category "${trimmed}" added successfully!`, category: trimmed };
  } catch (e) {
    console.error('Error adding award category', e);
    return { success: false, message: 'Failed to add category' };
  }
}

export function deleteAwardCategory(categoryName) {
  if (!categoryName || categoryName === 'All') return { success: false, message: 'Invalid category' };

  try {
    const categories = getAllAwardCategories().filter(c => c !== 'All');
    const updated = categories.filter(c => c.toLowerCase() !== categoryName.toLowerCase());
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    return { success: true, message: `Category "${categoryName}" removed.` };
  } catch (e) {
    console.error('Error deleting award category', e);
    return { success: false, message: 'Failed to delete category' };
  }
}

// Kept for backward compatibility
export const awardCategories = getAllAwardCategories();


