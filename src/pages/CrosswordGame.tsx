
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shuffle, RotateCcw, Info, Zap, Undo } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { worldMiniKit } from '@/lib/world-minikit';

const DICTIONARY = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
  'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
  'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE',
  'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BALLS', 'BANDS', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN',
  'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLIND', 'BLOCK',
  'BLOOD', 'BOARD', 'BOBBY', 'BONDS', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE',
  'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT',
  'CAR', 'CAT', 'DOG', 'RUN', 'SUN', 'WIN', 'TOP', 'GET', 'NEW', 'OLD', 'BIG', 'RED', 'BAD', 'HOT'
];

interface CrosswordGameProps {
  onBack: () => void;
  soundEnabled: boolean;
}

interface GridCell {
  letter: string;
  bonus: 'TW' | 'DW' | 'TL' | 'DL' | 'STAR' | null;
  used: boolean;
  playerId?: string;
}

interface FoundWord {
  word: string;
  score: number;
  positions: [number, number][];
}

const GRID_SIZE = 15;

export const CrosswordGame: React.FC<CrosswordGameProps> = ({ onBack, soundEnabled }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [score, setScore] = useState(0);
  const [redraws, setRedraws] = useState(3);
  const [gameWon, setGameWon] = useState(false);

  const playSound = (type: 'success' | 'error' | 'place') => {
    if (soundEnabled) {
      worldMiniKit.hapticFeedback(type === 'success' ? 'success' : type === 'error' ? 'error' : 'light');
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newGrid = createEmptyGrid();
    setGrid(newGrid);
    setLetters(generateRandomLetters());
    setFoundWords([]);
    setScore(0);
    setRedraws(3);
    setGameWon(false);
    setSelectedCell(null);
  };

  const createEmptyGrid = (): GridCell[][] => {
    const grid: GridCell[][] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      const gridRow: GridCell[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        gridRow.push({
          letter: '',
          bonus: getBonusType(row, col),
          used: false
        });
      }
      grid.push(gridRow);
    }
    
    return grid;
  };

  const getBonusType = (row: number, col: number): 'TW' | 'DW' | 'TL' | 'DL' | 'STAR' | null => {
    const center = Math.floor(GRID_SIZE / 2);
    
    // Center star
    if (row === center && col === center) return 'STAR';
    
    // Triple Word Score (corners and middle edges)
    if ((row === 0 && col === 0) || (row === 0 && col === GRID_SIZE - 1) || 
        (row === GRID_SIZE - 1 && col === 0) || (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) ||
        (row === 0 && col === center) || (row === GRID_SIZE - 1 && col === center) ||
        (row === center && col === 0) || (row === center && col === GRID_SIZE - 1)) {
      return 'TW';
    }
    
    // Double Word Score (diagonal pattern)
    if ((row === 1 && col === 1) || (row === 2 && col === 2) || (row === 3 && col === 3) ||
        (row === 1 && col === GRID_SIZE - 2) || (row === 2 && col === GRID_SIZE - 3) ||
        (row === GRID_SIZE - 2 && col === 1) || (row === GRID_SIZE - 3 && col === 2) ||
        (row === GRID_SIZE - 2 && col === GRID_SIZE - 2) || (row === GRID_SIZE - 3 && col === GRID_SIZE - 3)) {
      return 'DW';
    }
    
    // Triple Letter Score
    if ((row === 1 && col === 5) || (row === 1 && col === 9) || (row === 5 && col === 1) ||
        (row === 5 && col === 5) || (row === 5 && col === 9) || (row === 5 && col === 13) ||
        (row === 9 && col === 1) || (row === 9 && col === 5) || (row === 9 && col === 9) ||
        (row === 9 && col === 13) || (row === 13 && col === 5) || (row === 13 && col === 9)) {
      return 'TL';
    }
    
    // Double Letter Score (scattered)
    if ((row === 0 && col === 3) || (row === 0 && col === 11) || (row === 2 && col === 6) ||
        (row === 2 && col === 8) || (row === 3 && col === 0) || (row === 3 && col === 7) ||
        (row === 6 && col === 2) || (row === 6 && col === 6) || (row === 6 && col === 8) ||
        (row === 6 && col === 12) || (row === 7 && col === 3) || (row === 7 && col === 11) ||
        (row === 8 && col === 2) || (row === 8 && col === 6) || (row === 8 && col === 8) ||
        (row === 8 && col === 12) || (row === 11 && col === 0) || (row === 11 && col === 7) ||
        (row === 12 && col === 6) || (row === 12 && col === 8) || (row === 14 && col === 3) ||
        (row === 14 && col === 11)) {
      return 'DL';
    }
    
    return null;
  };

  const generateRandomLetters = (): string[] => {
    const vowels = 'AEIOU';
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const letters: string[] = [];
    
    // Ensure at least 2 vowels and avoid more than 2 of the same letter
    const letterCount: { [key: string]: number } = {};
    
    // Add 2-3 vowels
    const numVowels = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numVowels; i++) {
      const vowel = vowels[Math.floor(Math.random() * vowels.length)];
      if ((letterCount[vowel] || 0) < 2) {
        letters.push(vowel);
        letterCount[vowel] = (letterCount[vowel] || 0) + 1;
      } else {
        i--; // Try again
      }
    }
    
    // Fill the rest with consonants
    while (letters.length < 8) {
      const consonant = consonants[Math.floor(Math.random() * consonants.length)];
      if ((letterCount[consonant] || 0) < 2) {
        letters.push(consonant);
        letterCount[consonant] = (letterCount[consonant] || 0) + 1;
      }
    }
    
    return letters.sort(() => Math.random() - 0.5);
  };

  const shuffleLetters = () => {
    setLetters([...letters].sort(() => Math.random() - 0.5));
    playSound('place');
  };

  const redrawLetters = () => {
    if (redraws > 0) {
      setLetters(generateRandomLetters());
      setRedraws(redraws - 1);
      playSound('place');
    }
  };

  const recallLetters = () => {
    const newGrid = [...grid];
    const recalledLetters = [...letters];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].letter && newGrid[row][col].playerId === 'player') {
          recalledLetters.push(newGrid[row][col].letter);
          newGrid[row][col].letter = '';
          newGrid[row][col].used = false;
          newGrid[row][col].playerId = undefined;
        }
      }
    }
    
    setGrid(newGrid);
    setLetters(recalledLetters);
    setSelectedCell(null);
    playSound('place');
  };

  const placeLetter = (row: number, col: number, letter: string) => {
    if (grid[row][col].letter || !letters.includes(letter)) return;
    
    const newGrid = [...grid];
    newGrid[row][col] = {
      ...newGrid[row][col],
      letter,
      used: true,
      playerId: 'player'
    };
    
    const newLetters = [...letters];
    const letterIndex = newLetters.indexOf(letter);
    if (letterIndex > -1) {
      newLetters.splice(letterIndex, 1);
    }
    
    setGrid(newGrid);
    setLetters(newLetters);
    setSelectedCell(null);
    playSound('place');
    
    // Auto-refill letters
    if (newLetters.length < 8) {
      const additionalLetters = generateRandomLetters().slice(0, 8 - newLetters.length);
      setLetters([...newLetters, ...additionalLetters]);
    }
  };

  const removeLetter = (row: number, col: number) => {
    if (!grid[row][col].letter || grid[row][col].playerId !== 'player') return;
    
    const newGrid = [...grid];
    const letter = newGrid[row][col].letter;
    newGrid[row][col] = {
      ...newGrid[row][col],
      letter: '',
      used: false,
      playerId: undefined
    };
    
    setGrid(newGrid);
    setLetters([...letters, letter]);
    playSound('place');
  };

  const validateAndSubmit = () => {
    const newWords = findAllWords();
    const wordsToAdd = newWords.filter(newWord => 
      !foundWords.some(existing => existing.word === newWord.word)
    );
    
    if (wordsToAdd.length === 0) {
      playSound('error');
      alert('No new valid words found!');
      return;
    }
    
    const newScore = wordsToAdd.reduce((sum, word) => sum + word.score, 0);
    setFoundWords([...foundWords, ...wordsToAdd]);
    setScore(score + newScore);
    playSound('success');
    
    if (foundWords.length + wordsToAdd.length >= 30) {
      setGameWon(true);
    }
  };

  const findAllWords = (): FoundWord[] => {
    const words: FoundWord[] = [];
    
    // Check horizontal words
    for (let row = 0; row < GRID_SIZE; row++) {
      let currentWord = '';
      let positions: [number, number][] = [];
      
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col].letter) {
          currentWord += grid[row][col].letter;
          positions.push([row, col]);
        } else {
          if (currentWord.length >= 3 && DICTIONARY.includes(currentWord)) {
            words.push({
              word: currentWord,
              score: calculateWordScore(currentWord, positions),
              positions: [...positions]
            });
          }
          currentWord = '';
          positions = [];
        }
      }
      
      if (currentWord.length >= 3 && DICTIONARY.includes(currentWord)) {
        words.push({
          word: currentWord,
          score: calculateWordScore(currentWord, positions),
          positions
        });
      }
    }
    
    // Check vertical words
    for (let col = 0; col < GRID_SIZE; col++) {
      let currentWord = '';
      let positions: [number, number][] = [];
      
      for (let row = 0; row < GRID_SIZE; row++) {
        if (grid[row][col].letter) {
          currentWord += grid[row][col].letter;
          positions.push([row, col]);
        } else {
          if (currentWord.length >= 3 && DICTIONARY.includes(currentWord)) {
            words.push({
              word: currentWord,
              score: calculateWordScore(currentWord, positions),
              positions: [...positions]
            });
          }
          currentWord = '';
          positions = [];
        }
      }
      
      if (currentWord.length >= 3 && DICTIONARY.includes(currentWord)) {
        words.push({
          word: currentWord,
          score: calculateWordScore(currentWord, positions),
          positions
        });
      }
    }
    
    return words;
  };

  const calculateWordScore = (word: string, positions: [number, number][]): number => {
    let letterScore = 0;
    let wordMultiplier = 1;
    
    positions.forEach(([row, col], index) => {
      const cell = grid[row][col];
      let letterValue = 10; // Base letter value
      
      if (!cell.used) {
        switch (cell.bonus) {
          case 'TL':
            letterValue *= 3;
            break;
          case 'DL':
            letterValue *= 2;
            break;
          case 'TW':
            wordMultiplier *= 3;
            break;
          case 'DW':
          case 'STAR':
            wordMultiplier *= 2;
            break;
        }
      }
      
      letterScore += letterValue;
    });
    
    let totalScore = letterScore * wordMultiplier;
    
    // Bonus for longer words
    if (word.length >= 6) {
      totalScore += word.length * 10;
    }
    
    return totalScore;
  };

  const getBonusColor = (bonus: string | null): string => {
    switch (bonus) {
      case 'TW': return 'bg-red-500 text-white';
      case 'DW': return 'bg-pink-500 text-white';
      case 'TL': return 'bg-blue-500 text-white';
      case 'DL': return 'bg-cyan-500 text-white';
      case 'STAR': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Crossword Grid</h1>
        <Badge variant="secondary">{score} pts</Badge>
      </div>

      {/* Recent Words */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Recent Words ({foundWords.length}/30)</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bonus Squares</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center rounded">TW</div>
                  <span>Triple Word Score</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-pink-500 text-white text-xs flex items-center justify-center rounded">DW</div>
                  <span>Double Word Score</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 text-white text-xs flex items-center justify-center rounded">TL</div>
                  <span>Triple Letter Score</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-cyan-500 text-white text-xs flex items-center justify-center rounded">DL</div>
                  <span>Double Letter Score</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-500 text-white text-xs flex items-center justify-center rounded">★</div>
                  <span>Center Star (Double Word)</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-wrap gap-1">
          {foundWords.slice(-10).map((word, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {word.word} ({word.score})
            </Badge>
          ))}
        </div>
      </Card>

      {/* Game Grid */}
      <div className="grid grid-cols-15 gap-0.5 bg-gray-200 p-2 rounded-lg max-w-xl mx-auto" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => {
                if (selectedCell && letters.length > 0) {
                  const selectedLetter = letters[0]; // For simplicity, use first letter
                  placeLetter(rowIndex, colIndex, selectedLetter);
                } else if (cell.letter && cell.playerId === 'player') {
                  removeLetter(rowIndex, colIndex);
                } else {
                  setSelectedCell([rowIndex, colIndex]);
                }
              }}
              className={`
                w-6 h-6 text-xs font-bold flex items-center justify-center cursor-pointer border
                ${cell.letter 
                  ? (cell.playerId === 'player' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white')
                  : getBonusColor(cell.bonus)
                }
                ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex 
                  ? 'ring-2 ring-purple-500' : ''
                }
              `}
            >
              {cell.letter || (cell.bonus === 'STAR' ? '★' : cell.bonus)}
            </div>
          ))
        )}
      </div>

      {/* Your Letters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center">Your Letters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-2 mb-4">
            {letters.map((letter, index) => (
              <div
                key={index}
                onClick={() => {
                  if (selectedCell) {
                    placeLetter(selectedCell[0], selectedCell[1], letter);
                  }
                }}
                className="w-10 h-10 bg-white border-2 border-gray-300 rounded flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-gray-50"
              >
                {letter}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button variant="outline" onClick={shuffleLetters} size="sm">
              <Shuffle className="h-4 w-4 mr-1" />
              Shuffle
            </Button>
            <Button variant="outline" onClick={recallLetters} size="sm">
              <Undo className="h-4 w-4 mr-1" />
              Recall
            </Button>
            <Button 
              variant="outline" 
              onClick={redrawLetters} 
              disabled={redraws === 0}
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Redraw ({redraws})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button onClick={validateAndSubmit} className="w-full" size="lg">
        Submit Words
      </Button>

      {/* Game Won */}
      {gameWon && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-green-800">🎉 Congratulations!</div>
            <div className="text-sm mt-1">You found 30 words! Final Score: {score}</div>
            <Button onClick={initializeGame} className="mt-3">
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
