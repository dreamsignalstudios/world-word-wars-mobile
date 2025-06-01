
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
  makePayment: (amount: number, recipient: string, description?: string) => Promise<string>;
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
      // Step 1: Connect wallet
      const walletResult = await worldMiniKit.connectWallet();
      if (!walletResult.success) {
        throw new Error(walletResult.error || 'Wallet connection failed');
      }

      // Step 2: Sign authentication message
      const signResult = await worldMiniKit.signMessage({
        message: 'Authenticate with PlayWords'
      });
      if (!signResult.success) {
        throw new Error(signResult.error || 'Message signing failed');
      }

      // Step 3: Verify World ID with orb level requirement
      const verifyResult = await worldMiniKit.verifyWorldId({
        action: 'playwords-game-access',
        signal: 'verify-human-player',
        verification_level: 'orb'
      });

      if (!verifyResult.success) {
        throw new Error(verifyResult.error || 'World ID verification failed');
      }

      // Step 4: Get user profile from World
      const profile = await worldMiniKit.getUserProfile();
      if (!profile) {
        throw new Error('Failed to get user profile');
      }

      setUser({
        id: verifyResult.nullifier_hash || 'unknown',
        username: profile.username,
        avatar: profile.avatar,
        walletAddress: walletResult.address || profile.wallet_address,
        balance: walletResult.balance || 0,
        isVerified: true,
        verificationLevel: verifyResult.verification_level || 'orb'
      });

      worldMiniKit.hapticFeedback('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      worldMiniKit.hapticFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    setError(null);
  };

  const makePayment = async (amount: number, recipient: string, description = 'PlayWords payment'): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    
    const result = await worldMiniKit.pay({
      to: recipient,
      tokens: [
        {
          symbol: 'WLD',
          token_amount: amount.toString()
        }
      ],
      description
    });

    if (!result.success) {
      throw new Error(result.error || 'Payment failed');
    }

    // Update user balance after successful payment
    setUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);

    return result.transaction_id || '';
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    
    const result = await worldMiniKit.signMessage({ message });
    if (!result.success) {
      throw new Error(result.error || 'Message signing failed');
    }

    return result.signature || '';
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
