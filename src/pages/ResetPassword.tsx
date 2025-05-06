import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { resetPassword } from '@/services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error(t('common.invalidResetToken'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('common.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      toast.error(t('common.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({ 
        token, 
        newPassword: password 
      });
      toast.success(t('common.passwordResetSuccess'));
      navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t('common.passwordResetFailed'));
      } else {
        toast.error(t('common.unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{t('common.invalidResetLink')}</CardTitle>
          <CardDescription>{t('common.invalidResetLinkDesc')}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            {t('common.backToLogin')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{t('common.resetPassword')}</CardTitle>
        <CardDescription>{t('common.enterNewPassword')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t('common.newPassword')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('common.confirmNewPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t('common.resetting') : t('common.resetPassword')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPassword; 