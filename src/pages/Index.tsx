import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import GameBoard from '../components/GameBoard';
import GameModal from '../components/GameModal';
import GameStats from '../components/GameStats';
import StreakPopup from '../components/StreakPopup';

const SPANISH_WORDS = {
  'SOMOS': 'we are',
  'ELLOS': 'they',
  'HABER': 'to have (auxiliary)',
  'HABIA': 'there was/were',
  'HABRA': 'there will be',
  'TIENE': 'has/have',
  'TENIA': 'had',
  'ESTAR': 'to be (temporary)',
  'ESTOY': 'I am',
  'ESTAS': 'you are',
  'ESTAN': 'they are',
  'ESTOS': 'these',
  'HARIA': 'would do',
  'HECHO': 'done/made',
  'DECIR': 'to say',
  'PODER': 'to be able',
  'PODRE': 'I will be able',
  'VAMOS': 'we go/let\'s go',
  'VEIAS': 'you saw',
  'VISTO': 'seen',
  'MUCHO': 'much/a lot',
  'DISTE': 'you gave',
  'DIMOS': 'we gave',
  'SABER': 'to know',
  'ALGUN': 'some/any',
  'MISMO': 'same',
  'QUISE': 'I wanted',
  'HASTA': 'until',
  'SOBRE': 'about/on',
  'ENTRE': 'between',
  'PASAR': 'to pass',
  'DESDE': 'from/since',
  'AHORA': 'now',
  'CREER': 'to believe',
  'DONDE': 'where',
  'DEJAR': 'to leave',
  'PONER': 'to put',
  'PARTE': 'part',
  'BUENO': 'good',
  'MAJOR': 'better',
  'MENOS': 'less',
  'MUJER': 'woman',
  'MUNDO': 'world',
  'MIRAR': 'to look',
  'TOMAR': 'to take',
  'VIVIR': 'to live',
  'LUEGO': 'then',
  'MAYOR': 'older/bigger',
  'NUNCA': 'never',
  'PADRE': 'father',
  'NOCHE': 'night',
  'PUNTO': 'point',
  'ANTES': 'before',
  'GRUPO': 'group',
  'SENOR': 'sir/mister',
  'NADIE': 'nobody',
  'UNICO': 'unique/only',
  'PEDIR': 'to ask for',
  'VIEJO': 'old',
  'JUGAR': 'to play',
  'JUEGO': 'game',
  'JUEGA': 'plays',
  'COLOR': 'color',
  'FINAL': 'end',
  'PAGAR': 'to pay',
  'TARDE': 'late/afternoon',
  'PAPEL': 'paper',
  'MEDIO': 'half/middle',
  'VISTA': 'view',
  'SUBIR': 'to go up',
  'JOVEN': 'young',
  'SERIE': 'series',
  'MOVER': 'to move',
  'MENOR': 'smaller/younger',
  'BRAZO': 'arm',
  'TODOS': 'all/everyone',
  'LIBRE': 'free',
  'SITIO': 'place',
  'BAJAR': 'to go down',
  'MIEDO': 'fear',
  'POBRE': 'poor',
  'FAVOR': 'favor',
  'VIAJE': 'trip',
  'DATOS': 'data',
  'FACIL': 'easy',
  'CAUSA': 'cause',
  'SIETE': 'seven',
  'SALUD': 'health',
  'CIELO': 'sky',
  'NORTE': 'north',
  'CARTA': 'letter',
  'JULIO': 'July',
  'DOLAR': 'dollar',
  'TIRAR': 'to throw',
  'EXITO': 'success',
  'LOCAL': 'local',
  'COMUN': 'common',
  'TEXTO': 'text',
  'GRADO': 'degree',
  'COSTA': 'coast',
  'FELIZ': 'happy',
  'RADIO': 'radio',
  'CALOR': 'heat',
  'COGER': 'to take',
  'RUIDO': 'noise',
  'JUNIO': 'June',
  'CERCA': 'near',
  'VENTA': 'sale',
  'BELLO': 'beautiful',
  'CORTO': 'short',
  'DURAR': 'to last',
  'CHICA': 'girl',
  'HOTEL': 'hotel',
  'ENERO': 'January',
  'NORMA': 'rule',
  'VIDEO': 'video',
  'LISTA': 'list',
  'COCHE': 'car',
  'PATIO': 'patio',
  'MARZO': 'March',
  'SILLA': 'chair',
  'MARCA': 'brand',
  'CANAL': 'channel',
  'DOBLE': 'double',
  'BANDA': 'band',
  'NOVIO': 'boyfriend',
  'LUNES': 'Monday',
  'REGLA': 'rule',
  'BARCO': 'boat',
  'LECHE': 'milk',
  'AVION': 'airplane',
  'PRIMO': 'cousin',
  'PLAYA': 'beach',
  'ACTOR': 'actor',
  'LENTO': 'slow',
  'NARIZ': 'nose',
  'BOLSA': 'bag',
  'FALSO': 'false',
  'DOLER': 'to hurt',
  'LAVAR': 'to wash',
  'JUSTO': 'fair/just',
  'LLAVE': 'key',
  'SUCIO': 'dirty',
  'FUMAR': 'to smoke',
  'CLARO': 'clear',
  'FRUTA': 'fruit',
  'HUEVO': 'egg',
  'NOVIA': 'girlfriend',
  'BAILE': 'dance',
  'ADIOS': 'goodbye',
  'VIRUS': 'virus',
  'OESTE': 'west',
  'TRECE': 'thirteen',
  'FALDA': 'skirt',
  'FERIA': 'fair',
  'RUBIO': 'blonde',
  'MOVIL': 'mobile',
  'TENGO': 'I have',
  'TENER': 'to have',
  'TENGA': 'have (subjunctive)',
  'HAGAS': 'do (subjunctive)',
  'VAYAS': 'go (subjunctive)',
  'SABRE': 'I will know',
  'DEBER': 'should/must',
  'ELLAS': 'they (feminine)',
  'SALIR': 'to leave',
  'VENIR': 'to come',
  'VENGA': 'come (subjunctive)',
  'FORMA': 'form',
  'GENTE': 'people',
  'LUGAR': 'place',
  'HACIA': 'towards'
};

const WORDS = Object.keys(SPANISH_WORDS);

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
  const [wordDefinition, setWordDefinition] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const inputRefs = useRef([]);

  // Generate or retrieve device-specific ID
  const getDeviceId = () => {
    let id = localStorage.getItem('vocabWordleDeviceId');
    if (!id) {
      // Generate a unique ID based on various device characteristics
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
      ].join('|');
      
      // Create a simple hash from the fingerprint
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      id = 'device_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
      localStorage.setItem('vocabWordleDeviceId', id);
    }
    return id;
  };

  useEffect(() => {
    // Get or generate device ID
    const id = getDeviceId();
    setDeviceId(id);
    
    // Reset streak to 0 on every page load
    setStreak(0);
    localStorage.setItem(`vocabWordleStreak_${id}`, '0');
    
    // Load device-specific stats from localStorage
    const savedTotalGames = localStorage.getItem(`vocabWordleTotalGames_${id}`);
    const savedTotalWins = localStorage.getItem(`vocabWordleTotalWins_${id}`);
    
    if (savedTotalGames) setTotalGames(parseInt(savedTotalGames));
    if (savedTotalWins) setTotalWins(parseInt(savedTotalWins));
    
    // Start a new game on every page load
    startNewGame();
  }, []);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    return WORDS[randomIndex];
  };

  const startNewGame = () => {
    const randomWord = getRandomWord();
    setCorrectWord(randomWord);
    setWordDefinition(SPANISH_WORDS[randomWord]);
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
    
    // Save stats with device-specific keys
    localStorage.setItem(`vocabWordleTotalGames_${deviceId}`, newTotalGames.toString());
    localStorage.setItem(`vocabWordleTotalWins_${deviceId}`, newTotalWins.toString());
    // Note: streak is reset on page load, so we don't persist it long-term
    
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
            Spanish Wordle
          </h1>
          <p className="text-gray-300">Guess the 5-letter Spanish word in 5 tries!</p>
        </div>
        
        <GameStats streak={streak} totalGames={totalGames} totalWins={totalWins} />
        
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
        wordDefinition={wordDefinition}
        attempts={currentRow + (gameStatus === 'won' ? 1 : 0)}
        onClose={() => setShowModal(false)}
        onNewGame={startNewGame}
      />
    </div>
  );
};

export default Index;
