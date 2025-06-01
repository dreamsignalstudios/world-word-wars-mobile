
import React from 'react';
import { useWorld } from '@/components/world-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Target, Clock, DollarSign, Shield, Users } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, disconnect } = useWorld();

  if (!user) return null;

  // Mock stats - replace with real data
  const stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalEarnings: 0,
    averageScore: 0,
    bestStreak: 0,
    rank: 'Unranked'
  };

  const winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed * 100).toFixed(1) : '0';

  return (
    <div className="max-w-md mx-auto p-4 pb-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">Profile</h1>

      {/* User Info Card */}
      <Card>
        <CardHeader className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{user.username}</CardTitle>
          <div className="flex justify-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {user.verificationLevel === 'orb' ? '🌍 Orb Verified' : '📱 Device Verified'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Wallet Balance:</span>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-bold">{user.balance.toFixed(2)} WLD</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">World ID:</span>
            <span className="text-sm font-mono text-gray-500">
              {user.id.substring(0, 8)}...{user.id.substring(user.id.length - 8)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Verification:</span>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Shield className="h-3 w-3 mr-1" />
              Human Verified
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Game Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
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
              <p className="text-gray-500">
                Start playing to see your statistics here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{winRate}%</div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.averageScore}</div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.totalEarnings.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
            <p className="text-gray-500">
              Your recent games will appear here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
            <p className="text-gray-500">
              Start playing to unlock achievements!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="p-4">
          <Button 
            onClick={disconnect} 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
