import React from 'react';
import { Letter as LetterType } from '../types/game';
import { Flame, Droplets, Wind, Mountain, Star, Zap, Diamond } from 'lucide-react';

const elementIcons = {
  fire: Flame,
  water: Droplets,
  air: Wind,
  earth: Mountain,
  star: Star,
  lightning: Zap,
  crystal: Diamond,
};

const elementClasses = {
  fire: 'element-fire',
  water: 'element-water',
  earth: 'element-earth',
  air: 'element-air',
  star: 'element-star',
  lightning: 'element-lightning',
  crystal: 'element-crystal'
};

const elementTextColors = {
  fire: 'text-white',
  water: 'text-white',
  earth: 'text-white',
  air: 'text-gray-800',
  star: 'text-gray-800',
  lightning: 'text-white',
  crystal: 'text-white'
};

const elementParticles = {
  fire: '🔥',
  water: '💧',
  air: '💨',
  earth: '🌱',
  star: '⭐',
  lightning: '⚡',
  crystal: '💎',
};

const isVowel = (char: string): boolean => {
  return ['A', 'E', 'I', 'O', 'U'].includes(char.toUpperCase());
};

interface LetterProps {
  letter: LetterType;
  onClick: () => void;
}

export const LetterTile: React.FC<LetterProps> = ({ letter, onClick }) => {
  if (!letter.element) {
    return (
      <button
        onClick={onClick}
        className={`
          tile bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600
          ${letter.selected ? 'selected' : ''}
        `}
      >
        <span className="text-white drop-shadow-lg">
          {letter.char}
        </span>
      </button>
    );
  }

  const Icon = elementIcons[letter.element];
  
  return (
    <button
      onClick={onClick}
      className={`
        tile ${elementClasses[letter.element]}
        ${letter.selected ? 'selected' : ''}
        ${elementTextColors[letter.element]}
      `}
    >
      <span className="transform transition-transform duration-300 drop-shadow-lg">
        {letter.char}
      </span>
      <Icon 
        className={`
          absolute -top-1 -right-1 w-8 h-8
          ${elementTextColors[letter.element]}
          transform transition-all duration-300
          ${letter.selected ? 'scale-125 animate-sparkle' : ''}
        `}
      />
      {letter.selected && (
        <>
          <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse-slow" />
          <div className="absolute -inset-2 pointer-events-none">
            <div className="particle absolute top-0 left-1/2 -translate-x-1/2 animate-float text-2xl">
              {elementParticles[letter.element]}
            </div>
          </div>
        </>
      )}
    </button>
  );
};