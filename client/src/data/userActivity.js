// ── User Activity & Persistence Helpers (Likes, Votes, Saves, Profile) ─────
import { getAllNews } from './news';
import { getAllAwards, saveAward, voteForAwardApi, setCachedAwards } from './awards';

import { getAllAchievers } from './achievers';

const USER_ACTIVITY_PREFIX = 'pf_user_activity_';
const ITEM_LIKES_PREFIX = 'pf_item_likes_';

function getUserActivityKey(email) {
  return `${USER_ACTIVITY_PREFIX}${email ? email.toLowerCase().trim() : 'guest'}`;
}

export function getUserActivity(email) {
  if (!email) return { likedNewsIds: [], likedAchieverIds: [], votedAwardIds: [], savedNewsIds: [], profile: {} };
  try {
    const key = getUserActivityKey(email);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { likedNewsIds: [], likedAchieverIds: [], votedAwardIds: [], savedNewsIds: [], profile: {} };
  } catch (e) {
    console.error('Error reading user activity', e);
    return { likedNewsIds: [], likedAchieverIds: [], votedAwardIds: [], savedNewsIds: [], profile: {} };
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

// ── Likes Count Persistence ───────────────────────────────────────────────
export function getItemLikesCount(itemKey, defaultCount = 0) {
  try {
    const val = localStorage.getItem(`${ITEM_LIKES_PREFIX}${itemKey}`);
    return val !== null ? parseInt(val, 10) : defaultCount;
  } catch {
    return defaultCount;
  }
}

export function setItemLikesCount(itemKey, count) {
  try {
    localStorage.setItem(`${ITEM_LIKES_PREFIX}${itemKey}`, String(Math.max(0, count)));
  } catch (e) {
    console.error('Error saving item likes count', e);
  }
}

// ── News Likes ─────────────────────────────────────────────────────────────
export function isNewsLiked(email, newsId) {
  if (!email || !newsId) return false;
  const act = getUserActivity(email);
  return (act.likedNewsIds || []).some(id => String(id) === String(newsId));
}

export function toggleLikeNews(email, newsId) {
  if (!email || !newsId) return false;
  const act = getUserActivity(email);
  act.likedNewsIds = act.likedNewsIds || [];
  const numericId = Number(newsId);
  const exists = act.likedNewsIds.some(id => String(id) === String(newsId));
  
  if (exists) {
    act.likedNewsIds = act.likedNewsIds.filter(id => String(id) !== String(newsId));
  } else {
    act.likedNewsIds = [numericId || newsId, ...act.likedNewsIds];
  }
  
  saveUserActivity(email, act);
  return !exists; // returns new liked state
}

export function getUserLikedNews(email) {
  if (!email) return [];
  const act = getUserActivity(email);
  const allNews = getAllNews();
  return (act.likedNewsIds || [])
    .map(id => allNews.find(n => String(n.id) === String(id) || String(n._id) === String(id)))
    .filter(Boolean);
}

// ── Achiever Likes ─────────────────────────────────────────────────────────
export function isAchieverLiked(email, achieverId) {
  if (!email || !achieverId) return false;
  const act = getUserActivity(email);
  return (act.likedAchieverIds || []).some(id => String(id) === String(achieverId));
}

export function toggleLikeAchiever(email, achieverId) {
  if (!email || !achieverId) return false;
  const act = getUserActivity(email);
  act.likedAchieverIds = act.likedAchieverIds || [];
  const numericId = Number(achieverId);
  const exists = act.likedAchieverIds.some(id => String(id) === String(achieverId));
  
  if (exists) {
    act.likedAchieverIds = act.likedAchieverIds.filter(id => String(id) !== String(achieverId));
  } else {
    act.likedAchieverIds = [numericId || achieverId, ...act.likedAchieverIds];
  }
  
  saveUserActivity(email, act);
  return !exists; // returns new liked state
}

export function getUserLikedAchievers(email) {
  if (!email) return [];
  const act = getUserActivity(email);
  const allAchievers = getAllAchievers();
  return (act.likedAchieverIds || [])
    .map(id => allAchievers.find(a => String(a.id) === String(id) || String(a._id) === String(id)))
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
  const allAwards = getAllAwards();
  const targetAward = allAwards.find(
    a => String(a.id) === String(awardId) || String(a._id) === String(awardId)
  );
  const idsToCheck = [String(awardId)];
  if (targetAward?.id != null) idsToCheck.push(String(targetAward.id));
  if (targetAward?._id != null) idsToCheck.push(String(targetAward._id));
  return (act.votedAwardIds || []).some(id => idsToCheck.includes(String(id)));
}

// Check which candidate the user voted for in a specific category (if any)
export function getUserCategoryVote(email, category) {
  if (!email || !category) return null;
  const act = getUserActivity(email);
  const allAwards = getAllAwards();
  const votedAward = allAwards.find(a => {
    if (a.category !== category) return false;
    const aId = String(a.id);
    const a_Id = String(a._id);
    return (act.votedAwardIds || []).some(id => String(id) === aId || String(id) === a_Id);
  });
  return votedAward || null;
}

export function toggleVoteAward(email, awardId) {
  if (!email || !awardId) return { voted: false, count: 0, awards: getAllAwards() };
  const act = getUserActivity(email);
  act.votedAwardIds = act.votedAwardIds || [];
  const allAwards = [...getAllAwards()];
  const targetAward = allAwards.find(
    a => String(a.id) === String(awardId) || String(a._id) === String(awardId)
  );
  if (!targetAward) return { voted: false, count: 0, awards: allAwards };

  const idsToCheck = [String(awardId)];
  if (targetAward.id != null) idsToCheck.push(String(targetAward.id));
  if (targetAward._id != null) idsToCheck.push(String(targetAward._id));

  // Check if user already voted in this category
  const categoryVotedAward = allAwards.find(a => {
    if (a.category !== targetAward.category) return false;
    const aId = String(a.id);
    const a_Id = String(a._id);
    return act.votedAwardIds.some(id => String(id) === aId || String(id) === a_Id);
  });

  if (categoryVotedAward) {
    const isSameCandidate = String(categoryVotedAward.id) === String(targetAward.id) || String(categoryVotedAward._id) === String(targetAward._id);
    return {
      voted: isSameCandidate,
      locked: true,
      count: targetAward.votes || 0,
      category: targetAward.category,
      awards: allAwards,
      message: isSameCandidate
        ? `Your vote for ${targetAward.nominee} in ${targetAward.category} is locked and final.`
        : `You have already cast your vote for ${categoryVotedAward.nominee} in ${targetAward.category}. Category votes are final.`
    };
  }

  // Cast single permanent vote for target nominee
  const targetId = targetAward._id || targetAward.id;
  if (typeof targetId === 'string' && targetId.length === 24) {
    voteForAwardApi(targetId).catch(() => {});
  }

  const voteIdToStore = targetAward._id || targetAward.id || awardId;
  act.votedAwardIds = [voteIdToStore, ...act.votedAwardIds];
  const newCount = (targetAward.votes || 0) + 1;
  targetAward.votes = newCount;
  saveUserActivity(email, act);
  setCachedAwards(allAwards);

  return {
    voted: true,
    locked: true,
    count: newCount,
    category: targetAward.category,
    awards: allAwards,
    message: `Your vote for ${targetAward.nominee} in ${targetAward.category} was successfully registered and locked!`
  };
}

export function getUserVotedAwards(email) {
  if (!email) return [];
  const act = getUserActivity(email);
  const allAwards = getAllAwards();
  const seenCategories = new Set();
  const result = [];

  // Iterate over voted IDs, taking the unique nominee for each category
  for (const id of (act.votedAwardIds || [])) {
    const award = allAwards.find(a => String(a.id) === String(id) || String(a._id) === String(id));
    if (award && !seenCategories.has(award.category)) {
      seenCategories.add(award.category);
      result.push(award);
    }
  }
  return result;
}
