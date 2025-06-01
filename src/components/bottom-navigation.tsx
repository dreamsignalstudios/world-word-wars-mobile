
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Trophy, User } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: 'home' | 'leaderboard' | 'profile';
  onNavigate: (page: 'home' | 'leaderboard' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 px-6 py-3 ${
                isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-500'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
