import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route,useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";



// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Debts from "./pages/Debts";
import Reports from "./pages/Reports";
import Suppliers from "./pages/Suppliers";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

const queryClient = new QueryClient();

// Protected route guard component

const ProtectedRoute = ({ element, adminOnly = false }: { element: JSX.Element; adminOnly?: boolean }) => {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const location = useLocation();  // Get the current location

  // Show loading spinner while checking auth
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not logged in, redirect to login with the 'from' state to return after login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If it's an admin-only page and the user is not an admin, redirect to the dashboard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;  // Render the requested component
};
  
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
            </Route>
            
            {/* Protected Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} />} />
              <Route path="/sales" element={<ProtectedRoute element={<Sales />} />} />
              <Route path="/debts" element={<ProtectedRoute element={<Debts />} />} />
              <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
              <Route path="/suppliers" element={<ProtectedRoute element={<Suppliers />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              
              {/* Admin Route */}
              <Route path="/admin" element={<ProtectedRoute element={<Admin />} adminOnly={true} />} />
            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
