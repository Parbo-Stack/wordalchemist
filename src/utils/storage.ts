import { LeaderboardEntry } from '../components/Leaderboard';
import { saveScoreToSupabase } from './supabase';

const LAST_USERNAME_KEY = 'wordAlchemistLastUsername';

export const saveScore = async (username: string, score: number): Promise<void> => {
  try {
    await saveScoreToSupabase(username, score);
    localStorage.setItem(LAST_USERNAME_KEY, username);
  } catch (error) {
    console.error('Error saving score:', error);
  }
};

export const getLastUsername = (): string | null => {
  return localStorage.getItem(LAST_USERNAME_KEY);
};

export const hasHighScore = (username: string): boolean => {
  return true; // Always allow submitting scores for global leaderboard
};
