
// Organize Spanish words by difficulty levels
export const DIFFICULTY_LEVELS = {
  1: { // Beginner - Common everyday words
    name: 'Beginner',
    words: [
      'BUENO', 'MUCHO', 'MUNDO', 'MAJOR', 'MENOS', 'MUJER', 'PADRE', 'NOCHE', 
      'PUNTO', 'ANTES', 'GRUPO', 'SENOR', 'NADIE', 'UNICO', 'VIEJO', 'JUEGO',
      'COLOR', 'FINAL', 'TARDE', 'PAPEL', 'MEDIO', 'VISTA', 'JOVEN', 'SERIE',
      'BRAZO', 'TODOS', 'LIBRE', 'SITIO', 'MIEDO', 'POBRE', 'FAVOR', 'VIAJE',
      'DATOS', 'FACIL', 'CAUSA', 'SIETE', 'SALUD', 'CIELO', 'NORTE', 'CARTA',
      'JULIO', 'DOLAR', 'EXITO', 'LOCAL', 'COMUN', 'TEXTO', 'GRADO', 'COSTA',
      'FELIZ', 'RADIO', 'CALOR', 'RUIDO', 'JUNIO', 'CERCA', 'VENTA', 'BELLO'
    ],
    gamesRequired: 0
  },
  2: { // Intermediate - Action verbs and descriptive words
    name: 'Intermediate',
    words: [
      'SOMOS', 'ELLOS', 'TIENE', 'TENIA', 'ESTAR', 'ESTOY', 'ESTAS', 'ESTAN',
      'ESTOS', 'HECHO', 'DECIR', 'PODER', 'PODRE', 'VAMOS', 'VEIAS', 'VISTO',
      'DISTE', 'DIMOS', 'SABER', 'ALGUN', 'MISMO', 'QUISE', 'HASTA', 'SOBRE',
      'ENTRE', 'PASAR', 'DESDE', 'AHORA', 'CREER', 'DONDE', 'DEJAR', 'PONER',
      'PARTE', 'MAYOR', 'NUNCA', 'PEDIR', 'JUGAR', 'JUEGA', 'PAGAR', 'SUBIR',
      'MOVER', 'MENOR', 'BAJAR', 'TIRAR', 'COGER', 'DURAR', 'CHICA', 'HOTEL'
    ],
    gamesRequired: 10
  },
  3: { // Advanced - Complex verbs and abstract concepts
    name: 'Advanced',
    words: [
      'HABER', 'HABIA', 'HABRA', 'HARIA', 'MIRAR', 'TOMAR', 'VIVIR', 'LUEGO',
      'ENERO', 'NORMA', 'VIDEO', 'LISTA', 'COCHE', 'PATIO', 'MARZO', 'SILLA',
      'MARCA', 'CANAL', 'DOBLE', 'BANDA', 'NOVIO', 'LUNES', 'REGLA', 'BARCO',
      'LECHE', 'AVION', 'PRIMO', 'PLAYA', 'ACTOR', 'LENTO', 'NARIZ', 'BOLSA',
      'FALSO', 'DOLER', 'LAVAR', 'JUSTO', 'LLAVE', 'SUCIO', 'FUMAR', 'CLARO'
    ],
    gamesRequired: 25
  },
  4: { // Expert - Subjunctive forms and complex vocabulary
    name: 'Expert',
    words: [
      'FRUTA', 'HUEVO', 'NOVIA', 'BAILE', 'ADIOS', 'VIRUS', 'OESTE', 'TRECE',
      'FALDA', 'FERIA', 'RUBIO', 'MOVIL', 'TENGO', 'TENER', 'TENGA', 'HAGAS',
      'VAYAS', 'SABRE', 'DEBER', 'ELLAS', 'SALIR', 'VENIR', 'VENGA', 'FORMA',
      'GENTE', 'LUGAR', 'HACIA', 'CORTO'
    ],
    gamesRequired: 50
  }
};

export const getCurrentLevel = (totalGames: number): number => {
  if (totalGames >= 50) return 4;
  if (totalGames >= 25) return 3;
  if (totalGames >= 10) return 2;
  return 1;
};

export const getWordsForLevel = (level: number): string[] => {
  return DIFFICULTY_LEVELS[level]?.words || DIFFICULTY_LEVELS[1].words;
};

export const getLevelProgress = (totalGames: number, currentLevel: number): { current: number; required: number; isMaxLevel: boolean } => {
  const nextLevel = currentLevel + 1;
  const nextLevelData = DIFFICULTY_LEVELS[nextLevel];
  
  if (!nextLevelData) {
    return { current: totalGames, required: totalGames, isMaxLevel: true };
  }
  
  const currentLevelRequired = DIFFICULTY_LEVELS[currentLevel].gamesRequired;
  const nextLevelRequired = nextLevelData.gamesRequired;
  
  return {
    current: totalGames - currentLevelRequired,
    required: nextLevelRequired - currentLevelRequired,
    isMaxLevel: false
  };
};
