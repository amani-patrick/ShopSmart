import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const AuthLayout = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand */}
      <div className="flex-1 bg-brand-600 p-8 text-white flex-col justify-center hidden md:flex">
        <div className="max-w-md mx-auto">
          <Logo className="mb-8 w-40" />
          <h1 className="text-4xl font-bold mb-6">
            {t('landing.hero.title')}
          </h1>
          <p className="text-lg opacity-90">
            {t('landing.hero.subtitle')}
          </p>
        </div>
      </div>
      
      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <Logo className="mx-auto w-32" dark />
          </div>
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
