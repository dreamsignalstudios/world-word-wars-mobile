
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Crown, Clock, DollarSign, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorld } from '@/components/world-provider';
import { worldMiniKit } from '@/lib/world-minikit';

interface Player {
  id: string;
  username: string;
  avatar?: string;
  ready: boolean;
  betAmount: number;
}

interface MultiplayerLobbyProps {
  onBack: () => void;
  onStartGame: (players: Player[], betAmount: number) => void;
  soundEnabled: boolean;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onBack, onStartGame, soundEnabled }) => {
  const { user, makePayment } = useWorld();
  const [gameMode, setGameMode] = useState<'free' | 'betting'>('free');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [betAmount, setBetAmount] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [gameType, setGameType] = useState<'word-guess' | 'crossword'>('crossword');

  const playSound = (type: 'success' | 'error' | 'place') => {
    if (soundEnabled) {
      worldMiniKit.hapticFeedback(type === 'success' ? 'success' : type === 'error' ? 'error' : 'light');
    }
  };

  useEffect(() => {
    if (user) {
      // Add current user to lobby
      setPlayers([{
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        ready: false,
        betAmount: gameMode === 'betting' ? betAmount : 0
      }]);
    }
  }, [user, gameMode, betAmount]);

  useEffect(() => {
    // Auto-add mock players for demo
    const timer = setTimeout(() => {
      if (players.length === 1) {
        const mockPlayers = [
          { id: 'mock1', username: 'PlayerBot1', ready: false, betAmount: gameMode === 'betting' ? betAmount : 0 },
          { id: 'mock2', username: 'PlayerBot2', ready: false, betAmount: gameMode === 'betting' ? betAmount : 0 }
        ].slice(0, maxPlayers - 1);
        
        setPlayers(prev => [...prev, ...mockPlayers]);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [players.length, maxPlayers, gameMode, betAmount]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && players.every(p => p.ready) && players.length >= 2) {
      onStartGame(players, gameMode === 'betting' ? betAmount : 0);
    }
  }, [countdown, players, onStartGame, gameMode, betAmount]);

  const handleReady = async () => {
    if (gameMode === 'betting' && !isReady) {
      try {
        // Mock payment for now
        await makePayment(betAmount, 'game-contract-address');
        playSound('success');
      } catch (error) {
        playSound('error');
        alert('Payment failed. Please try again.');
        return;
      }
    }

    const newReadyState = !isReady;
    setIsReady(newReadyState);
    
    // Update current player's ready state
    setPlayers(prev => prev.map(p => 
      p.id === user?.id ? { ...p, ready: newReadyState } : p
    ));

    // Auto-ready mock players
    setTimeout(() => {
      setPlayers(prev => prev.map(p => 
        p.id !== user?.id ? { ...p, ready: true } : p
      ));
    }, 1000);

    playSound('place');
  };

  useEffect(() => {
    if (players.length >= 2 && players.every(p => p.ready)) {
      setCountdown(5);
    }
  }, [players]);

  const handleInviteFriends = async () => {
    try {
      const contacts = await worldMiniKit.getContacts();
      if (contacts.success && contacts.data) {
        // Handle contact selection and invitation
        console.log('Available contacts:', contacts.data);
        playSound('success');
      }
    } catch (error) {
      console.error('Failed to get contacts:', error);
      playSound('error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Multiplayer Lobby</h1>
        <div className="w-8" />
      </div>

      {/* Game Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Game Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={gameType === 'word-guess' ? 'default' : 'outline'}
              onClick={() => setGameType('word-guess')}
              className="flex flex-col h-auto p-3"
            >
              <span className="text-lg mb-1">🧠</span>
              <span className="text-sm">Word Guess</span>
            </Button>
            <Button
              variant={gameType === 'crossword' ? 'default' : 'outline'}
              onClick={() => setGameType('crossword')}
              className="flex flex-col h-auto p-3"
            >
              <span className="text-lg mb-1">🔤</span>
              <span className="text-sm">Crossword</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Game Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={gameMode === 'free' ? 'default' : 'outline'}
              onClick={() => setGameMode('free')}
              className="flex flex-col h-auto p-3"
            >
              <span className="text-lg mb-1">🎮</span>
              <span className="text-sm">Free Play</span>
            </Button>
            <Button
              variant={gameMode === 'betting' ? 'default' : 'outline'}
              onClick={() => setGameMode('betting')}
              className="flex flex-col h-auto p-3"
            >
              <span className="text-lg mb-1">💰</span>
              <span className="text-sm">Betting</span>
            </Button>
          </div>

          {gameMode === 'betting' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Bet Amount (WLD)</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                min="0.1"
                step="0.1"
                className="text-center"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Count */}
      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map(count => (
              <Button
                key={count}
                variant={maxPlayers === count ? 'default' : 'outline'}
                onClick={() => setMaxPlayers(count)}
                className="flex items-center space-x-1"
              >
                <Users className="h-4 w-4" />
                <span>{count}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Players ({players.length}/{maxPlayers})</span>
            {countdown > 0 && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{countdown}s</span>
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {player.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{player.username}</div>
                  {gameMode === 'betting' && (
                    <div className="text-sm text-gray-500">{player.betAmount} WLD</div>
                  )}
                </div>
              </div>
              <Badge variant={player.ready ? 'default' : 'secondary'}>
                {player.ready ? 'Ready' : 'Not Ready'}
              </Badge>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: maxPlayers - players.length }).map((_, index) => (
            <div key={`empty-${index}`} className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg">
              <span className="text-gray-500">Waiting for player...</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleReady}
          disabled={countdown > 0}
          className={`w-full ${gameMode === 'betting' ? 'bg-green-600 hover:bg-green-700' : ''}`}
          size="lg"
        >
          {countdown > 0 ? (
            `Starting in ${countdown}s...`
          ) : isReady ? (
            'Ready!'
          ) : gameMode === 'betting' ? (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Pay {betAmount} WLD & Ready</span>
            </div>
          ) : (
            'Ready Up'
          )}
        </Button>

        <Button variant="outline" onClick={handleInviteFriends} className="w-full">
          <Users className="h-4 w-4 mr-2" />
          Invite Friends
        </Button>
      </div>

      {/* Game Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 text-blue-800 mb-2">
            <Zap className="h-4 w-4" />
            <span className="font-medium">Game Rules</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            {gameType === 'crossword' ? (
              <>
                <li>• Build words on a 15×15 grid</li>
                <li>• 5-minute time limit</li>
                <li>• Most points wins</li>
                {gameMode === 'betting' && <li>• Winner takes all bets</li>}
              </>
            ) : (
              <>
                <li>• Guess 5-letter words</li>
                <li>• 6 attempts per word</li>
                <li>• First to guess wins</li>
                {gameMode === 'betting' && <li>• Winner takes all bets</li>}
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
