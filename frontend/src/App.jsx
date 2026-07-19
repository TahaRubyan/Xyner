import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Calendar, Phone, MapPin, Clock, Menu as MenuIcon, X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { useCart } from './context/CartContext';

// Scroll to top on route change helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Navigation Link component with active state styling
function NavLink({ to, children, currentPath }) {
  const isActive = currentPath === to;
  const handleClick = (e) => {
    if (isActive) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 nav-underline ${
        isActive ? 'text-light-green font-semibold' : 'text-gray-300 hover:text-light-green'
      }`}
    >
      {children}
    </Link>
  );
}

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const location = useLocation();

  const { cart, removeFromCart, updateQuantity, getCartCount, getCartTotal } = useCart();

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMobileLinkClick = (to) => {
    setMobileMenuOpen(false);
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative radial-overlay text-[#f3f4f6] overflow-x-hidden w-full max-w-full">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black-forest/80 border-b border-light-green/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                onClick={handleLogoClick}
                className="text-3xl font-serif font-black tracking-widest text-light-green hover:opacity-90 transition-opacity duration-300"
              >
                XYNER
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
              <NavLink to="/menu" currentPath={location.pathname}>Menu</NavLink>
              <NavLink to="/about" currentPath={location.pathname}>Why Us</NavLink>
              <NavLink to="/contact" currentPath={location.pathname}>Contact & Booking</NavLink>
            </nav>

            {/* CTA Button / Cart Indicator */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-gray-300 hover:text-light-green transition-colors btn-glow rounded-full bg-black/40 border border-light-green/10"
              >
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-light-green text-black-forest text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>

              <Link
                to="/contact"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-light-green text-black-forest font-semibold btn-glow shadow-md shadow-light-green/10"
              >
                <ShoppingBag size={18} />
                Order Now
              </Link>
            </div>

            {/* Mobile Menu & Cart Button */}
            <div className="md:hidden flex items-center space-x-3">
              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-gray-300 hover:text-light-green transition-colors btn-glow rounded-full bg-black/40 border border-light-green/10"
              >
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-light-green text-black-forest text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-light-green p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-light-green/10 bg-black-forest px-4 pt-2 pb-6 space-y-3">
            <Link
              to="/"
              onClick={() => handleMobileLinkClick('/')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-light-green hover:bg-light-green/5"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => handleMobileLinkClick('/menu')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-light-green hover:bg-light-green/5"
            >
              Menu
            </Link>
            <Link
              to="/about"
              onClick={() => handleMobileLinkClick('/about')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-light-green hover:bg-light-green/5"
            >
              Why Us
            </Link>
            <Link
              to="/contact"
              onClick={() => handleMobileLinkClick('/contact')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-light-green hover:bg-light-green/5"
            >
              Contact & Booking
            </Link>
            <Link
              to="/contact"
              onClick={() => handleMobileLinkClick('/contact')}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-light-green text-black-forest font-semibold btn-glow shadow-md"
            >
              <ShoppingBag size={18} />
              Order Now
            </Link>
          </div>
        )}
      </header>

      {/* Sliding Shopping Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setCartOpen(false)}
            />
            
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6">
              <div className="pointer-events-auto w-[85vw] max-w-md">
                <div className="flex h-full flex-col overflow-hidden bg-[#070a07] border-l border-light-green/10 shadow-2xl text-white">
                  <div className="flex items-center justify-between border-b border-light-green/5 pb-5 pt-6 px-4 sm:px-6 flex-shrink-0">
                    <h2 className="text-xl font-serif font-black text-white flex items-center gap-2 animate-pulse">
                      <ShoppingCart size={22} className="text-light-green" />
                      Your Cart
                    </h2>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-gray-400 hover:text-light-green p-1"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div>
                      {cart.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                          <ShoppingCart size={48} className="mx-auto text-gray-700" />
                          <p className="text-gray-400 text-sm">Your cart is currently empty.</p>
                          <Link
                            to="/menu"
                            onClick={() => setCartOpen(false)}
                            className="inline-block text-xs font-semibold text-light-green hover:underline"
                          >
                            Explore Our Menu
                          </Link>
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-light-green/5">
                            {cart.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="flex flex-1 flex-col justify-between">
                                  <div>
                                    <div className="flex justify-between text-base font-semibold text-white">
                                      <h3 className="hover:text-light-green transition-colors duration-300 text-sm sm:text-base">
                                        {item.name}
                                      </h3>
                                      <p className="ml-4 text-light-green text-sm sm:text-base">
                                        Rs. {item.price * item.quantity}/-
                                      </p>
                                    </div>
                                    <p className="mt-1 text-[10px] text-gray-400">
                                      {item.category}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-1.5 border border-light-green/10 rounded-full px-2.5 py-1 bg-black/40">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="text-gray-400 hover:text-light-green"
                                      >
                                        <Minus size={12} />
                                      </button>
                                      <span className="text-[11px] font-bold w-4 text-center">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="text-gray-400 hover:text-light-green"
                                      >
                                        <Plus size={12} />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-[10px] text-red-400 hover:text-red-500 flex items-center gap-1"
                                    >
                                      <Trash2 size={11} />
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-light-green/10 py-6 px-4 sm:px-6 bg-[#040604] flex-shrink-0">
                      <div className="flex justify-between text-base font-serif font-black text-white mb-4">
                        <p>Subtotal</p>
                        <p className="text-light-green">Rs. {getCartTotal()}/-</p>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">
                        Select Delivery or Takeaway/Pre-Order in the checkout screen.
                      </p>
                      <div className="mt-6">
                        <Link
                          to="/contact"
                          onClick={() => setCartOpen(false)}
                          className="flex items-center justify-center rounded-full bg-light-green px-6 py-3.5 text-sm sm:text-base font-bold text-black-forest btn-glow shadow-md w-full"
                        >
                          Proceed to Checkout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-light-green/10 py-12 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-light-green tracking-widest">XYNER</h3>
              <p className="text-sm text-gray-300">
                The cafe you love. Dedicated to serving the finest fast food, burgers, pizzas, and donners in Jalalpur Jattan.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <MapPin size={14} className="text-light-green" />
                <span>New Sialkot Road, Jalalpur Jattan</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 font-serif">Quick Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-light-green transition-colors">Home</Link></li>
                <li><Link to="/menu" className="hover:text-light-green transition-colors">Our Menu</Link></li>
                <li><Link to="/about" className="hover:text-light-green transition-colors">Why XYNER</Link></li>
                <li><Link to="/contact" className="hover:text-light-green transition-colors">Contact & Table Booking</Link></li>
                <li><Link to="/dashboard" className="text-gray-500 hover:text-light-green transition-colors opacity-60 hover:opacity-100 text-xs">FOH Panel</Link></li>
              </ul>
            </div>

            {/* Hours & Contact */}
            <div className="space-y-3 text-sm">
              <h4 className="text-white font-semibold mb-4 font-serif">Contact Information</h4>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-light-green" />
                <span>(03) 111 373 333</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-light-green" />
                <span>Daily: 12:00 PM - 12:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  );
}
