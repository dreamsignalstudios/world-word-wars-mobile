
import React, { useState, useEffect } from 'react';
import { WorldProvider, useWorld } from '@/components/world-provider';
import { WorldIdVerification } from '@/components/world-id-verification';
import { Navbar } from '@/components/navbar';
import { GameModes } from '@/components/game-modes';
import { DailyLeaderboard } from '@/components/daily-leaderboard';
import { BottomNavigation } from '@/components/bottom-navigation';
import { LoadingScreen } from '@/components/skeletons';
import { WordGuessGame } from './WordGuessGame';
import { CrosswordGame } from './CrosswordGame';
import { MultiplayerLobby } from './MultiplayerLobby';
import { TournamentMode } from './TournamentMode';
import { ProfilePage } from './ProfilePage';

type GameMode = 'word-guess' | 'crossword' | 'multiplayer' | 'tournament';
type Page = 'home' | 'leaderboard' | 'profile';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useWorld();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentGame, setCurrentGame] = useState<GameMode | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading time
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <WorldIdVerification />;
  }

  const handleGameSelect = (gameId: string) => {
    setCurrentGame(gameId as GameMode);
  };

  const handleGameBack = () => {
    setCurrentGame(null);
    setCurrentPage('home');
  };

  const handlePlayerClick = (playerId: string) => {
    console.log('Player clicked:', playerId);
    // TODO: Navigate to player profile
  };

  const renderCurrentView = () => {
    if (currentGame) {
      switch (currentGame) {
        case 'word-guess':
          return (
            <WordGuessGame
              onBack={handleGameBack}
              soundEnabled={soundEnabled}
            />
          );
        case 'crossword':
          return (
            <CrosswordGame
              onBack={handleGameBack}
              soundEnabled={soundEnabled}
            />
          );
        case 'multiplayer':
          return (
            <MultiplayerLobby
              onBack={handleGameBack}
              onStartGame={(players, betAmount) => {
                console.log('Starting multiplayer game:', players, betAmount);
                // TODO: Start multiplayer game
              }}
              soundEnabled={soundEnabled}
            />
          );
        case 'tournament':
          return (
            <TournamentMode
              onBack={handleGameBack}
              soundEnabled={soundEnabled}
            />
          );
        default:
          return null;
      }
    }

    switch (currentPage) {
      case 'home':
        return (
          <div className="max-w-md mx-auto p-4 pb-20">
            <GameModes onSelectMode={handleGameSelect} />
          </div>
        );
      case 'leaderboard':
        return (
          <div className="max-w-md mx-auto p-4 pb-20 space-y-4">
            <h1 className="text-2xl font-bold text-center">Leaderboards</h1>
            <DailyLeaderboard onPlayerClick={handlePlayerClick} />
          </div>
        );
      case 'profile':
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        soundEnabled={soundEnabled} 
        onSoundToggle={() => setSoundEnabled(!soundEnabled)} 
      />
      
      <main className="pt-4">
        {renderCurrentView()}
      </main>

      {!currentGame && (
        <BottomNavigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
        />
      )}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <WorldProvider>
      <AppContent />
    </WorldProvider>
  );
};

export default Index;
