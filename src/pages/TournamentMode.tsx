
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, Users, Clock, DollarSign, Medal, Award, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorld } from '@/components/world-provider';
import { worldMiniKit } from '@/lib/world-minikit';

interface Tournament {
  id: string;
  name: string;
  gameType: 'word-guess' | 'crossword';
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'active' | 'finished';
  startTime?: Date;
}

interface TournamentModeProps {
  onBack: () => void;
  soundEnabled: boolean;
}

export const TournamentMode: React.FC<TournamentModeProps> = ({ onBack, soundEnabled }) => {
  const { user, makePayment } = useWorld();
  const [selectedGameType, setSelectedGameType] = useState<'word-guess' | 'crossword'>('crossword');
  const [gameMode, setGameMode] = useState<'free' | 'betting'>('betting');
  const [customBetAmount, setCustomBetAmount] = useState(5);
  const [showCreateTournament, setShowCreateTournament] = useState(false);

  // Mock tournaments - replace with real data
  const tournaments: Tournament[] = [
    // Will be populated from real tournament data
  ];

  const handleJoinTournament = async (tournament: Tournament) => {
    if (!user) return;

    const appFee = tournament.entryFee * 0.02; // 2% app fee
    const totalCost = tournament.entryFee + appFee;

    if (user.balance < totalCost) {
      alert('Insufficient balance to join tournament');
      return;
    }

    try {
      // Payment goes to tournament pool + app fee
      await makePayment(
        totalCost,
        'tournament-contract-address',
        `Tournament entry: ${tournament.name} (${tournament.entryFee} WLD + ${appFee.toFixed(2)} WLD fee)`
      );
      
      worldMiniKit.hapticFeedback('success');
      alert(`Successfully joined ${tournament.name}!`);
    } catch (error) {
      worldMiniKit.hapticFeedback('error');
      alert('Failed to join tournament. Please try again.');
    }
  };

  const handleCreateTournament = async () => {
    if (!user) return;

    const appFee = customBetAmount * 0.02; // 2% app fee
    const totalCost = customBetAmount + appFee;

    if (user.balance < totalCost) {
      alert('Insufficient balance to create tournament');
      return;
    }

    try {
      await makePayment(
        totalCost,
        'tournament-contract-address',
        `Create tournament: ${customBetAmount} WLD entry + ${appFee.toFixed(2)} WLD fee`
      );
      
      worldMiniKit.hapticFeedback('success');
      alert('Tournament created successfully!');
      setShowCreateTournament(false);
    } catch (error) {
      worldMiniKit.hapticFeedback('error');
      alert('Failed to create tournament. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'finished': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrizeDistribution = (prizePool: number) => {
    const netPool = prizePool * 0.98; // After 2% app fee
    return {
      first: Math.floor(netPool * 0.5),
      second: Math.floor(netPool * 0.3),
      third: Math.floor(netPool * 0.2)
    };
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <div className="w-8" />
      </div>

      {/* Game Type & Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Game Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Game Type</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedGameType === 'word-guess' ? 'default' : 'outline'}
                onClick={() => setSelectedGameType('word-guess')}
                className="flex flex-col h-auto p-3"
              >
                <span className="text-lg mb-1">🧠</span>
                <span className="text-sm">Word Guess</span>
              </Button>
              <Button
                variant={selectedGameType === 'crossword' ? 'default' : 'outline'}
                onClick={() => setSelectedGameType('crossword')}
                className="flex flex-col h-auto p-3"
              >
                <span className="text-lg mb-1">🔤</span>
                <span className="text-sm">Crossword</span>
              </Button>
            </div>
          </div>

          {/* Game Mode */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tournament Mode</label>
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
          </div>
        </CardContent>
      </Card>

      {/* Empty Tournament List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Tournaments</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateTournament(true)}
              disabled={gameMode === 'free'}
            >
              Create
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tournaments</h3>
            <p className="text-gray-500 mb-4">
              No tournaments available right now. Create one to get started!
            </p>
            {gameMode === 'betting' && (
              <Button onClick={() => setShowCreateTournament(true)}>
                Create Tournament
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Tournament Modal */}
      {showCreateTournament && gameMode === 'betting' && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle>Create Tournament</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Entry Fee (WLD)</label>
              <Input
                type="number"
                value={customBetAmount}
                onChange={(e) => setCustomBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                step="1"
              />
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <div>Max Players: 10</div>
              <div>Entry Fee: {customBetAmount} WLD</div>
              <div>App Fee (2%): {(customBetAmount * 0.02).toFixed(2)} WLD</div>
              <div>Prize Pool: {(customBetAmount * 10 * 0.98).toFixed(2)} WLD</div>
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                <Info className="h-3 w-3" />
                <span>2% fee supports game development</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowCreateTournament(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateTournament} className="flex-1">
                Create & Join
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 text-blue-800 mb-2">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">Tournament Rules</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Entry fee required for betting tournaments</li>
            <li>• Top 3 players win prizes (50%, 30%, 20%)</li>
            <li>• 10 players maximum per tournament</li>
            <li>• Tournament starts when full</li>
            <li>• 2% app fee supports development</li>
            <li>• Winners can claim prizes after tournament</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
