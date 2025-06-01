
import React from 'react';

export const GameSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="flex space-x-2 justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 w-10 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

export const LeaderboardSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🎮</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Loading WordGame</h2>
          <div className="flex justify-center space-x-1">
            {['W', 'O', 'R', 'D', 'S'].map((letter, index) => (
              <span
                key={letter}
                className="text-lg font-bold text-purple-600 animate-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
        
        <div className="text-gray-600">
          <p>Preparing your gaming experience...</p>
        </div>
      </div>
    </div>
  );
};
