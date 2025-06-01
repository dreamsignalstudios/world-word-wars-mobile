
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lightbulb, RotateCcw } from 'lucide-react';
import { worldMiniKit } from '@/lib/world-minikit';
import { getRandomWordleWord, isValidWord, VALID_WORDS } from '@/lib/word-database';

interface WordGuessGameProps {
  onBack: () => void;
  soundEnabled: boolean;
}

interface GuessResult {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

export const WordGuessGame: React.FC<WordGuessGameProps> = ({ onBack, soundEnabled }) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [availableHints, setAvailableHints] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const word = getRandomWordleWord();
    setTargetWord(word);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setHintsUsed(0);
    setShowHints(false);
    setAvailableHints([]);
    setScore(0);
    console.log('Target word:', word); // For development
  };

  const playSound = (type: 'success' | 'error' | 'place') => {
    if (soundEnabled) {
      worldMiniKit.hapticFeedback(type === 'success' ? 'success' : type === 'error' ? 'error' : 'light');
    }
  };

  const getLetterStatus = (letter: string, position: number): 'correct' | 'present' | 'absent' => {
    if (targetWord[position] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  const getGuessResults = (guess: string): GuessResult[] => {
    return guess.split('').map((letter, index) => ({
      letter,
      status: getLetterStatus(letter, index)
    }));
  };

  const generateHints = () => {
    if (hintsUsed >= 3) return;

    const guessedLetters = new Set(guesses.join('').split(''));
    const correctPositions = new Set<number>();
    const presentLetters = new Set<string>();
    const absentLetters = new Set<string>();

    // Analyze previous guesses
    guesses.forEach(guess => {
      const results = getGuessResults(guess);
      results.forEach((result, index) => {
        if (result.status === 'correct') {
          correctPositions.add(index);
        } else if (result.status === 'present') {
          presentLetters.add(result.letter);
        } else {
          absentLetters.add(result.letter);
        }
      });
    });

    // Find possible words based on constraints
    const possibleWords = Array.from(VALID_WORDS).filter(word => {
      if (word.length !== 5) return false;
      
      // Check correct positions
      for (const pos of correctPositions) {
        const guessedLetter = guesses.some(g => g[pos] === targetWord[pos]);
        if (guessedLetter && word[pos] !== targetWord[pos]) return false;
      }

      // Check present letters
      for (const letter of presentLetters) {
        if (!word.includes(letter)) return false;
      }

      // Check absent letters
      for (const letter of absentLetters) {
        if (word.includes(letter)) return false;
      }

      return true;
    }).slice(0, 8);

    setAvailableHints(possibleWords);
    setShowHints(true);
    setHintsUsed(hintsUsed + 1);
    playSound('place');
  };

  const submitGuess = () => {
    if (currentGuess.length !== 5) {
      playSound('error');
      return;
    }

    if (!isValidWord(currentGuess)) {
      playSound('error');
      alert('Enter a valid word');
      return;
    }

    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setShowHints(false);

    if (currentGuess.toUpperCase() === targetWord) {
      setGameStatus('won');
      const gameScore = (7 - newGuesses.length) * 100 + (3 - hintsUsed) * 50;
      setScore(gameScore);
      playSound('success');
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      playSound('error');
    } else {
      playSound('place');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + e.key.toUpperCase());
    }
  };

  const selectHint = (hint: string) => {
    setCurrentGuess(hint);
    setShowHints(false);
    playSound('place');
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Word Guess</h1>
        <Badge variant="secondary">{score} pts</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Guess the 5-letter word
          </CardTitle>
          <div className="flex justify-center space-x-4 text-sm">
            <span>Attempts: {guesses.length}/6</span>
            <span>Hints: {hintsUsed}/3</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Game Grid */}
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-1">
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  const guess = guesses[rowIndex];
                  const letter = guess ? guess[colIndex] : '';
                  const status = guess ? getLetterStatus(letter, colIndex) : '';
                  
                  return (
                    <div
                      key={colIndex}
                      className={`
                        w-12 h-12 border-2 rounded flex items-center justify-center font-bold text-lg
                        ${!guess ? 'border-gray-300 bg-white' : 
                          status === 'correct' ? 'border-green-500 bg-green-500 text-white' :
                          status === 'present' ? 'border-yellow-500 bg-yellow-500 text-white' :
                          'border-gray-500 bg-gray-500 text-white'}
                      `}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Current Guess Input */}
          {gameStatus === 'playing' && (
            <div className="space-y-3">
              <Input
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, 5))}
                onKeyDown={handleKeyPress}
                placeholder="Enter your guess..."
                className="text-center text-lg font-bold"
                maxLength={5}
              />
              
              <div className="flex space-x-2">
                <Button 
                  onClick={submitGuess} 
                  disabled={currentGuess.length !== 5}
                  className="flex-1"
                >
                  Submit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={generateHints}
                  disabled={hintsUsed >= 3}
                  className="px-3"
                >
                  <Lightbulb className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Hints */}
          {showHints && availableHints.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <div className="text-sm font-medium text-blue-800 mb-2">Possible words:</div>
                <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                  {availableHints.map((hint, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => selectHint(hint)}
                      className="text-left justify-start text-blue-700 hover:bg-blue-100 text-xs p-1"
                    >
                      {hint}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Over */}
          {gameStatus !== 'playing' && (
            <Card className={gameStatus === 'won' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              <CardContent className="p-4 text-center">
                <div className={`text-lg font-bold ${gameStatus === 'won' ? 'text-green-800' : 'text-red-800'}`}>
                  {gameStatus === 'won' ? '🎉 You Won!' : '😔 Game Over'}
                </div>
                <div className="text-sm mt-1">
                  {gameStatus === 'won' ? `Score: ${score} points` : `The word was: ${targetWord}`}
                </div>
                <Button onClick={startNewGame} className="mt-3">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
