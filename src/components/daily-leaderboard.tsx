
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  earnings: number;
}

interface DailyLeaderboardProps {
  onPlayerClick: (playerId: string) => void;
}

export const DailyLeaderboard: React.FC<DailyLeaderboardProps> = ({ onPlayerClick }) => {
  // Empty leaderboard - will be populated with real data
  const leaderboardData: LeaderboardEntry[] = [];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-gray-600">#{position}</span>;
    }
  };

  const renderLeaderboard = (type: 'daily' | 'alltime') => (
    <div className="space-y-3">
      {leaderboardData.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Rankings Yet</h3>
          <p className="text-gray-500">
            Leaderboard placements are yet to be shown. Start playing to earn your spot!
          </p>
        </div>
      ) : (
        leaderboardData.map((player, index) => (
          <div
            key={player.id}
            onClick={() => onPlayerClick(player.id)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(index + 1)}
            </div>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={player.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {player.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="font-medium text-gray-900">{player.username}</div>
              <div className="text-sm text-gray-500">
                {player.gamesPlayed} games • {player.winRate}% win rate
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-lg">{player.score.toLocaleString()}</div>
              <Badge variant="secondary" className="text-xs">
                +{player.earnings.toFixed(2)} WLD
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            {renderLeaderboard('daily')}
          </TabsContent>
          <TabsContent value="alltime" className="mt-4">
            {renderLeaderboard('alltime')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
