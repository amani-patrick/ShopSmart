import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { forgotPassword } from '@/services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success(t('common.loginSuccess'));

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t('common.loginFailed'));
      } else {
        toast.error(t('common.unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await forgotPassword(forgotPasswordEmail);
      toast.success(response.message);
      setIsForgotPasswordOpen(false);
      setForgotPasswordEmail('');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t('common.unexpectedError'));
      } else {
        toast.error(t('common.unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{t('common.welcome')}</CardTitle>
          <CardDescription>{t('common.enterInfo')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                {t('common.demoLogin')}: amani@eample.com / 
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('common.password')}</Label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-brand-600 hover:underline"
                >
                  {t('common.forgotPassword')}
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? t('common.signingIn') : t('common.signin')}
            </Button>
            <p className="text-sm text-gray-500 text-center">
              {t('common.dontHaveAccount')}{" "}
              <Link to="/signup" className="text-brand-600 hover:underline">
                {t('common.signup')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.forgotPassword')}</DialogTitle>
            <DialogDescription>
              {t('common.enterEmailForReset')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">{t('common.email')}</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {t('common.sendResetLink')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;
