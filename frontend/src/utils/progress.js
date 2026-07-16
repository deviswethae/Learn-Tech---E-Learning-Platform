
const keyFor = (userId, courseId) => `progress_${userId}_${courseId}`;

export function getWatchedVideoIds(userId, courseId) {
  try {
    return JSON.parse(localStorage.getItem(keyFor(userId, courseId))) || [];
  } catch {
    return [];
  }
}

export function markVideoWatched(userId, courseId, videoId) {
  const current = getWatchedVideoIds(userId, courseId);
  if (!current.includes(videoId)) {
    const updated = [...current, videoId];
    localStorage.setItem(keyFor(userId, courseId), JSON.stringify(updated));
    return updated;
  }
  return current;
}

// totalVideos comes from course.videos.length (populate via
// /videos/courseVideos/:courseId). Returns a whole-number percent, 0 when
// there are no videos yet so we never divide by zero.
export function calcProgress(watchedCount, totalVideos) {
  if (!totalVideos) return 0;
  return Math.min(100, Math.round((watchedCount / totalVideos) * 100));
}