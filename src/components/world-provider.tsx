
import React, { createContext, useContext, useState, useEffect } from 'react';
import { worldMiniKit } from '@/lib/world-minikit';

interface WorldUser {
  id: string;
  username: string;
  avatar?: string;
  walletAddress: string;
  balance: number;
  isVerified: boolean;
  verificationLevel: 'device' | 'orb';
}

interface WorldContextType {
  user: WorldUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  makePayment: (amount: number, recipient: string) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

export const useWorld = () => {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error('useWorld must be used within a WorldProvider');
  }
  return context;
};

export const WorldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WorldUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First connect wallet
      const walletResult = await worldMiniKit.walletAuth();
      if (!walletResult.success) {
        throw new Error('Wallet connection failed');
      }

      // Then verify World ID
      const verifyResult = await worldMiniKit.verifyWorldId({
        action: 'word-game-access',
        signal: 'verify-human-player'
      });

      if (!verifyResult.success) {
        throw new Error('World ID verification failed');
      }

      // Get user profile
      const profile = await worldMiniKit.getUserProfile();
      
      setUser({
        id: verifyResult.nullifier_hash,
        username: profile.username || 'Player',
        avatar: profile.avatar,
        walletAddress: walletResult.address,
        balance: walletResult.balance,
        isVerified: true,
        verificationLevel: verifyResult.verification_level
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    setError(null);
  };

  const makePayment = async (amount: number, recipient: string): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    
    const result = await worldMiniKit.pay({
      to: recipient,
      tokens: [
        {
          symbol: 'WLD',
          token_amount: amount.toString()
        }
      ],
      description: `Word Game Payment - ${amount} WLD`
    });

    if (!result.success) {
      throw new Error('Payment failed');
    }

    return result.transaction_id;
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    
    const result = await worldMiniKit.signMessage({ message });
    if (!result.success) {
      throw new Error('Message signing failed');
    }

    return result.signature;
  };

  return (
    <WorldContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        connect,
        disconnect,
        makePayment,
        signMessage
      }}
    >
      {children}
    </WorldContext.Provider>
  );
};
