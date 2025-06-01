
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorld } from '@/components/world-provider';
import { Trophy, Target, Clock, DollarSign, Award, TrendingUp } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useWorld();

  if (!user) return null;

  const stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalEarnings: 0,
    averageScore: 0,
    bestStreak: 0,
    totalWords: 0,
    achievements: []
  };

  const recentGames = [
    // No recent games yet
  ];

  const achievements = [
    { id: 'first-game', name: 'First Steps', description: 'Play your first game', unlocked: false },
    { id: 'word-master', name: 'Word Master', description: 'Find 100 words', unlocked: false },
    { id: 'streak-5', name: 'Hot Streak', description: 'Win 5 games in a row', unlocked: false },
    { id: 'big-spender', name: 'High Roller', description: 'Win 100 WLD in tournaments', unlocked: false }
  ];

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      <h1 className="text-2xl font-bold text-center">Profile</h1>

      {/* User Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.username}</h2>
              <div className="text-sm text-gray-500 mb-2">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {user.verificationLevel === 'orb' ? '🌍 Orb Verified' : '📱 Device Verified'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Wallet Balance</span>
            <span className="font-bold text-lg">{user.balance.toFixed(2)} WLD</span>
          </div>
        </CardContent>
      </Card>

      {/* Game Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Game Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.gamesPlayed === 0 ? (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Games Played Yet</h3>
              <p className="text-gray-500">Start playing to see your statistics here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.gamesWon}</div>
                <div className="text-sm text-gray-600">Games Won</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.averageScore}</div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.totalEarnings.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {achievement.name}
                </div>
                <div className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Unlocked
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Games */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Games</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentGames.length === 0 ? (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Games</h3>
              <p className="text-gray-500">Your game history will appear here once you start playing!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentGames.map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  {/* Game details would go here */}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
