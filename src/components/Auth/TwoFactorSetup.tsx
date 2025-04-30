
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';

export const TwoFactorSetup = () => {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMFA, setHasMFA] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: factors } = await supabase.auth.mfa.listFactors();
      setHasMFA(factors.totp.length > 0);
    } catch (error) {
      console.error('Error checking MFA status:', error);
    }
  };

  const enroll2FA = async () => {
    try {
      setIsLoading(true);
      const { data: { totp }, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) throw error;
      
      // The totp object should contain the qr_code property but not id
      if (!totp || !totp.qr_code) {
        throw new Error('Invalid 2FA enrollment response');
      }
      
      // The factor ID is stored separately and needs to be remembered for verification
      const { data } = await supabase.auth.mfa.listFactors();
      const factorId = data.totp[0]?.id;
      
      if (!factorId) {
        throw new Error('Failed to retrieve factor ID');
      }
      
      setFactorId(factorId);
      setQr(totp.qr_code);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set up 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!factorId || !verifyCode) return;
    
    try {
      setIsLoading(true);
      const { data: { id: challengeId }, error } = await supabase.auth.mfa.challenge({ 
        factorId 
      });
      
      if (error) throw error;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      });
      
      if (verifyError) throw verifyError;

      toast.success('2FA enabled successfully');
      setHasMFA(true);
      setFactorId(null);
      setQr(null);
      setVerifyCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gaming-dark/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasMFA ? (
          <div className="text-center py-4">
            <p className="text-green-500">✓ Two-Factor Authentication is enabled</p>
          </div>
        ) : qr ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg mx-auto w-fit">
              <img src={qr} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-sm text-gray-400 text-center">
              Scan this QR code with your authenticator app
            </p>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="bg-gaming-darker"
              />
              <Button 
                onClick={verifyOTP}
                disabled={isLoading || !verifyCode}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Protect your account with Two-Factor Authentication
            </p>
            <Button 
              onClick={enroll2FA}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Setting up...' : 'Set up 2FA'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
