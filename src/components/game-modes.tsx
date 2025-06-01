
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Grid3X3, Users, Trophy, Gamepad2, Target } from 'lucide-react';

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  players: string;
}

const gameModes: GameMode[] = [
  {
    id: 'word-guess',
    title: 'Word Guess',
    description: 'Guess the 5-letter word in 6 tries with hints',
    icon: <Brain className="h-6 w-6" />,
    color: 'bg-blue-500',
    players: 'Solo'
  },
  {
    id: 'crossword',
    title: 'Crossword Grid',
    description: 'Build words on a 15×15 grid with bonus squares',
    icon: <Grid3X3 className="h-6 w-6" />,
    color: 'bg-green-500',
    players: 'Solo'
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer Battle',
    description: 'Real-time crossword battles with friends',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-purple-500',
    players: '2-4 Players'
  },
  {
    id: 'tournament',
    title: 'Tournament',
    description: 'Compete in tournaments with $WLD prizes',
    icon: <Trophy className="h-6 w-6" />,
    color: 'bg-yellow-500',
    players: 'Up to 10'
  }
];

interface GameModesProps {
  onSelectMode: (mode: string) => void;
}

export const GameModes: React.FC<GameModesProps> = ({ onSelectMode }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Game</h1>
        <p className="text-gray-600">Select a game mode to start playing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gameModes.map((mode) => (
          <Card key={mode.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${mode.color} text-white`}>
                  {mode.icon}
                </div>
                <Badge variant="secondary">{mode.players}</Badge>
              </div>
              <CardTitle className="text-xl">{mode.title}</CardTitle>
              <CardDescription>{mode.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onSelectMode(mode.id)}
                className="w-full"
                variant={mode.id === 'tournament' ? 'default' : 'outline'}
              >
                {mode.id === 'tournament' ? (
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span>Join Tournament</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Gamepad2 className="h-4 w-4" />
                    <span>Play Now</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800">
          <Target className="h-5 w-5" />
          <span className="font-medium">Pro Tip</span>
        </div>
        <p className="text-blue-700 mt-1">
          Start with Word Guess to warm up, then challenge friends in Multiplayer mode!
        </p>
      </div>
    </div>
  );
};
