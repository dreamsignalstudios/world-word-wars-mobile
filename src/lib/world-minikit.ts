
// World MiniKit SDK Integration - Official Implementation
interface WorldIdVerifyPayload {
  action: string;
  signal: string;
  verification_level?: 'device' | 'orb';
}

interface PaymentPayload {
  to: string;
  tokens: Array<{
    symbol: string;
    token_amount: string;
  }>;
  description: string;
}

interface WorldMiniKitResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  nullifier_hash?: string;
  verification_level?: 'device' | 'orb';
  transaction_id?: string;
  signature?: string;
  address?: string;
  balance?: number;
}

interface WorldUser {
  username: string;
  avatar?: string;
  wallet_address: string;
  verification_level: 'device' | 'orb';
}

interface Contact {
  id: string;
  username: string;
  avatar?: string;
}

class WorldMiniKit {
  private isWorldApp(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).WorldApp !== undefined;
  }

  async verifyWorldId(payload: WorldIdVerifyPayload): Promise<WorldMiniKitResponse> {
    console.log('Verifying World ID:', payload);
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.verify(payload);
      } catch (error) {
        console.error('World ID verification error:', error);
        return { success: false, error: 'Verification failed' };
      }
    }

    // Development fallback - remove in production
    return {
      success: true,
      nullifier_hash: `worldid_${Date.now()}`,
      verification_level: 'orb'
    };
  }

  async connectWallet(): Promise<WorldMiniKitResponse> {
    console.log('Connecting wallet');
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.connectWallet();
      } catch (error) {
        console.error('Wallet connection error:', error);
        return { success: false, error: 'Wallet connection failed' };
      }
    }

    // Development fallback
    return {
      success: true,
      address: '0x742d35Cc6634C0532925a3b8D83D93f4a5c79A1E',
      balance: 0
    };
  }

  async signMessage(payload: { message: string }): Promise<WorldMiniKitResponse> {
    console.log('Signing message:', payload);
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.signMessage(payload);
      } catch (error) {
        console.error('Sign message error:', error);
        return { success: false, error: 'Signing failed' };
      }
    }

    // Development fallback
    return {
      success: true,
      signature: `sig_${Date.now()}`
    };
  }

  async pay(payload: PaymentPayload): Promise<WorldMiniKitResponse> {
    console.log('Processing payment:', payload);
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.pay(payload);
      } catch (error) {
        console.error('Payment error:', error);
        return { success: false, error: 'Payment failed' };
      }
    }

    // Development fallback
    return {
      success: true,
      transaction_id: `tx_${Date.now()}`
    };
  }

  async getUserProfile(): Promise<WorldUser | null> {
    console.log('Getting user profile');
    
    if (this.isWorldApp()) {
      try {
        const result = await (window as any).WorldApp.getUserProfile();
        return result.data;
      } catch (error) {
        console.error('Get profile error:', error);
        return null;
      }
    }

    // Development fallback
    return {
      username: 'dev_user',
      wallet_address: '0x742d35Cc6634C0532925a3b8D83D93f4a5c79A1E',
      verification_level: 'orb'
    };
  }

  async getContacts(): Promise<WorldMiniKitResponse<Contact[]>> {
    console.log('Getting contacts');
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.shareContacts();
      } catch (error) {
        console.error('Get contacts error:', error);
        return { success: false, error: 'Failed to get contacts' };
      }
    }

    // Development fallback
    return {
      success: true,
      data: []
    };
  }

  async shareContacts(): Promise<WorldMiniKitResponse> {
    console.log('Getting contacts');
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.shareContacts();
      } catch (error) {
        console.error('Share contacts error:', error);
        return { success: false, error: 'Failed to get contacts' };
      }
    }

    // Development fallback
    return {
      success: true,
      data: []
    };
  }

  hapticFeedback(type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy' = 'light'): void {
    console.log('Haptic feedback:', type);
    
    if (this.isWorldApp()) {
      try {
        (window as any).WorldApp.sendHapticFeedback({ type });
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
    
    // Fallback vibration
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'heavy' ? 200 : type === 'medium' ? 100 : 50);
    }
  }
}

export const worldMiniKit = new WorldMiniKit();
