
import React from 'react';
import { useWorld } from './world-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Shield, Wallet, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const WorldIdVerification: React.FC = () => {
  const { connect, isLoading, error } = useWorld();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">PlayWords</CardTitle>
          <CardDescription>
            Human verification required. Only verified World ID users can play.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>Connect your World App wallet</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Sign authentication message</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Verify World ID (Orb required)</span>
            </div>
          </div>

          <Button 
            onClick={connect} 
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            size="lg"
          >
            {isLoading ? 'Verifying...' : 'Verify with World ID'}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Only orb-verified humans can play. No bots allowed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
