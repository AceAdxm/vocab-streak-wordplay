
import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { DIFFICULTY_LEVELS, getCurrentLevel, getLevelProgress } from '../utils/difficultyLevels';

interface LevelIndicatorProps {
  totalGames: number;
}

const LevelIndicator = ({ totalGames }: LevelIndicatorProps) => {
  const currentLevel = getCurrentLevel(totalGames);
  const levelData = DIFFICULTY_LEVELS[currentLevel];
  const progress = getLevelProgress(totalGames, currentLevel);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-green-400 bg-green-900/20 border-green-400/30';
      case 2: return 'text-blue-400 bg-blue-900/20 border-blue-400/30';
      case 3: return 'text-purple-400 bg-purple-900/20 border-purple-400/30';
      case 4: return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30';
    }
  };

  return (
    <div className={`rounded-lg border p-4 mb-4 ${getLevelColor(currentLevel)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {currentLevel === 4 ? <Trophy className="w-5 h-5" /> : <Star className="w-5 h-5" />}
          <span className="font-semibold">Level {currentLevel}: {levelData.name}</span>
        </div>
        <span className="text-sm opacity-75">{levelData.words.length} words</span>
      </div>
      
      {!progress.isMaxLevel && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm opacity-75">
            <span>Progress to next level</span>
            <span>{progress.current}/{progress.required}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-current transition-all duration-300"
              style={{ width: `${(progress.current / progress.required) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {progress.isMaxLevel && (
        <div className="text-sm opacity-75">
          🎉 Maximum level reached! You're a Spanish word master!
        </div>
      )}
    </div>
  );
};

export default LevelIndicator;
