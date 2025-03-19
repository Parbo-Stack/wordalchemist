export type ElementType = 'fire' | 'water' | 'earth' | 'air' | 'star' | 'lightning' | 'crystal';
export type GameMode = 'timed' | 'endless';
export type SoundType = 'clear' | 'click' | 'combo' | 'countdown' | 'crystal' | 'earth' | 'error' | 'fire' | 'message' | 'score' | 'send' | 'shuffle' | 'star' | 'start' | 'thunder' | 'water' | 'wind' | 'highScore' | 'timeUp';

export interface Letter {
  char: string;
  element: ElementType | null;
  selected: boolean;
}

export interface GameWordScore {
  word: string;
  score: number;
}

export interface GameState {
  letters: Letter[];
  letterPool: Letter[];
  score: number;
  currentWord: Letter[];
  tower: string[];
  wordScores: GameWordScore[];
  level: number;
  combo: number;
  wordsSubmitted: number;
}

export interface ElementalCombo {
  name: string;
  multiplier: number;
  elements: ElementType[];
}

export interface RareElement {
  type: ElementType;
  bonus: number;
  probability: number;
}

export interface WordScore {
  basePoints: number;
  bonusPoints: number;
  multiplier: number;
  total: number;
  combos: string[];
}

export interface ElementalEffect {
  name: string;
  description: string;
  animation: string;
  sound: SoundType;
}

export const ELEMENT_EFFECTS: Record<ElementType, ElementalEffect> = {
  star: {
    name: 'Star Power',
    description: 'Can replace any letter and adds +200 points',
    animation: 'star-burst',
    sound: 'star'
  },
  lightning: {
    name: 'Lightning Strike',
    description: 'Doubles word score',
    animation: 'lightning-flash',
    sound: 'thunder'
  },
  crystal: {
    name: 'Crystal Magic',
    description: 'Adds +500 points and triggers special effects',
    animation: 'crystal-shine',
    sound: 'crystal'
  },
  fire: {
    name: 'Flame',
    description: 'Basic fire element',
    animation: 'flame-flicker',
    sound: 'fire'
  },
  water: {
    name: 'Water',
    description: 'Basic water element',
    animation: 'water-ripple',
    sound: 'water'
  },
  earth: {
    name: 'Earth',
    description: 'Basic earth element',
    animation: 'earth-rumble',
    sound: 'earth'
  },
  air: {
    name: 'Air',
    description: 'Basic air element',
    animation: 'air-swirl',
    sound: 'wind'
  }
};