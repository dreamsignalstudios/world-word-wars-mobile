
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, Users, Clock, DollarSign, Medal, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorld } from '@/components/world-provider';

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
  const [customBetAmount, setCustomBetAmount] = useState(5);
  const [showCreateTournament, setShowCreateTournament] = useState(false);

  const tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Daily Crossword Championship',
      gameType: 'crossword',
      entryFee: 2,
      prizePool: 16,
      maxPlayers: 10,
      currentPlayers: 3,
      status: 'waiting'
    },
    {
      id: '2',
      name: 'Word Guess Lightning Round',
      gameType: 'word-guess',
      entryFee: 1,
      prizePool: 8,
      maxPlayers: 8,
      currentPlayers: 6,
      status: 'waiting'
    },
    {
      id: '3',
      name: 'High Stakes Crossword',
      gameType: 'crossword',
      entryFee: 10,
      prizePool: 80,
      maxPlayers: 10,
      currentPlayers: 10,
      status: 'active',
      startTime: new Date(Date.now() + 5 * 60 * 1000)
    }
  ];

  const handleJoinTournament = async (tournament: Tournament) => {
    if (!user || user.balance < tournament.entryFee) {
      alert('Insufficient balance to join tournament');
      return;
    }

    try {
      await makePayment(tournament.entryFee, 'tournament-contract-address');
      alert(`Successfully joined ${tournament.name}!`);
    } catch (error) {
      alert('Failed to join tournament. Please try again.');
    }
  };

  const handleCreateTournament = async () => {
    if (!user || user.balance < customBetAmount) {
      alert('Insufficient balance to create tournament');
      return;
    }

    try {
      await makePayment(customBetAmount, 'tournament-contract-address');
      alert('Tournament created successfully!');
      setShowCreateTournament(false);
    } catch (error) {
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
    return {
      first: Math.floor(prizePool * 0.5),
      second: Math.floor(prizePool * 0.3),
      third: Math.floor(prizePool * 0.2)
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

      {/* Tournament Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Game Type</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Active Tournaments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available Tournaments</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCreateTournament(true)}
          >
            Create
          </Button>
        </div>

        {tournaments
          .filter(t => !selectedGameType || t.gameType === selectedGameType)
          .map((tournament) => {
            const prizes = getPrizeDistribution(tournament.prizePool);
            
            return (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    <Badge className={getStatusColor(tournament.status)}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{tournament.entryFee} WLD</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Prize Pool:</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {tournament.prizePool} WLD
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <Trophy className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                      <div className="font-medium">{prizes.first} WLD</div>
                      <div className="text-gray-500">1st</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <Medal className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                      <div className="font-medium">{prizes.second} WLD</div>
                      <div className="text-gray-500">2nd</div>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded">
                      <Award className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                      <div className="font-medium">{prizes.third} WLD</div>
                      <div className="text-gray-500">3rd</div>
                    </div>
                  </div>

                  {tournament.status === 'active' && tournament.startTime && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Clock className="h-4 w-4" />
                      <span>Started {new Date(tournament.startTime).toLocaleTimeString()}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleJoinTournament(tournament)}
                    disabled={tournament.status !== 'waiting' || tournament.currentPlayers >= tournament.maxPlayers}
                    className="w-full"
                    variant={tournament.status === 'waiting' ? 'default' : 'secondary'}
                  >
                    {tournament.status === 'waiting' ? (
                      `Join Tournament (${tournament.entryFee} WLD)`
                    ) : tournament.status === 'active' ? (
                      'In Progress'
                    ) : (
                      'Tournament Full'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Create Tournament Modal */}
      {showCreateTournament && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle>Create Tournament</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Game Type</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedGameType === 'word-guess' ? 'default' : 'outline'}
                  onClick={() => setSelectedGameType('word-guess')}
                  size="sm"
                >
                  Word Guess
                </Button>
                <Button
                  variant={selectedGameType === 'crossword' ? 'default' : 'outline'}
                  onClick={() => setSelectedGameType('crossword')}
                  size="sm"
                >
                  Crossword
                </Button>
              </div>
            </div>

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

            <div className="text-sm text-gray-600">
              <div>Max Players: 10</div>
              <div>Prize Pool: {customBetAmount * 10} WLD</div>
              <div>Your Entry: {customBetAmount} WLD</div>
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
            <li>• Entry fee required to join</li>
            <li>• Top 3 players win prizes</li>
            <li>• 10 players maximum per tournament</li>
            <li>• Tournament starts when full</li>
            <li>• Winner takes 50% of prize pool</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
