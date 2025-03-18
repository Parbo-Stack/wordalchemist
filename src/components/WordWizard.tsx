import React from 'react';
import { Star } from 'lucide-react';

interface WordWizardProps {
  className?: string;
}

export const WordWizard: React.FC<WordWizardProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-6xl font-fantasy glow-text flex items-center gap-4 mb-6">
          <Star className="w-12 h-12 text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Word Alchemist
          </span>
          <Star className="w-12 h-12 text-pink-400" />
        </h1>
        <div className="text-xl text-gray-300 font-magical animate-float">
          Transform letters into magical words!
        </div>
      </div>
    </div>
  );
};