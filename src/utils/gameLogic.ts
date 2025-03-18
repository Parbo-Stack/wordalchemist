import { Letter, ElementType, ElementalCombo, RareElement, WordScore } from '../types/game';
import englishWords from 'an-array-of-english-words';
import { playSound } from './sound';

const WORD_SET = new Set(englishWords);

const BASE_POINTS: Record<number, number> = {
  3: 100,
  4: 200,
  5: 400,
  6: 600,
  7: 800,
  8: 1000,
  9: 1200,
  10: 1500
};

const ELEMENTS: ElementType[] = ['fire', 'water', 'earth', 'air'];

const RARE_ELEMENTS: RareElement[] = [
  { type: 'star', bonus: 200, probability: 0.03 },
  { type: 'lightning', bonus: 0, probability: 0.02 },
  { type: 'crystal', bonus: 500, probability: 0.02 },
];

const ELEMENT_COMBOS: ElementalCombo[] = [
  { name: 'Inferno', multiplier: 1.5, elements: ['fire', 'air'] },
  { name: 'Mud', multiplier: 1.3, elements: ['water', 'earth'] },
  { name: 'Steam', multiplier: 0.8, elements: ['fire', 'water'] },
  { name: 'Dust', multiplier: 1.2, elements: ['air', 'earth'] },
  { name: 'Storm', multiplier: 2.0, elements: ['air', 'water'] },
  { name: 'Lava', multiplier: 1.8, elements: ['fire', 'earth'] },
];

const LETTER_FREQUENCIES: Record<string, number> = {
  'E': 12, 'A': 9, 'I': 9, 'O': 8, 'N': 6, 'R': 6, 'T': 6,
  'L': 4, 'S': 4, 'U': 4, 'D': 4, 'G': 3, 'B': 2, 'C': 2,
  'M': 2, 'P': 2, 'F': 2, 'H': 2, 'V': 2, 'W': 2, 'Y': 2,
  'K': 1, 'J': 1, 'X': 1, 'Q': 1, 'Z': 1
};

const getBasePoints = (length: number): number => {
  return BASE_POINTS[Math.min(length, 10)] || BASE_POINTS[10];
};

const shouldGenerateElement = (wordsSubmitted: number): boolean => {
  const baseChance = 0.15;
  const progressBonus = Math.min(wordsSubmitted / 100, 0.10);
  return Math.random() < (baseChance + progressBonus);
};

const shouldGenerateRareElement = (wordsSubmitted: number): boolean => {
  const baseChance = 0.05;
  const progressBonus = Math.min(wordsSubmitted / 200, 0.05);
  return Math.random() < (baseChance + progressBonus);
};

const getRareElement = (): ElementType | null => {
  const random = Math.random();
  let probabilitySum = 0;

  for (const rare of RARE_ELEMENTS) {
    probabilitySum += rare.probability;
    if (random < probabilitySum) {
      return rare.type;
    }
  }

  return null;
};

const getRandomElement = (): ElementType => {
  return ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
};

export const generateLetterPool = (): Letter[] => {
  const pool: Letter[] = [];
  
  Object.entries(LETTER_FREQUENCIES).forEach(([letter, frequency]) => {
    for (let i = 0; i < frequency; i++) {
      pool.push({
        char: letter,
        element: null,
        selected: false
      });
    }
  });

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
};

export const drawFromPool = (pool: Letter[], count: number, wordsSubmitted: number): [Letter[], Letter[]] => {
  const drawn = pool.slice(0, count);
  const remainingPool = pool.slice(count);

  if (shouldGenerateRareElement(wordsSubmitted)) {
    const rareElement = getRareElement();
    if (rareElement) {
      const randomIndex = Math.floor(Math.random() * drawn.length);
      drawn[randomIndex] = {
        ...drawn[randomIndex],
        element: rareElement
      };
    }
  }

  drawn.forEach((tile, index) => {
    if (!tile.element && shouldGenerateElement(wordsSubmitted)) {
      drawn[index] = {
        ...tile,
        element: getRandomElement()
      };
    }
  });

  return [drawn, remainingPool];
};

export const replenishPool = (pool: Letter[]): Letter[] => {
  if (pool.length < 50) {
    return [...pool, ...generateLetterPool()];
  }
  return pool;
};

const elementSoundMap: Record<ElementType, string> = {
  fire: 'fire',
  water: 'water',
  earth: 'earth',
  air: 'wind',
  star: 'star',
  lightning: 'thunder',
  crystal: 'crystal'
};

const playElementSound = (element: ElementType) => {
  const soundName = elementSoundMap[element];
  if (soundName) {
    try {
      playSound(soundName);
    } catch (error) {
      console.warn(`Could not play sound for element: ${element}`);
    }
  }
};

export const calculateWordScore = (word: Letter[]): WordScore => {
  const basePoints = getBasePoints(word.length);
  let multiplier = 1;
  let bonusPoints = 0;
  const combos: string[] = [];
  const elements = word.map(l => l.element).filter(Boolean) as ElementType[];

  const elementCounts = elements.reduce((acc, element) => {
    acc[element] = (acc[element] || 0) + 1;
    return acc;
  }, {} as Record<ElementType, number>);

  let hasUsedRareElement = false;
  elements.forEach(element => {
    if (!hasUsedRareElement && (element === 'star' || element === 'lightning' || element === 'crystal')) {
      hasUsedRareElement = true;
      if (element === 'star') {
        bonusPoints += 200;
        combos.push('Star Power');
        playElementSound('star');
      } else if (element === 'lightning') {
        multiplier *= 2;
        combos.push('Lightning Strike');
        playElementSound('lightning');
      } else if (element === 'crystal') {
        bonusPoints += 500;
        combos.push('Crystal Magic');
        playElementSound('crystal');
      }
    }
  });

  ELEMENT_COMBOS.forEach(combo => {
    const hasCombo = combo.elements.every(element => 
      elements.includes(element) && elementCounts[element] >= 1
    );
    if (hasCombo) {
      multiplier *= combo.multiplier;
      combos.push(combo.name);
      combo.elements.forEach(element => playElementSound(element));
    }
  });

  const total = Math.floor((basePoints * multiplier) + bonusPoints);

  return {
    basePoints,
    bonusPoints,
    multiplier,
    total,
    combos,
  };
};

export const isValidWord = (word: string): boolean => {
  return word.length >= 3 && WORD_SET.has(word.toLowerCase());
};