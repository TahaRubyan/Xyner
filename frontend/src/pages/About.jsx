import React from 'react';
import { Sofa, Users, Sparkles, Smile, PackageCheck, Flame } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Sofa size={32} className="text-light-green" />,
      title: 'Cozy Dine-in Ambiance',
      desc: 'Our Jalalpur Jattan branch features a warm, family-friendly, and highly stylish environment. With comfortable seating, modern decor, and soft lighting, it is the perfect spot for family dinners, birthdays, or weekend hangouts with friends.'
    },
    {
      icon: <Users size={32} className="text-light-green" />,
      title: 'Affordable Party Deals',
      desc: 'We believe food brings people together. Our menu includes special mega party deals and bundle discounts designed to serve large groups, events, or celebrations at an incredibly pocket-friendly price.'
    },
    {
      icon: <PackageCheck size={32} className="text-light-green" />,
      title: 'Quick & Convenient Takeaway',
      desc: 'On the run? Our kitchen operates at maximum speed to pack and seal your hot takeaway meals. Order ahead via WhatsApp or website and pick up your meal freshly packed in neat, heat-locking packaging.'
    }
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white">
            Why Choose <span className="text-light-green">XYNER</span>?
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl">
            We are committed to delivering the ultimate comfort food experience in Jalalpur Jattan. Here is what makes us the cafe you love.
          </p>
        </div>

        {/* Brand Promise / Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-light-green font-bold">
              <Sparkles size={20} />
              <span>THE COMFORT FOOD STORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white leading-tight">
              Crafting taste that brings smiles, one meal at a time
            </h2>
            <p className="text-gray-300 leading-relaxed">
              XYNER started with a simple passion: to make premium-quality fast food accessible to everyone. We didn't want to be just another generic eatery. We set out to refine the local fast-food experience by sourcing premium ingredients, crafting unique house recipes, and designing an inviting environment for our local community.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Whether you are craving a cheesy, bubbling deep-dish pizza, a classic crispy zinger, or our signature platters, we treat every order as a masterclass in flavor and hygiene. 
            </p>
          </div>

          {/* Graphical Display Side */}
          <div className="relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden border-2 border-light-green/20 group">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" // restaurant interior/food table
              alt="XYNER Cafe Vibe"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black-forest via-black-forest/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black-forest/80 backdrop-blur border border-light-green/15 text-center">
              <p className="font-serif font-semibold text-light-green text-sm flex items-center justify-center gap-2">
                <Flame size={16} />
                "Dine-in, Takeaway, or Doorstep Delivery — We have got you covered."
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, index) => (
            <div key={index} className="card-gradient p-8 rounded-3xl flex flex-col items-center text-center space-y-4 transition-all duration-300">
              <div className="p-4 rounded-2xl bg-light-green/10 border border-light-green/15 mb-2">
                {val.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {val.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Fun Stats Banner */}
        <div className="mt-24 p-8 sm:p-12 rounded-3xl card-gradient text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-overlay opacity-50 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-light-green">
              Let us host your next event!
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Planning a birthday party, family gathering, or small event? Get in touch with us to book a designated party zone at our Jalalpur Jattan branch with custom party deals tailored just for you.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/923111373333"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-light-green text-black-forest font-bold hover:bg-frosted-mint transition-all"
              >
                Discuss Party Packages on WhatsApp
                <Smile size={18} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
