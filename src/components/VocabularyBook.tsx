
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const VocabularyBook = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWords, setFilteredWords] = useState(Object.entries(SPANISH_WORDS));
  const { toast } = useToast();

  const handleSearch = (value: string) => {
    const upperValue = value.toUpperCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredWords(Object.entries(SPANISH_WORDS));
    } else {
      const filtered = Object.entries(SPANISH_WORDS).filter(([word, translation]) =>
        word.includes(upperValue) || translation.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredWords(filtered);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const upperSearchTerm = searchTerm.toUpperCase();
      if (searchTerm && !SPANISH_WORDS[upperSearchTerm]) {
        toast({
          title: "Word not found",
          description: `"${searchTerm}" is not in our vocabulary list.`,
          variant: "destructive",
        });
        
        // Clear the search after showing the toast
        setTimeout(() => {
          setSearchTerm('');
          setFilteredWords(Object.entries(SPANISH_WORDS));
        }, 1000);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredWords(Object.entries(SPANISH_WORDS));
  };

  return (
    <div className="max-h-96 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Vocabulary Book</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {filteredWords.length > 0 ? (
          filteredWords.map(([word, translation]) => (
            <div key={word} className="px-4 py-2 border-b border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-medium text-purple-300">{word}</span>
                <span className="text-gray-300 text-sm">{translation}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-400">
            No words found matching "{searchTerm}"
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-700 text-center text-xs text-gray-400">
        Total: {Object.keys(SPANISH_WORDS).length} words
      </div>
    </div>
  );
};

export default VocabularyBook;
