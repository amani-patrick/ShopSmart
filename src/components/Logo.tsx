
import React from 'react';

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", dark = false }) => {
  return (
    <div className={className}>
      <h1 className={`font-heading text-2xl font-bold ${dark ? 'text-brand-700' : 'text-white'}`}>ShopSmart</h1>
    </div>
  );
};
