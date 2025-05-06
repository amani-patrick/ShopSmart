import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  CheckCircle, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  PieChart, 
  Clock3,
  Menu,
  Globe
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LandingPage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-brand-600 text-white">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Logo className="w-36" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-white hover:text-gray-200">
              {t('landing.footer.company.about')}
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-200">
              {t('landing.footer.company.contact')}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-brand-700">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('fr')} className="cursor-pointer">
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('es')} className="cursor-pointer">
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('rw')} className="cursor-pointer">
                  Kinyarwanda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex space-x-3">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-brand-700 px-4">{t('landing.cta.login')}</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-brand-600 hover:bg-gray-100 px-4">{t('landing.cta.signUp')}</Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] bg-brand-600 text-white">
              <div className="flex flex-col space-y-4 pt-8">
                <Link to="/about" className="w-full">
                  <Button variant="ghost" className="w-full text-white hover:bg-brand-700">{t('landing.footer.company.about')}</Button>
                </Link>
                <Link to="/contact" className="w-full">
                  <Button variant="ghost" className="w-full text-white hover:bg-brand-700">{t('landing.footer.company.contact')}</Button>
                </Link>
                <div className="px-4 py-2">
                  <p className="text-sm font-medium mb-2">Language</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="ghost" 
                      className="w-full text-white hover:bg-brand-700"
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-white hover:bg-brand-700"
                      onClick={() => changeLanguage('fr')}
                    >
                      Français
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-white hover:bg-brand-700"
                      onClick={() => changeLanguage('es')}
                    >
                      Español
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-white hover:bg-brand-700"
                      onClick={() => changeLanguage('rw')}
                    >
                      Kinyarwanda
                    </Button>
                  </div>
                </div>
                <Link to="/login" className="w-full">
                  <Button variant="ghost" className="w-full text-white hover:bg-brand-700">{t('landing.cta.login')}</Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button className="w-full bg-white text-brand-600 hover:bg-gray-100">{t('landing.cta.signUp')}</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-brand-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('landing.hero.title')}
              </h1>
              <p className="text-xl mb-8 opacity-90">
                {t('landing.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 w-full sm:w-auto">
                    {t('landing.hero.getStarted')}
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white bg-brand-700 hover:bg-brand-800 w-full sm:w-auto"
                >
                  {t('landing.hero.learnMore')}
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                alt="Dashboard preview" 
                className="rounded-lg shadow-xl max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.features.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <ShoppingBag className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.inventory.title')}</h3>
              <p className="text-gray-600">
                {t('landing.features.inventory.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <CreditCard className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.sales.title')}</h3>
              <p className="text-gray-600">
                {t('landing.features.sales.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Clock3 className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.debts.title')}</h3>
              <p className="text-gray-600">
                {t('landing.features.debts.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Truck className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.suppliers.title')}</h3>
              <p className="text-gray-600">
                {t('landing.features.suppliers.description')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <BarChart3 className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.reports.title')}</h3>
              <p className="text-gray-600">
                {t('landing.features.reports.description')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <PieChart className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.profit.title')}</h3>
              <p className="text-gray-600">
                {t('landing.features.profit.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.testimonials.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold mr-4">
                  SA
                </div>
                <div>
                  <h4 className="font-semibold">{t('landing.testimonials.testimonial1.name')}</h4>
                  <p className="text-sm text-gray-500">{t('landing.testimonials.testimonial1.role')}</p>
                </div>
              </div>
              <p className="text-gray-600">
                {t('landing.testimonials.testimonial1.text')}
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">{t('landing.testimonials.testimonial2.name')}</h4>
                  <p className="text-sm text-gray-500">{t('landing.testimonials.testimonial2.role')}</p>
                </div>
              </div>
              <p className="text-gray-600">
                {t('landing.testimonials.testimonial2.text')}
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold mr-4">
                  LP
                </div>
                <div>
                  <h4 className="font-semibold">{t('landing.testimonials.testimonial3.name')}</h4>
                  <p className="text-sm text-gray-500">{t('landing.testimonials.testimonial3.role')}</p>
                </div>
              </div>
              <p className="text-gray-600">
                {t('landing.testimonials.testimonial3.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('landing.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('landing.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 w-full sm:w-auto">
                {t('landing.cta.signUp')}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white bg-brand-700 hover:bg-brand-800 w-full sm:w-auto">
                {t('landing.cta.login')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="w-32 mb-4" />
              <p className="text-gray-400">
                {t('landing.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('landing.footer.product.title')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">{t('landing.footer.product.features')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t('landing.footer.product.pricing')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t('landing.footer.product.demo')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('landing.footer.company.title')}</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">{t('landing.footer.company.about')}</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t('landing.footer.company.blog')}</a></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">{t('landing.footer.company.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('landing.footer.legal.title')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">{t('landing.footer.legal.privacy')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t('landing.footer.legal.terms')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
