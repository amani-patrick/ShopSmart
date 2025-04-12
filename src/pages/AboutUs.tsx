
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Phone, 
  Mail,
  Users,
  Heart,
  History,
  Trophy
} from 'lucide-react';
import { Logo } from '@/components/Logo';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-brand-600 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo className="w-32" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-brand-700">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-white text-brand-600 hover:bg-gray-100">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Our Story
              </h1>
              <p className="text-xl mb-8 text-gray-700 leading-relaxed">
                At ShopSmart, we're passionate about empowering local retailers with the tools they need to succeed in today's competitive market.
              </p>
              <p className="text-gray-600 mb-6">
                Founded in 2020, ShopSmart was born from the realization that many small retail businesses struggle with inventory management and sales tracking. Our founder, having grown up helping in a family-owned store, experienced these challenges firsthand and was determined to create a solution.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve thousands of small and medium-sized retailers across the country, helping them streamline operations, reduce waste, and increase profits through our easy-to-use platform.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
                alt="Our team" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-brand-100 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer First</h3>
              <p className="text-gray-600">
                We build our products with our customers' needs at the forefront, ensuring that every feature adds real value to their business.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-brand-100 p-3 rounded-full mb-4">
                <Heart className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Passion</h3>
              <p className="text-gray-600">
                We're passionate about helping small businesses thrive and grow. Their success is our success.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-brand-100 p-3 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from product development to customer support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Leadership Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=300&ixlib=rb-4.0.3" 
                  alt="CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
              <p className="text-brand-600 mb-3">CEO & Founder</p>
              <p className="text-gray-600 text-center">
                With 15 years of experience in retail technology, Sarah leads our vision and strategy.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=300&ixlib=rb-4.0.3" 
                  alt="CTO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
              <p className="text-brand-600 mb-3">CTO</p>
              <p className="text-gray-600 text-center">
                Michael oversees our technical direction and ensures our platform is reliable and scalable.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80&w=300&ixlib=rb-4.0.3" 
                  alt="COO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Lisa Rodriguez</h3>
              <p className="text-brand-600 mb-3">COO</p>
              <p className="text-gray-600 text-center">
                Lisa ensures our operations run smoothly and our customers receive exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start managing your inventory and sales with ShopSmart today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 w-full sm:w-auto">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white bg-brand-700 hover:bg-brand-800 w-full sm:w-auto">
                Contact Us
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

export default AboutUs;
