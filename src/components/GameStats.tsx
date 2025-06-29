
import React from 'react';

const GameStats = ({ streak, totalGames, totalWins }) => {
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-8">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-purple-400">{streak}</div>
          <div className="text-sm text-gray-400">Current Streak</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-green-400">{winRate}%</div>
          <div className="text-sm text-gray-400">Win Rate</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-blue-400">{totalGames}</div>
          <div className="text-sm text-gray-400">Games Played</div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
