import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UsernameModalProps {
  score: number;
  onSubmit: (username: string) => void;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ score, onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-gray-800/90 rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            New High Score!
          </h2>
        </div>
        
        <p className="text-lg mb-6">
          You scored <span className="font-bold text-yellow-400">{score.toLocaleString()}</span> points!
          Enter your name for the leaderboard:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            maxLength={20}
            className="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500/20 outline-none transition-all duration-300"
            autoFocus
          />
          
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-lg font-semibold
              hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105
              shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Submit Score
          </button>
        </form>
      </div>
    </div>
  );
};