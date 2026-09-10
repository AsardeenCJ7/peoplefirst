// ── User Activity & Persistence Helpers (Likes, Votes, Saves, Profile) ─────
import { getAllNews } from './news';
import { getAllAwards, saveAward } from './awards';

const USER_ACTIVITY_PREFIX = 'pf_user_activity_';

function getUserActivityKey(email) {
  return `${USER_ACTIVITY_PREFIX}${email ? email.toLowerCase().trim() : 'guest'}`;
}

export function getUserActivity(email) {
  if (!email) return { likedNewsIds: [], votedAwardIds: [], savedNewsIds: [], profile: {} };
  try {
    const key = getUserActivityKey(email);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { likedNewsIds: [], votedAwardIds: [], savedNewsIds: [], profile: {} };
  } catch (e) {
    console.error('Error reading user activity', e);
    return { likedNewsIds: [], votedAwardIds: [], savedNewsIds: [], profile: {} };
  }
}

export function saveUserActivity(email, activity) {
  if (!email) return;
  try {
    const key = getUserActivityKey(email);
    localStorage.setItem(key, JSON.stringify(activity));
  } catch (e) {
    console.error('Error saving user activity', e);
  }
}

// ── Likes ──────────────────────────────────────────────────────────────────
export function isNewsLiked(email, newsId) {
  if (!email || !newsId) return false;
  const act = getUserActivity(email);
  return act.likedNewsIds.includes(Number(newsId)) || act.likedNewsIds.includes(String(newsId));
}

export function toggleLikeNews(email, newsId) {
  if (!email || !newsId) return false;
  const act = getUserActivity(email);
  const numericId = Number(newsId);
  const exists = act.likedNewsIds.some(id => String(id) === String(newsId));
  
  if (exists) {
    act.likedNewsIds = act.likedNewsIds.filter(id => String(id) !== String(newsId));
  } else {
    act.likedNewsIds = [numericId, ...act.likedNewsIds];
  }
  
  saveUserActivity(email, act);
  return !exists; // returns new liked state
}

export function getUserLikedNews(email) {
  if (!email) return [];
  const act = getUserActivity(email);
  const allNews = getAllNews();
  return act.likedNewsIds
    .map(id => allNews.find(n => String(n.id) === String(id)))
    .filter(Boolean);
}

// ── Bookmarks / Saves ──────────────────────────────────────────────────────
export function isNewsSaved(email, newsId) {
  if (!email || !newsId) return false;
  const act = getUserActivity(email);
  return act.savedNewsIds.includes(Number(newsId)) || act.savedNewsIds.includes(String(newsId));
}

export function toggleSaveNews(email, newsId) {
  if (!email || !newsId) return false;
  const act = getUserActivity(email);
  const numericId = Number(newsId);
  const exists = act.savedNewsIds.some(id => String(id) === String(newsId));
  
  if (exists) {
    act.savedNewsIds = act.savedNewsIds.filter(id => String(id) !== String(newsId));
  } else {
    act.savedNewsIds = [numericId, ...act.savedNewsIds];
  }
  
  saveUserActivity(email, act);
  return !exists;
}

export function getUserSavedNews(email) {
  if (!email) return [];
  const act = getUserActivity(email);
  const allNews = getAllNews();
  return act.savedNewsIds
    .map(id => allNews.find(n => String(n.id) === String(id)))
    .filter(Boolean);
}

// ── Award Votes (1 Vote Per User Per Category) ───────────────────────────
export function isAwardVoted(email, awardId) {
  if (!email || !awardId) return false;
  const act = getUserActivity(email);
  return (act.votedAwardIds || []).some(id => String(id) === String(awardId));
}

// Check which candidate the user voted for in a specific category (if any)
export function getUserCategoryVote(email, category) {
  if (!email || !category) return null;
  const act = getUserActivity(email);
  const allAwards = getAllAwards();
  const votedId = (act.votedAwardIds || []).find(id => {
    const a = allAwards.find(item => String(item.id) === String(id));
    return a && a.category === category;
  });
  return votedId ? allAwards.find(item => String(item.id) === String(votedId)) : null;
}

export function toggleVoteAward(email, awardId) {
  if (!email || !awardId) return { voted: false, count: 0 };
  const act = getUserActivity(email);
  const allAwards = getAllAwards();
  const targetAward = allAwards.find(a => String(a.id) === String(awardId));
  if (!targetAward) return { voted: false, count: 0 };

  const isAlreadyVoted = (act.votedAwardIds || []).some(id => String(id) === String(awardId));

  if (isAlreadyVoted) {
    // Retract vote
    act.votedAwardIds = act.votedAwardIds.filter(id => String(id) !== String(awardId));
    const newCount = Math.max(0, (targetAward.votes || 0) - 1);
    saveAward({ ...targetAward, votes: newCount });
    saveUserActivity(email, act);
    return {
      voted: false,
      count: newCount,
      category: targetAward.category,
      message: `Your vote for ${targetAward.nominee} was retracted.`
    };
  }

  // Enforce ONE vote per category: check if user already voted in this category
  let switchedFrom = null;
  const previousVoteId = (act.votedAwardIds || []).find(id => {
    if (String(id) === String(awardId)) return false;
    const prevAward = allAwards.find(a => String(a.id) === String(id));
    return prevAward && prevAward.category === targetAward.category;
  });

  if (previousVoteId) {
    const prevAward = allAwards.find(a => String(a.id) === String(previousVoteId));
    if (prevAward) {
      switchedFrom = prevAward.nominee;
      const prevCount = Math.max(0, (prevAward.votes || 0) - 1);
      saveAward({ ...prevAward, votes: prevCount });
    }
    act.votedAwardIds = act.votedAwardIds.filter(id => String(id) !== String(previousVoteId));
  }

  // Cast vote for target nominee
  act.votedAwardIds = [Number(awardId), ...(act.votedAwardIds || [])];
  const newCount = (targetAward.votes || 0) + 1;
  saveAward({ ...targetAward, votes: newCount });
  saveUserActivity(email, act);

  return {
    voted: true,
    count: newCount,
    switchedFrom,
    category: targetAward.category,
    message: switchedFrom
      ? `Vote switched from ${switchedFrom} to ${targetAward.nominee} in ${targetAward.category} (1 vote per category).`
      : `Your vote for ${targetAward.nominee} in ${targetAward.category} was recorded!`
  };
}

export function getUserVotedAwards(email) {
  if (!email) return [];
  const act = getUserActivity(email);
  const allAwards = getAllAwards();
  return (act.votedAwardIds || [])
    .map(id => allAwards.find(a => String(a.id) === String(id)))
    .filter(Boolean);
}
