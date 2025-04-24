import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BadgeDollarSign, 
  BarChart3, 
  Truck, 
  User, 
  ChevronDown, 
  LogOut, 
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-brand-100 text-brand-700 font-medium" 
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { 
        size: 18,
        className: cn(isActive ? "text-brand-600" : "text-gray-500")
      })}
      {label}
    </NavLink>
  );
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { t } = useTranslation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Fetch user data from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: `${parsedUser.firstName} ${parsedUser.lastName}`,
        email: parsedUser.email,
      });
    }
  }, []);

  const handleLogout = () => {
    // Clear user data and navigate to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  
  // Navigation items for reuse
  const navigationItems = [
    { to: "/dashboard", icon: <LayoutDashboard />, label: t('common.dashboard') },
    { to: "/inventory", icon: <Package />, label: t('common.inventory') },
    { to: "/sales", icon: <ShoppingCart />, label: t('common.sales') },
    { to: "/debts", icon: <BadgeDollarSign />, label: t('common.debts') },
    { to: "/reports", icon: <BarChart3 />, label: t('common.reports') },
    { to: "/suppliers", icon: <Truck />, label: t('common.suppliers') }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile header with hamburger menu */}
      <div className="fixed z-20 top-0 left-0 right-0 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <Logo className="w-32" dark />
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="ghost" size="sm" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[250px]">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <Logo className="w-32" dark />
                    <LanguageSwitcher variant="ghost" size="sm" />
                  </div>
                  <nav className="flex-1 p-4 space-y-1 overflow-auto">
                    {navigationItems.map((item) => (
                      <NavItem 
                        key={item.to}
                        to={item.to} 
                        icon={item.icon} 
                        label={item.label} 
                        onClick={closeSidebarOnMobile}
                      />
                    ))}
                  </nav>
                  <div className="p-4 border-t border-gray-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full flex items-center justify-between px-2 py-5 h-auto">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback className="bg-brand-100 text-brand-700">
                                {user?.name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="text-sm font-medium">{user?.name || "User"}</p>
                              <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
                            </div>
                          </div>
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => {
                          navigate('/profile');
                          closeSidebarOnMobile();
                        }}>
                          <User size={16} className="mr-2" />
                          <span>{t('common.profile')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut size={16} className="mr-2" />
                          <span>{t('common.logout')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-10 h-screen w-64 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
          "hidden lg:flex lg:flex-col", // Hide on mobile, show on desktop
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Logo className="w-32" dark />
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => (
              <NavItem 
                key={item.to}
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
              />
            ))}
          </nav>
          {/* Language Switcher moved here */}
          <div className="p-4 border-t border-gray-100">
            <LanguageSwitcher variant="outline" size="sm" />
          </div>
          <div className="p-4 border-t border-gray-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between px-2 py-5 h-auto">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-brand-100 text-brand-700">
                        {user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
                    </div>
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User size={16} className="mr-2" />
                  <span>{t('common.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  <span>{t('common.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0">
        <div className="container mx-auto py-6 px-4 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
