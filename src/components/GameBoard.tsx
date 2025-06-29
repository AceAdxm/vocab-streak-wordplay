
import React from 'react';
import GameTile from './GameTile';

const GameBoard = ({
  gameBoard,
  currentGuess,
  currentRow,
  correctWord,
  gameStatus,
  inputRefs,
  onInputChange,
  onKeyDown
}) => {
  const getLetterColors = (guess, rowIndex) => {
    if (rowIndex > currentRow || (rowIndex === currentRow && gameStatus === 'playing')) {
      return Array(5).fill('default');
    }
    
    const colors = [];
    const wordLetters = correctWord.split('');
    const guessLetters = guess.split('');
    
    // First pass: mark exact matches
    guessLetters.forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        colors[index] = 'correct';
        wordLetters[index] = null;
      }
    });
    
    // Second pass: mark partial matches
    guessLetters.forEach((letter, index) => {
      if (colors[index]) return;
      
      const letterIndex = wordLetters.indexOf(letter);
      if (letterIndex !== -1) {
        colors[index] = 'partial';
        wordLetters[letterIndex] = null;
      } else {
        colors[index] = 'incorrect';
      }
    });
    
    return colors;
  };

  return (
    <div className="game-board space-y-2 mb-8">
      {gameBoard.map((row, rowIndex) => {
        const isCurrentRow = rowIndex === currentRow && gameStatus === 'playing';
        const rowGuess = isCurrentRow ? currentGuess.join('') : row.join('');
        const colors = getLetterColors(rowGuess, rowIndex);
        
        return (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {Array(5).fill(null).map((_, colIndex) => {
              const letter = isCurrentRow ? currentGuess[colIndex] : row[colIndex];
              const inputIndex = rowIndex * 5 + colIndex;
              
              return (
                <GameTile
                  key={colIndex}
                  letter={letter}
                  color={colors[colIndex]}
                  isActive={isCurrentRow}
                  inputRef={isCurrentRow ? (el) => inputRefs.current[colIndex] = el : null}
                  onChange={(value) => isCurrentRow && onInputChange(colIndex, value)}
                  onKeyDown={(e) => isCurrentRow && onKeyDown(colIndex, e)}
                  disabled={!isCurrentRow}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
