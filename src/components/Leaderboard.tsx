import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Star } from 'lucide-react';
import { getGlobalLeaderboard } from '../utils/supabase';

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  currentScore: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGlobalLeaderboard();
        setEntries(data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="sticky top-8 bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Global Leaderboard
        </h2>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">
          <p>{error}</p>
          <p className="text-sm mt-2">Please ensure Supabase is connected</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {entries.map((entry, index) => (
            <div
              key={`${entry.name}-${entry.date}-${index}`}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 transform hover:scale-102 ${
                entry.score === currentScore
                  ? 'bg-purple-600/30 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-gray-700/50 hover:bg-gray-600/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {index === 0 ? (
                  <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                ) : index === 1 ? (
                  <Star className="w-6 h-6 text-gray-300" />
                ) : index === 2 ? (
                  <Star className="w-6 h-6 text-amber-600" />
                ) : (
                  <span className="text-lg font-bold text-gray-400 w-6">
                    #{index + 1}
                  </span>
                )}
                <div>
                  <p className="font-semibold">{entry.name}</p>
                  <p className="text-sm text-gray-400">{entry.date}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-yellow-400 glow-text">
                {typeof entry.score === 'number' ? entry.score.toLocaleString() : '0'}
              </p>
            </div>
          ))}
          
          {entries.length === 0 && (
            <div className="text-center py-12 px-4">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-transparent bg-clip-text">
                Your Legend Awaits!
              </h3>
              <p className="text-gray-400">
                Be the first to claim your place in the Word Alchemist hall of fame!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
