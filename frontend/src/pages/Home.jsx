import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Star, Quote, ShieldCheck, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlurText from '../components/BlurText';
import SpotlightCard from '../components/SpotlightCard';
import StarBorder from '../components/StarBorder';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal Intersection Observer hook for scroll entrance effects
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.12 });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Four featured signature items to highlight on the landing page
  const highlights = [
    {
      id: 'fd6',
      name: 'Zinger Burger (Deal 6)',
      price: 590,
      description: 'Our signature crispy Zinger Burger served hot with regular golden fries and a regular soft drink.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
      tag: 'Best Seller',
      category: 'FRIED DEALS'
    },
    {
      id: 'p1',
      name: 'Chicken Tikka Pizza',
      price: 650,
      description: 'Hot pan pizza loaded with premium mozzarella, spicy marinated chicken tikka chunks, onions, and local spices.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
      tag: 'Customer Favorite',
      category: 'PIZZAS & DONNERS'
    },
    {
      id: 'w3',
      name: 'Arabic Wrap (Deal 3)',
      price: 890,
      description: 'Freshly grilled Arabic-style wrap packed with tender chicken slices, fresh veggies, and our signature garlic dip.',
      image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=400',
      tag: 'Fresh Choice',
      category: 'BURGERS & WRAPS'
    },
    {
      id: 'h4',
      name: 'XYNER Platter',
      price: 890,
      description: 'An ultimate crowd-pleaser featuring 4 Pcs Spin Rolls, 6 Pcs Oven-Baked Wings, regular fries, and a rich garlic dip for dippings.',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
      tag: 'Mega Deal',
      category: 'STARTERS & SIDES'
    }
  ];

  // Pre-process items into a 1D grid representation matching the 2-column alternating wireframe layout
  const gridCells = [];
  highlights.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      gridCells.push({ type: 'image', item });
      gridCells.push({ type: 'details', item });
    } else {
      gridCells.push({ type: 'details', item });
      gridCells.push({ type: 'image', item });
    }
  });

  // Testimonials list
  const testimonials = [
    {
      id: 1,
      name: 'Ahmad Raza',
      role: 'Local Guide',
      quote: 'The Zinger Burger here is hands down the best in Jalalpur Jattan. Always crispy, fresh, and piping hot. Ordering via voice notes on WhatsApp is incredibly easy!',
      stars: 5
    },
    {
      id: 2,
      name: 'Sonia Malik',
      role: 'Food Blogger',
      quote: 'XYNER has set a new benchmark for dine-in ambiance and taste. Their Chicken Tikka Pizza is incredibly cheesy and loaded with flavor. Perfect for family get-togethers.',
      stars: 5
    },
    {
      id: 3,
      name: 'Kamran Butt',
      role: 'Regular Diner',
      quote: 'Excellent service and great value for money. Their party deals are perfect for hanging out with friends. Quick takeaways and a very cozy environment.',
      stars: 5
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Premium Ambient Glow Lights (eliminates plain black screen look) */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-light-green/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[45%] right-[-15%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-medium-jungle/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[75%] left-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-light-green/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-8 pb-16 lg:pb-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Text Column: Reordered for mobile - Heading/Details first, then blinker, then CTA */}
            <div className="space-y-8 text-center lg:text-left flex flex-col justify-center">
              
              {/* 1. BlurText Animation for Main Heading */}
              <div className="font-serif font-black tracking-tight leading-tight text-white text-5xl sm:text-6xl lg:text-7xl">
                <BlurText
                  text="XYNER"
                  delay={100}
                  animateBy="letters"
                  direction="top"
                  className="font-serif font-black justify-center lg:justify-start"
                />
                <BlurText
                  text="The Cafe You Love"
                  delay={80}
                  animateBy="words"
                  direction="bottom"
                  className="text-light-green mt-2 text-4xl sm:text-5xl lg:text-6xl justify-center lg:justify-start"
                />
              </div>
              
              {/* 2. Details Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Savor the premium taste of our signature Zingers, Pizzas, and wraps, delivered fresh and piping hot to your doorstep.
              </p>

              {/* 3. Location Blinker */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-light-green/10 border border-light-green/20 text-light-green text-sm font-semibold tracking-wide self-center lg:self-start">
                <span className="w-2 h-2 rounded-full bg-light-green animate-ping" />
                Now Open in Jalalpur Jattan
              </div>
              
              {/* 4. CTA Buttons: inline/auto size on mobile, side-by-side flex-row */}
              <div className="flex flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/menu" className="w-auto">
                  <StarBorder className="h-12" color="#96e072" speed="4s">
                    <span className="flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-black-forest bg-light-green rounded-full text-xs btn-glow">
                      <ShoppingBag size={14} />
                      Explore Menu
                    </span>
                  </StarBorder>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-full border border-light-green/30 text-light-green font-bold hover:border-light-green hover:bg-light-green/5 transition-all duration-300 w-auto text-xs"
                >
                  Book Table
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Graphic Column: Simplified for mobile, layered parallax for desktop */}
            <div className="relative flex flex-col justify-center lg:justify-end items-center h-auto lg:h-[500px]">
              {/* Decorative background glow rings */}
              <div 
                className="absolute w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[450px] lg:h-[450px] border border-light-green/5 rounded-full animate-spin-slow pointer-events-none"
                style={{ transform: `rotate(${scrollY * 0.1}deg)`, transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              
              {/* MOBILE SHOWCASE GRAPHIC: Clean side-by-side row of highlights */}
              <div className="flex lg:hidden items-center justify-center gap-4 w-full px-2 mt-8">
                {/* Burger */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-light-green/20 shadow-lg animate-float">
                    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-light-green uppercase bg-black/40 px-2 py-0.5 rounded border border-light-green/10">Zinger</span>
                </div>
                {/* Pizza */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-light-green/20 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-light-green uppercase bg-black/40 px-2 py-0.5 rounded border border-light-green/10">Pizza</span>
                </div>
                {/* Wrap */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-light-green/20 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                    <img src="https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-light-green uppercase bg-black/40 px-2 py-0.5 rounded border border-light-green/10">Wrap</span>
                </div>
              </div>

              {/* DESKTOP SHOWCASE GRAPHIC: Rich multi-item parallax */}
              <div className="hidden lg:flex relative w-[400px] h-full items-center justify-center">
                {/* Zinger Burger image - Parallax Y */}
                <div 
                  className="absolute z-20 w-[240px] h-[240px] rounded-full overflow-hidden border-4 border-light-green/25 shadow-2xl animate-float"
                  style={{ transform: `translateY(${scrollY * 0.05}px)`, transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500"
                    alt="Delicious XYNER Zinger"
                    className="w-full h-full object-cover scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-forest/60 to-transparent" />
                  <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-light-green text-black-forest text-xs font-bold font-serif uppercase tracking-wider">Zinger</span>
                </div>
                
                {/* Pizza slice - Parallax Y */}
                <div 
                  className="absolute top-4 right-6 z-30 w-[150px] h-[150px] rounded-2xl overflow-hidden border-2 border-light-green/20 shadow-xl animate-float-delayed"
                  style={{ transform: `translateY(${-scrollY * 0.08}px)`, transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400"
                    alt="Cheesy Pizza"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-light-green">Pan Pizza</span>
                </div>

                {/* Wrap - Parallax Y */}
                <div 
                  className="absolute bottom-6 left-6 z-10 w-[150px] h-[150px] rounded-2xl overflow-hidden border-2 border-light-green/20 shadow-xl animate-float-delayed" 
                  style={{ 
                    animationDelay: '0.8s',
                    transform: `translateY(${scrollY * 0.03}px)`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=400"
                    alt="Arabic Wrap"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-light-green">Arabic Wrap</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-black/30 border-y border-light-green/10 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3 reveal-on-scroll">
              <div className="p-3 rounded-full bg-light-green/10 text-light-green">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-semibold font-serif text-white">Hygiene Certified</h3>
              <p className="text-sm text-gray-400 max-w-xs">We maintain 100% clean kitchen environments and sanitized prep protocols.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 reveal-on-scroll">
              <div className="p-3 rounded-full bg-light-green/10 text-light-green">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold font-serif text-white">Super Fast Delivery</h3>
              <p className="text-sm text-gray-400 max-w-xs">Freshly packed orders dispatched hot to arrive at your door in record time.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 reveal-on-scroll">
              <div className="p-3 rounded-full bg-light-green/10 text-light-green">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-semibold font-serif text-white">Premium Taste</h3>
              <p className="text-sm text-gray-400 max-w-xs">We use 100% chicken breast fillets, premium cheeses, and signature house-made sauces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Checkerboard Signature Grid (No Prices, Checkerboard cells) */}
      <section className="py-20 lg:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 reveal-on-scroll">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white">
              Signature Highlights
            </h2>
            <p className="text-gray-300 text-lg">
              Explore the absolute fan-favorites that defined the XYNER taste. Structured in a true checkerboard zig-zag grid.
            </p>
          </div>

          {/* Grid featuring Alternating layouts: Alternating Image & Details cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gridCells.map((cell, idx) => {
              if (cell.type === 'image') {
                return (
                  <SpotlightCard 
                    key={`img-${cell.item.id}`} 
                    className="card-gradient rounded-[32px] overflow-hidden min-h-[300px] relative group reveal-on-scroll"
                  >
                    <img
                      src={cell.item.image}
                      alt={cell.item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-forest/80 to-transparent" />
                    <span className="absolute top-4 left-4 bg-light-green text-black-forest text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {cell.item.tag}
                    </span>
                  </SpotlightCard>
                );
              } else {
                return (
                  <SpotlightCard 
                    key={`det-${cell.item.id}`} 
                    className="card-gradient rounded-[32px] p-8 flex flex-col justify-between min-h-[300px] border border-light-green/10 reveal-on-scroll"
                  >
                    <div className="space-y-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-light-green/10 text-light-green text-[9px] font-bold tracking-wider uppercase border border-light-green/20">
                        {cell.item.tag}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-white group-hover:text-light-green transition-colors duration-300">
                        {cell.item.name}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {cell.item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => addToCart(cell.item)}
                        className="px-6 py-2.5 text-xs font-bold rounded-full bg-light-green text-black-forest btn-glow shadow-md flex items-center gap-2"
                      >
                        <ShoppingBag size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </SpotlightCard>
                );
              }
            })}
          </div>

          <div className="text-center mt-16 reveal-on-scroll">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-light-green text-black-forest font-bold hover:bg-frosted-mint transition-all duration-300"
            >
              View Full Menu
              <ShoppingBag size={18} />
            </Link>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-24 bg-black/15 border-t border-light-green/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 reveal-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
              What Our Guests Say
            </h2>
            <p className="text-gray-300 text-lg">
              Hear directly from the food lovers in our local community who have experienced the XYNER standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <SpotlightCard 
                key={t.id} 
                className="card-gradient rounded-3xl p-8 flex flex-col justify-between space-y-6 relative reveal-on-scroll"
              >
                <div className="absolute top-6 right-8 text-light-green/10">
                  <Quote size={56} strokeWidth={1} />
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-light-green">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="border-t border-light-green/5 pt-4">
                  <h4 className="font-serif font-bold text-white text-base">{t.name}</h4>
                  <p className="text-xs text-light-green">{t.role}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* New Post-Testimonial Reservation CTA Section */}
          <div className="mt-20 max-w-4xl mx-auto text-center">
            <SpotlightCard className="card-gradient p-10 sm:p-14 rounded-[32px] border border-light-green/15 relative overflow-hidden flex flex-col items-center space-y-8 reveal-on-scroll">
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-3xl sm:text-4xl font-serif font-black text-white leading-tight">
                  Ready to Experience the Taste?
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Book a cozy table at our Jalalpur Jattan branch or order your favorite deals via WhatsApp. Our AI receptionist is online 24/7 to punch your order or log your booking instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-full bg-light-green text-black-forest font-bold hover:bg-frosted-mint transition-all duration-300 btn-glow"
                >
                  Book A Table Now
                </Link>
                <Link
                  to="/menu"
                  className="flex items-center gap-2 px-8 py-4 rounded-full border border-light-green/30 text-light-green font-bold hover:border-light-green hover:bg-light-green/5 transition-all duration-300"
                >
                  Explore Delicious Deals
                  <ArrowRight size={16} />
                </Link>
              </div>
            </SpotlightCard>
          </div>

        </div>
      </section>
    </div>
  );
}
