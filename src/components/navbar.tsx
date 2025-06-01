
import React from 'react';
import { useWorld } from './world-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ soundEnabled, onSoundToggle }) => {
  const { user, isAuthenticated, connect, isLoading } = useWorld();

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="text-xl font-bold text-purple-600">WordGame</div>
        {isAuthenticated && user && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {user.verificationLevel === 'orb' ? '🌍 Orb Verified' : '📱 Device Verified'}
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSoundToggle}
          className="p-2"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5 text-gray-600" />
          ) : (
            <VolumeX className="h-5 w-5 text-gray-600" />
          )}
        </Button>

        {isAuthenticated && user ? (
          <div className="flex items-center space-x-2">
            <div className="text-sm text-right">
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-gray-500">{user.balance.toFixed(2)} WLD</div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <Button 
            onClick={connect} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            {isLoading ? 'Connecting...' : 'Verify with World ID'}
          </Button>
        )}
      </div>
    </nav>
  );
};
