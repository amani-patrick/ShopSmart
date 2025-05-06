import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { signup } from '@/services/api';

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    shopName: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = t('common.invalidEmail');
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password = t('common.passwordTooShort');
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('common.passwordMismatch');
    }

    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'email', 'shopName', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = t('common.fieldRequired');
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    // Clear error when user starts typing
    if (formErrors[id]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('common.pleaseFixErrors'));
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSignup = async () => {
    try {
      // Format the data as required
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        shopName: formData.shopName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      await signup(userData);
      toast.success(t('common.accountCreated'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error(t('common.signupFailed'));
    } finally {
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <>
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
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={formErrors.firstName ? 'border-red-500' : ''}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('common.lastName')}</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={formErrors.lastName ? 'border-red-500' : ''}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopName">{t('common.shopName')}</Label>
              <Input
                id="shopName"
                placeholder="Your Shop Name"
                value={formData.shopName}
                onChange={handleChange}
                required
                className={formErrors.shopName ? 'border-red-500' : ''}
              />
              {formErrors.shopName && (
                <p className="text-sm text-red-500">{formErrors.shopName}</p>
              )}
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
                    value={formData.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('common.city')}</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t('common.postalCode')}</Label>
                    <Input
                      id="postalCode"
                      placeholder="10001"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t('common.country')}</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required
                className={formErrors.password ? 'border-red-500' : ''}
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('common.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={formErrors.confirmPassword ? 'border-red-500' : ''}
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
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

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirmSignup')}</DialogTitle>
            <DialogDescription>
              {t('common.confirmSignupMessage')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmSignup}>
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignUp;
