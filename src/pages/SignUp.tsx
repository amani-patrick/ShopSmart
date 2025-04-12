
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, implement actual registration here
    toast.success("Account created successfully!");
    navigate('/dashboard');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{t('common.createAccount')}</CardTitle>
        <CardDescription>{t('common.enterInfo')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('common.firstName')}</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('common.lastName')}</Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shopName">{t('common.shopName')}</Label>
            <Input 
              id="shopName" 
              placeholder="Your Shop Name" 
              required 
            />
          </div>
          
          {/* Address Section */}
          <div className="space-y-2">
            <Label>{t('common.address')}</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">{t('common.streetAddress')}</Label>
                <Input 
                  id="street" 
                  placeholder="123 Main St" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t('common.city')}</Label>
                  <Input 
                    id="city" 
                    placeholder="New York" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">{t('common.postalCode')}</Label>
                  <Input 
                    id="postalCode" 
                    placeholder="10001" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('common.country')}</Label>
                <Input 
                  id="country" 
                  placeholder="United States" 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('common.password')}</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('common.confirmPassword')}</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm">
              {t('common.agreeTerms')}{" "}
              <Link to="#" className="text-brand-600 hover:underline">
                {t('common.termsService')}
              </Link>{" "}
              {t('common.and')}{" "}
              <Link to="#" className="text-brand-600 hover:underline">
                {t('common.privacyPolicy')}
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full mb-4">
            {t('common.createAccount')}
          </Button>
          <p className="text-sm text-gray-500 text-center">
            {t('common.alreadyHaveAccount')}{" "}
            <Link to="/login" className="text-brand-600 hover:underline">
              {t('common.signin')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUp;
