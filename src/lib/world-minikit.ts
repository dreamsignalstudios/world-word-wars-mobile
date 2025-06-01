
// World MiniKit SDK Integration
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

class WorldMiniKit {
  private isWorldApp(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).WorldApp !== undefined;
  }

  async verifyWorldId(payload: WorldIdVerifyPayload): Promise<WorldMiniKitResponse> {
    console.log('Verifying World ID:', payload);
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.verifyWorldId(payload);
      } catch (error) {
        console.error('World ID verification error:', error);
        return { success: false, error: 'Verification failed' };
      }
    }

    // Mock for development
    return {
      success: true,
      nullifier_hash: `mock_${Date.now()}`,
      verification_level: 'device'
    };
  }

  async walletAuth(): Promise<WorldMiniKitResponse> {
    console.log('Authenticating wallet');
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.walletAuth();
      } catch (error) {
        console.error('Wallet auth error:', error);
        return { success: false, error: 'Wallet connection failed' };
      }
    }

    // Mock for development
    return {
      success: true,
      address: '0x1234567890123456789012345678901234567890',
      balance: 0
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

    // Mock for development
    return {
      success: true,
      transaction_id: `tx_${Date.now()}`
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

    // Mock for development
    return {
      success: true,
      signature: `sig_${Date.now()}`
    };
  }

  async getUserProfile(): Promise<{ username?: string; avatar?: string }> {
    console.log('Getting user profile');
    
    if (this.isWorldApp()) {
      try {
        const result = await (window as any).WorldApp.getUserProfile();
        return result.data || {};
      } catch (error) {
        console.error('Get profile error:', error);
        return {};
      }
    }

    // Mock for development
    return {
      username: 'DevPlayer',
      avatar: undefined
    };
  }

  async getContacts(): Promise<WorldMiniKitResponse> {
    console.log('Getting contacts');
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.getContacts();
      } catch (error) {
        console.error('Get contacts error:', error);
        return { success: false, error: 'Failed to get contacts' };
      }
    }

    // Mock for development
    return {
      success: true,
      data: []
    };
  }

  async requestPermissions(permissions: string[]): Promise<WorldMiniKitResponse> {
    console.log('Requesting permissions:', permissions);
    
    if (this.isWorldApp()) {
      try {
        return await (window as any).WorldApp.requestPermissions({ permissions });
      } catch (error) {
        console.error('Request permissions error:', error);
        return { success: false, error: 'Permission request failed' };
      }
    }

    // Mock for development
    return { success: true };
  }

  hapticFeedback(type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy' = 'light'): void {
    console.log('Haptic feedback:', type);
    
    if (this.isWorldApp()) {
      try {
        (window as any).WorldApp.hapticFeedback({ type });
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
    
    // Fallback vibration for development
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'heavy' ? 200 : type === 'medium' ? 100 : 50);
    }
  }
}

export const worldMiniKit = new WorldMiniKit();
