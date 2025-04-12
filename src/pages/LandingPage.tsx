
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
  X
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-brand-600 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo className="w-32" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-white hover:text-gray-200">
              About Us
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-200">
              Contact Us
            </Link>
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-brand-700">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-brand-600 hover:bg-gray-100">Sign Up</Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-brand-600 text-white">
                <div className="flex flex-col space-y-4 pt-8">
                  <Link to="/about" className="w-full">
                    <Button variant="ghost" className="w-full text-white hover:bg-brand-700">About Us</Button>
                  </Link>
                  <Link to="/contact" className="w-full">
                    <Button variant="ghost" className="w-full text-white hover:bg-brand-700">Contact Us</Button>
                  </Link>
                  <Link to="/login" className="w-full">
                    <Button variant="ghost" className="w-full text-white hover:bg-brand-700">Login</Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full bg-white text-brand-600 hover:bg-gray-100">Sign Up</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero-gradient py-16 md:py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sales Management Made Simple for Local Retailers
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Track inventory, record sales, manage debts, and generate reports with an easy-to-use platform designed for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white bg-brand-700 hover:bg-brand-800 w-full sm:w-auto"
                >
                  Learn More
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Manage Your Store</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to run your retail business efficiently and increase your profits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <ShoppingBag className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
              <p className="text-gray-600">
                Keep track of your stock levels, get low inventory alerts, and manage product information.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <CreditCard className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sales Tracking</h3>
              <p className="text-gray-600">
                Record all your sales transactions, including cash and credit sales, with an easy-to-use interface.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Clock3 className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Debt Management</h3>
              <p className="text-gray-600">
                Track customer credit, set payment deadlines, and receive reminders when payments are due.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Truck className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Supplier Management</h3>
              <p className="text-gray-600">
                Maintain a list of your suppliers, track orders, and manage relationships all in one place.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <BarChart3 className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
              <p className="text-gray-600">
                Generate daily, weekly, and monthly reports to track your business performance and make informed decisions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <PieChart className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profit Tracking</h3>
              <p className="text-gray-600">
                Monitor your profits and losses with visual reports that help you identify opportunities for growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Local Retailers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join hundreds of store owners who have transformed their business with our platform.
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
                  <h4 className="font-semibold">Sarah Anderson</h4>
                  <p className="text-sm text-gray-500">Grocery Store Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "ShopSmart has completely transformed how I manage my grocery store. I can now track inventory and sales in real-time, which has reduced waste and increased my profits."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-gray-500">Electronics Shop Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The debt tracking feature has been a game changer for my business. I no longer have to worry about forgetting customer credits, and the payment reminders are incredibly helpful."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold mr-4">
                  LP
                </div>
                <div>
                  <h4 className="font-semibold">Lisa Patel</h4>
                  <p className="text-sm text-gray-500">Clothing Boutique Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The monthly reports help me understand which products are selling well and which aren't. This data has helped me make smarter purchasing decisions and grow my business."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of retailers who use our platform to grow their business and increase profits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 w-full sm:w-auto">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white bg-brand-700 hover:bg-brand-800 w-full sm:w-auto">
                Login
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
                Empowering local retailers with smart inventory and sales management solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} ShopSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
