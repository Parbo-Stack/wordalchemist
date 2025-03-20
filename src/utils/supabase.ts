import { createClient } from '@supabase/supabase-js';
import type { LeaderboardEntry } from '../components/Leaderboard';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

export const saveScoreToSupabase = async (
  playerName: string,
  score: number,
  gameMode: string = 'timed'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('high_scores')
      .insert([
        {
          player_name: playerName,
          score: score,
          game_mode: gameMode
        }
      ]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving score:', error);
    throw new Error('Failed to save score to leaderboard');
  }
};

export const getGlobalLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('high_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(entry => ({
      name: entry.player_name,
      score: entry.score,
      date: new Date(entry.created_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};