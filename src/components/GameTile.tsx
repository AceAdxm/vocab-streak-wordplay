
import React from 'react';

const GameTile = ({
  letter,
  color,
  isActive,
  inputRef,
  onChange,
  onKeyDown,
  disabled
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'correct':
        return 'bg-green-500 border-green-500 text-white animate-scale-in';
      case 'partial':
        return 'bg-yellow-500 border-yellow-500 text-white animate-scale-in';
      case 'incorrect':
        return 'bg-gray-600 border-gray-600 text-white animate-scale-in';
      default:
        return 'bg-gray-800 border-gray-600 text-white hover:border-gray-500';
    }
  };

  if (isActive) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={letter}
        onChange={(e) => onChange(e.target.value.slice(-1))}
        onKeyDown={onKeyDown}
        maxLength={1}
        className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${getColorClasses()}`}
        disabled={disabled}
      />
    );
  }

  return (
    <div className={`w-12 h-12 flex items-center justify-center text-xl font-bold border-2 rounded-lg transition-all duration-300 ${getColorClasses()}`}>
      {letter}
    </div>
  );
};

export default GameTile;
