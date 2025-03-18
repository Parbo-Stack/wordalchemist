import { LeaderboardEntry } from '../components/Leaderboard';

const LEADERBOARD_KEY = 'wordAlchemistLeaderboard';
const LAST_USERNAME_KEY = 'wordAlchemistLastUsername';

export const saveScore = (username: string, score: number): void => {
  const leaderboard = getLeaderboard();
  const existingEntryIndex = leaderboard.findIndex(entry => entry.name === username);
  
  // Only add the score if it's higher than the user's existing score
  if (existingEntryIndex !== -1) {
    if (leaderboard[existingEntryIndex].score < score) {
      leaderboard[existingEntryIndex] = {
        name: username,
        score,
        date: new Date().toLocaleDateString()
      };
    }
  } else {
    // New user, add their score
    leaderboard.push({
      name: username,
      score,
      date: new Date().toLocaleDateString()
    });
  }
  
  // Sort by score (highest first) and keep top 10
  leaderboard.sort((a, b) => b.score - a.score);
  const topScores = leaderboard.slice(0, 10);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores));
  localStorage.setItem(LAST_USERNAME_KEY, username);
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const getLastUsername = (): string | null => {
  return localStorage.getItem(LAST_USERNAME_KEY);
};

export const hasHighScore = (username: string): boolean => {
  const leaderboard = getLeaderboard();
  return leaderboard.some(entry => entry.name === username);
};