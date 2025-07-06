import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import GameBoard from '../components/GameBoard';
import GameModal from '../components/GameModal';
import GameStats from '../components/GameStats';
import StreakPopup from '../components/StreakPopup';
import IssuesBox from '../components/IssuesBox';

const WORDS = [
  'HOLLA'
];

const Index = () => {
  const [correctWord, setCorrectWord] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '', '']);
  const [gameBoard, setGameBoard] = useState(Array(5).fill(null).map(() => Array(5).fill('')));
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [showModal, setShowModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [guessHistory, setGuessHistory] = useState([]);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Load stats from localStorage
    const savedStreak = localStorage.getItem('vocabWordleStreak');
    const savedTotalGames = localStorage.getItem('vocabWordleTotalGames');
    const savedTotalWins = localStorage.getItem('vocabWordleTotalWins');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedTotalGames) setTotalGames(parseInt(savedTotalGames));
    if (savedTotalWins) setTotalWins(parseInt(savedTotalWins));
    
    // Set random word
    startNewGame();
  }, []);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    return WORDS[randomIndex];
  };

  const startNewGame = () => {
    const randomWord = getRandomWord();
    setCorrectWord(randomWord);
    setCurrentRow(0);
    setCurrentGuess(['', '', '', '', '']);
    setGameBoard(Array(5).fill(null).map(() => Array(5).fill('')));
    setGameStatus('playing');
    setShowModal(false);
    setGuessHistory([]);
    console.log('New game started with word:', randomWord);
  };

  const saveStats = (won) => {
    const newTotalGames = totalGames + 1;
    const newTotalWins = won ? totalWins + 1 : totalWins;
    const newStreak = won ? streak + 1 : 0;
    
    setTotalGames(newTotalGames);
    setTotalWins(newTotalWins);
    setStreak(newStreak);
    
    localStorage.setItem('vocabWordleTotalGames', newTotalGames.toString());
    localStorage.setItem('vocabWordleTotalWins', newTotalWins.toString());
    localStorage.setItem('vocabWordleStreak', newStreak.toString());

    // Show streak popup if won and streak > 1
    if (won && newStreak > 1) {
      setShowStreakPopup(true);
    }
  };

  const handleInputChange = (index, value) => {
    if (gameStatus !== 'playing') return;
    
    const newGuess = [...currentGuess];
    newGuess[index] = value.toUpperCase();
    setCurrentGuess(newGuess);
    
    // Auto-advance to next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !currentGuess[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && currentGuess.every(letter => letter !== '')) {
      submitGuess();
    }
  };

  const submitGuess = () => {
    if (currentGuess.some(letter => letter === '') || gameStatus !== 'playing') return;
    
    const newBoard = [...gameBoard];
    newBoard[currentRow] = [...currentGuess];
    setGameBoard(newBoard);
    
    const guessWord = currentGuess.join('');
    const newHistory = [...guessHistory, { guess: guessWord, colors: getLetterColors(guessWord) }];
    setGuessHistory(newHistory);
    
    if (guessWord === correctWord) {
      setGameStatus('won');
      saveStats(true);
      setTimeout(() => setShowModal(true), 500);
    } else if (currentRow === 4) {
      setGameStatus('lost');
      saveStats(false);
      setTimeout(() => setShowModal(true), 500);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentGuess(['', '', '', '', '']);
      // Focus first input of next row
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const getLetterColors = (guess) => {
    const colors = [];
    const wordLetters = correctWord.split('');
    const guessLetters = guess.split('');
    
    // First pass: mark exact matches
    guessLetters.forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        colors[index] = 'correct';
        wordLetters[index] = null; // Mark as used
      }
    });
    
    // Second pass: mark partial matches
    guessLetters.forEach((letter, index) => {
      if (colors[index]) return; // Already marked as correct
      
      const letterIndex = wordLetters.indexOf(letter);
      if (letterIndex !== -1) {
        colors[index] = 'partial';
        wordLetters[letterIndex] = null; // Mark as used
      } else {
        colors[index] = 'incorrect';
      }
    });
    
    return colors;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <StreakPopup 
        streak={streak} 
        isVisible={showStreakPopup} 
        onHide={() => setShowStreakPopup(false)} 
      />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vocab Wordle
          </h1>
          <p className="text-gray-300">Guess the 5-letter word in 5 tries!</p>
        </div>
        
        <GameStats streak={streak} totalGames={totalGames} totalWins={totalWins} />
        
        <IssuesBox />
        
        <GameBoard
          gameBoard={gameBoard}
          currentGuess={currentGuess}
          currentRow={currentRow}
          correctWord={correctWord}
          gameStatus={gameStatus}
          inputRefs={inputRefs}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        
        <div className="text-center mt-8">
          <button
            onClick={submitGuess}
            disabled={currentGuess.some(letter => letter === '') || gameStatus !== 'playing'}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            Submit Guess
          </button>
          
          <button
            onClick={startNewGame}
            className="ml-4 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200"
          >
            New Game
          </button>
        </div>
      </main>
      
      <GameModal
        isOpen={showModal}
        gameStatus={gameStatus}
        correctWord={correctWord}
        attempts={currentRow + (gameStatus === 'won' ? 1 : 0)}
        onClose={() => setShowModal(false)}
        onNewGame={startNewGame}
      />
    </div>
  );
};

export default Index;
