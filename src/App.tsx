import React, { useState, useEffect } from 'react';
import { LetterTile } from './components/Letter';
import { ScoreAnimation } from './components/ScoreAnimation';
import { ElementalEffect } from './components/ElementalEffects';
import { Leaderboard } from './components/Leaderboard';
import { UsernameModal } from './components/UsernameModal';
import { ShareScore } from './components/ShareScore';
import { generateLetterPool, drawFromPool, replenishPool, calculateWordScore, isValidWord } from './utils/gameLogic';
import { playSound, toggleSound, isSoundEnabled } from './utils/sound';
import { saveScore, getLeaderboard, getLastUsername, hasHighScore } from './utils/storage';
import { GameState, Letter, GameMode } from './types/game';
import { Trophy, Clock, Shuffle, RefreshCw, HelpCircle, X, Flame, Star, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_STATE: GameState = {
  letters: [],
  letterPool: generateLetterPool(),
  score: 0,
  currentWord: [],
  tower: [],
  wordScores: [],
  level: 1,
  combo: 1,
  wordsSubmitted: 0,
};

const GAME_TIME = 60;
const GRID_SIZE = 25;

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = { ...INITIAL_STATE };
    const [drawn, remainingPool] = drawFromPool(state.letterPool, GRID_SIZE, 0);
    state.letters = drawn;
    state.letterPool = remainingPool;
    return state;
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('timed');
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => getLeaderboard());
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const [animations, setAnimations] = useState<Array<{
    id: number;
    score: number;
    position: { x: number; y: number };
    element: Letter['element'];
    combos?: string[];
  }>>([]);

  useEffect(() => {
    let timer: number;
    if (isPlaying && gameMode === 'timed' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 10 && prev > 0 && soundOn) {
            playSound('countdown');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameMode, timeLeft, soundOn]);

  useEffect(() => {
    if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      if (soundOn) {
        playSound('timeUp');
      }
      const lastUsername = getLastUsername();
      if (lastUsername && hasHighScore(lastUsername)) {
        saveScore(lastUsername, gameState.score);
        setLeaderboard(getLeaderboard());
      } else {
        setShowUsernameModal(true);
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [timeLeft, gameState.score, isPlaying, soundOn]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      if (e.key === 'Enter') {
        submitWord();
        return;
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        clearSelection();
        return;
      }

      const key = e.key.toUpperCase();
      const letter = gameState.letters.find(l => 
        l.char === key && !l.selected && !gameState.currentWord.includes(l)
      );

      if (letter) {
        handleLetterClick(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameState.letters, gameState.currentWord]);

  const handleUsernameSubmit = (username: string) => {
    saveScore(username, gameState.score);
    setLeaderboard(getLeaderboard());
    setShowUsernameModal(false);
  };

  const handleLetterClick = (letter: Letter) => {
    if (!isPlaying && gameMode === 'timed') return;
    setErrorMessage(null);
    if (soundOn) {
      playSound('click');
    }
    
    setGameState(prev => {
      if (letter.selected) {
        return {
          ...prev,
          letters: prev.letters.map(l => 
            l === letter ? { ...l, selected: false } : l
          ),
          currentWord: prev.currentWord.filter(l => l !== letter)
        };
      }
      
      return {
        ...prev,
        letters: prev.letters.map(l => 
          l === letter ? { ...l, selected: true } : l
        ),
        currentWord: [...prev.currentWord, letter]
      };
    });
  };

  const handleSoundToggle = () => {
    const enabled = toggleSound();
    setSoundOn(enabled);
    if (enabled) {
      playSound('click');
    }
  };

  const clearSelection = () => {
    setGameState(prev => ({
      ...prev,
      letters: prev.letters.map(l => ({ ...l, selected: false })),
      currentWord: []
    }));
    setErrorMessage(null);
    if (soundOn) {
      playSound('clear');
    }
  };

  const submitWord = () => {
    const word = gameState.currentWord.map(l => l.char).join('');
    
    if (isValidWord(word)) {
      const wordScore = calculateWordScore(gameState.currentWord);
      const dominantElement = gameState.currentWord[0].element;
      
      const wordDisplay = document.querySelector('.word-display');
      const rect = wordDisplay?.getBoundingClientRect();
      
      if (rect) {
        setAnimations(prev => [...prev, {
          id: Date.now(),
          score: wordScore.total,
          position: { x: rect.left, y: rect.top },
          element: dominantElement,
          combos: wordScore.combos
        }]);

        if (wordScore.total >= 500) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }

      setGameState(prev => {
        const updatedPool = replenishPool(prev.letterPool);
        const [drawn, remainingPool] = drawFromPool(updatedPool, GRID_SIZE, prev.wordsSubmitted + 1);
        const newScore = prev.score + wordScore.total;

        if (gameMode === 'endless' && newScore > (leaderboard[0]?.score || 0)) {
          const lastUsername = getLastUsername();
          if (lastUsername && hasHighScore(lastUsername)) {
            saveScore(lastUsername, newScore);
            setLeaderboard(getLeaderboard());
          } else {
            setShowUsernameModal(true);
          }
        }

        return {
          ...prev,
          score: newScore,
          currentWord: [],
          tower: [...prev.tower, word],
          wordScores: [...prev.wordScores, { word, score: wordScore.total }],
          letters: drawn,
          letterPool: remainingPool,
          wordsSubmitted: prev.wordsSubmitted + 1,
        };
      });
      setErrorMessage(null);
    } else {
      setErrorMessage('Not a valid word');
      if (soundOn) {
        playSound('error');
      }
      setGameState(prev => ({
        ...prev,
        currentWord: [],
        letters: prev.letters.map(l => ({ ...l, selected: false })),
      }));
    }
  };

  const removeAnimation = (id: number) => {
    setAnimations(prev => prev.filter(a => a.id !== id));
  };

  const shuffleLetters = () => {
    if (soundOn) {
      playSound('shuffle');
    }
    setGameState(prev => {
      const [drawn, remainingPool] = drawFromPool(prev.letterPool, GRID_SIZE, prev.wordsSubmitted);
      return {
        ...prev,
        letters: drawn,
        letterPool: remainingPool,
        currentWord: [],
      };
    });
    setErrorMessage(null);
  };

  const startNewGame = () => {
    const initialPool = generateLetterPool();
    const [drawn, remainingPool] = drawFromPool(initialPool, GRID_SIZE, 0);
    
    setGameState({
      ...INITIAL_STATE,
      letters: drawn,
      letterPool: remainingPool,
    });
    setTimeLeft(GAME_TIME);
    setIsPlaying(true);
    setErrorMessage(null);
    if (soundOn) {
      playSound('start');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1729] to-[#1a2436] text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-8">
        {/* Main Game Area */}
        <div className="flex-1 max-w-2xl">
          {/* Header */}
          <header className="text-center mb-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handleSoundToggle}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
              >
                {soundOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
              <h1 className="text-4xl font-fantasy glow-text flex items-center gap-2">
                <Star className="w-8 h-8 text-purple-400" />
                Word Alchemist
                <Star className="w-8 h-8 text-pink-400" />
              </h1>
              <div className="w-10" /> {/* Spacer for symmetry */}
            </div>

            {/* Game Stats */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10 shadow-lg">
                <div className="text-sm text-gray-400 mb-1">Score</div>
                <div className="text-2xl font-bold text-yellow-400 glow-text">
                  {gameState.score.toLocaleString()}
                </div>
                {!isPlaying && gameState.score > 0 && (
                  <div className="mt-2">
                    <ShareScore score={gameState.score} />
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10 shadow-lg">
                <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Time
                </div>
                <div className={`text-2xl font-bold glow-text ${
                  timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'
                }`}>
                  {timeLeft}s
                </div>
              </div>
            </div>

            {/* Start Game Button */}
            {!isPlaying && (
              <button
                onClick={startNewGame}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-xl font-bold
                  hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105
                  shadow-lg shadow-green-500/30 mb-4"
              >
                Start Game
              </button>
            )}
          </header>

          {/* Game Grid */}
          <div className="grid grid-cols-5 gap-2 mb-4 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-white/10">
            {gameState.letters.map((letter, index) => (
              <LetterTile
                key={index}
                letter={letter}
                onClick={() => handleLetterClick(letter)}
              />
            ))}
          </div>

          {/* Word Display */}
          {errorMessage && (
            <div className="text-rose-400 text-center mb-2 text-lg font-semibold animate-bounce">
              {errorMessage}
            </div>
          )}
          <div className="text-center mb-4">
            <div className="text-3xl mb-2 word-display min-h-[48px] font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
              {gameState.currentWord.map(l => l.char).join('')}
            </div>
          </div>

          {/* Game Controls */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={clearSelection}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
              <button
                onClick={shuffleLetters}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                <Shuffle className="w-5 h-5" />
                Shuffle
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors w-20"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={submitWord}
              disabled={gameState.currentWord.length < 3}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-xl font-bold
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:from-purple-500 hover:to-pink-500 transition-colors submit-glow"
            >
              Submit Word
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="hidden lg:block w-80">
          <Leaderboard entries={leaderboard} currentScore={gameState.score} />
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              How to Play
            </h2>
            
            <div className="space-y-6">
              {/* Game Rules */}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Game Rules</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Create words by selecting letters</li>
                  <li>• Words must be at least 3 letters long</li>
                  <li>• Use special tiles for bonus points</li>
                  <li>• Combine elements for powerful combos</li>
                </ul>
              </div>

              {/* Special Tiles */}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Special Tiles</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Fire 🔥: Ignites word combos</li>
                  <li>• Water 💧: Flows into higher scores</li>
                  <li>• Earth 🌱: Grounds your multiplier</li>
                  <li>• Air 💨: Lifts your score higher</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 px-6 py-3 bg-purple-600 rounded-lg w-full hover:bg-purple-500 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Mobile Leaderboard Modal */}
      {showLeaderboard && (
        <div className="lg:hidden fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 rounded-2xl p-8 max-w-2xl w-full">
            <Leaderboard entries={leaderboard} currentScore={gameState.score} />
            <button
              onClick={() => setShowLeaderboard(false)}
              className="mt-6 px-6 py-3 bg-purple-600 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showUsernameModal && (
        <UsernameModal
          score={gameState.score}
          onSubmit={handleUsernameSubmit}
        />
      )}

      {animations.map(({ id, score, position, element, combos }) => (
        <React.Fragment key={id}>
          <ScoreAnimation
            score={score}
            position={position}
            element={element}
            onComplete={() => removeAnimation(id)}
            combos={combos}
          />
          <ElementalEffect
            element={element}
            position={position}
            onComplete={() => {}}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;