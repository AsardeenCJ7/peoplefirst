/**
 * Utility helper to extract clean 11-character YouTube Video ID from any YouTube URL or raw ID string.
 * Supports:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://youtube.com/shorts/dQw4w9WgXcQ
 * - https://youtube.com/live/dQw4w9WgXcQ
 * - Raw ID: dQw4w9WgXcQ
 */
export function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const str = String(urlOrId).trim();
  if (!str) return '';

  // Match 11-character ID from all standard YouTube URL patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = str.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }

  // If it's already an 11-character raw video ID
  if (str.length === 11 && !str.includes('/') && !str.includes('.')) {
    return str;
  }

  // Fallback: return input string
  return str;
}
