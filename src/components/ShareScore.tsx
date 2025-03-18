import React from 'react';
import { Share2 } from 'lucide-react';

interface ShareScoreProps {
  score: number;
}

export const ShareScore: React.FC<ShareScoreProps> = ({ score }) => {
  const shareText = `🎮 I scored ${score.toLocaleString()} points in Word Alchemist! Can you beat my score? Play now!`;
  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Word Alchemist Score',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Score copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 
        rounded-lg transition-all duration-300 transform hover:scale-105 text-white font-semibold"
    >
      <Share2 className="w-5 h-5" />
      Share Score
    </button>
  );
};