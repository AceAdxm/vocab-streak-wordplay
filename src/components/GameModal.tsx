
import React from 'react';

const GameModal = ({
  isOpen,
  gameStatus,
  correctWord,
  attempts,
  onClose,
  onNewGame
}) => {
  if (!isOpen) return null;

  const isWin = gameStatus === 'won';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-lg p-8 max-w-sm mx-4 text-center animate-scale-in">
        <div className="text-6xl mb-4">
          {isWin ? '🎉' : '😔'}
        </div>
        
        <h2 className="text-2xl font-bold mb-4">
          {isWin ? 'Congratulations!' : 'Game Over'}
        </h2>
        
        <p className="text-gray-300 mb-2">
          The word was: <span className="font-bold text-white">{correctWord}</span>
        </p>
        
        {isWin && (
          <p className="text-gray-300 mb-6">
            You got it in {attempts} {attempts === 1 ? 'try' : 'tries'}!
          </p>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => {
              onNewGame();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105"
          >
            Play Again
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
