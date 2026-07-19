import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Eye, HelpCircle } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('FRIED DEALS');
  const { addToCart } = useCart();

  // Custom items database loaded from localStorage to sync FOH custom items additions
  const [customItems, setCustomItems] = useState(() => {
    const saved = localStorage.getItem('xyner_menu_custom_items');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep custom items list updated in real-time
  useEffect(() => {
    const checkCustomItems = () => {
      const saved = localStorage.getItem('xyner_menu_custom_items');
      if (saved) {
        setCustomItems(JSON.parse(saved));
      }
    };
    checkCustomItems();
    const interval = setInterval(checkCustomItems, 2000);
    return () => clearInterval(interval);
  }, []);

  // Full base XYNER Menu dataset
  const baseMenuData = {
    'FRIED DEALS': [
      { id: 'fd1', name: 'Fried Deal 1', price: 990, desc: '1 Sandwich, Regular Fries, Regular Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd2', name: 'Fried Deal 2', price: 760, desc: '1 Zinger Twister, Regular Fries, Regular Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd3', name: 'Fried Deal 3', price: 890, desc: '1 Arabic Wrap, Regular Fries, Regular Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd4', name: 'Fried Deal 4', price: 1550, desc: '2 Arabic Wraps, Regular Fries, 500 ml Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd5', name: 'Fried Deal 5', price: 660, desc: '10 Crispy Hot Wings, Regular Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd6', name: 'Fried Deal 6', price: 590, desc: '1 Zinger Burger, Regular Fries, Regular Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd7', name: 'Fried Deal 7', price: 830, desc: '2 Zinger Burgers, 500 ml Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd8', name: 'Fried Deal 8', price: 1590, desc: '4 Zinger Burgers, 1 Liter Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd9', name: 'Fried Deal 9', price: 550, desc: '1 Crispy Burger, Regular Fries, Regular Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd10', name: 'Fried Deal 10', price: 590, desc: '1 Fillet Burger, Regular Fries, Regular Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd11', name: 'Fried Deal 11', price: 830, desc: '2 Fillet Burgers, 500 ml Soft Drink.', category: 'FRIED DEALS' },
      { id: 'fd12', name: 'Fried Deal 12', price: 1380, desc: '2 Zinger Burgers, 10 Hot Wings, 500 ml Soft Drink.', category: 'FRIED DEALS' }
    ],
    'PIZZA DEALS': [
      { id: 'pd1', name: 'Pizza Deal 1', price: 2350, desc: '1 Large Pizza, Large Fries, 1.5 Liter Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd2', name: 'Pizza Deal 2', price: 1930, desc: '1 Medium Pizza, Large Fries, 1 Liter Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd3', name: 'Pizza Deal 3', price: 1590, desc: '1 Small Pizza, Regular Fries, 500 ml Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd4', name: 'Pizza Deal 4', price: 4250, desc: '2 Large Pizzas, Large Fries, 1.5 Liter Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd5', name: 'Pizza Deal 5', price: 3550, desc: '2 Medium Pizzas, Large Fries, 1.5 Liter Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd6', name: 'Pizza Deal 6', price: 2900, desc: '2 Small Pizzas, Regular Fries, 1 Liter Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd7', name: 'Pizza Deal 7', price: 3690, desc: '1 Large Pizza, 1 Medium Pizza, 1.5 Liter Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd8', name: 'Pizza Deal 8', price: 3050, desc: '1 Medium Pizza, 1 Small Pizza, 1.5 Liter Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd9', name: 'Pizza Deal 9 (Pan)', price: 1360, desc: '2 Pan Pizzas, 500 ml Soft Drink.', category: 'PIZZA DEALS' },
      { id: 'pd10', name: 'Pizza Deal 10 (Pan)', price: 2650, desc: '4 Pan Pizzas, 1 Liter Soft Drink.', category: 'PIZZA DEALS' }
    ],
    'DONNER & SAVOUR': [
      { id: 'dd11', name: 'Donner Deal 11', price: 4650, desc: '2 Large Donners, 1.5 Liter Soft Drink.', category: 'DONNER & SAVOUR' },
      { id: 'dd12', name: 'Donner Deal 12', price: 4180, desc: '1 Large Donner, 1 Medium Donner, 1.5 Liter Soft Drink.', category: 'DONNER & SAVOUR' },
      { id: 'sd1', name: 'Savour Deal 1', price: 730, desc: '1 Pan Pizza, Regular Soft Drink.', category: 'DONNER & SAVOUR' },
      { id: 'sd2', name: 'Savour Deal 2', price: 1399, desc: '1 Small Pizza, 500 ml Soft Drink.', category: 'DONNER & SAVOUR' },
      { id: 'sd3', name: 'Savour Deal 3', price: 1740, desc: '1 Medium Pizza, 1 Liter Soft Drink.', category: 'DONNER & SAVOUR' }
    ],
    'BURGERS & WRAPS': [
      { id: 'b1', name: 'Zinger Burger', price: 400, desc: 'Crispy breast fillet with fresh lettuce and mayo in a warm bun.', category: 'BURGERS & WRAPS' },
      { id: 'b2', name: 'Fillet Thunder Burger', price: 400, desc: 'Spicy grilled fillet burger loaded with sauce.', category: 'BURGERS & WRAPS' },
      { id: 'b3', name: 'Lava Thunder Burger', price: 590, desc: 'Fiery cheese-dripping lava burger.', category: 'BURGERS & WRAPS' },
      { id: 'b4', name: 'Tower Sizzler Burger', price: 590, desc: 'Double layer burger stacked with crispy onion rings.', category: 'BURGERS & WRAPS' },
      { id: 'b5', name: 'Double Decker Burger', price: 600, desc: 'Two signature crispy patties with double cheese.', category: 'BURGERS & WRAPS' },
      { id: 'b6', name: 'Crispy Burger', price: 350, desc: 'Classic golden crispy chicken burger.', category: 'BURGERS & WRAPS' },
      { id: 'b7', name: 'Tikka Burger', price: 350, desc: 'Grilled chicken tikka patty with local spices.', category: 'BURGERS & WRAPS' },
      { id: 'w1', name: 'Arabic Wrap', price: 650, desc: 'Grilled chicken strips wrapped in tortilla.', category: 'BURGERS & WRAPS' },
      { id: 'w2', name: 'Arabic Mint Wrap', price: 650, desc: 'Wrap with mint-yogurt sauce and fresh greens.', category: 'BURGERS & WRAPS' },
      { id: 'w3', name: 'Arabic Grilled Wrap', price: 650, desc: 'Smokey charcoal grilled chicken wrap.', category: 'BURGERS & WRAPS' },
      { id: 'w4', name: 'Zinger Wrap', price: 490, desc: 'Crispy zinger chicken wrapped with signature sauces.', category: 'BURGERS & WRAPS' },
      { id: 'w5', name: 'Zinger Twister', price: 490, desc: 'Standard twister wrap filled with zinger chunks.', category: 'BURGERS & WRAPS' }
    ],
    'PIZZAS & DONNERS': [
      { id: 'p1', name: 'Classic Pizza (PP 8")', price: 650, desc: 'Available in Tikka, Fajita, Supreme, Smoke, Split Mama, Cheese or Vegi Lover.', category: 'PIZZAS & DONNERS' },
      { id: 'p2', name: 'Classic Pizza (Small 11")', price: 1250, desc: 'Classic pizza flavors: Tikka, Fajita, Supreme, Smoke, Split Mama.', category: 'PIZZAS & DONNERS' },
      { id: 'p3', name: 'Classic Pizza (Medium 13")', price: 1650, desc: 'Classic pizza flavors: Tikka, Fajita, Supreme, Smoke, Split Mama.', category: 'PIZZAS & DONNERS' },
      { id: 'p4', name: 'Classic Pizza (Large 15")', price: 1950, desc: 'Classic pizza flavors: Tikka, Fajita, Supreme, Smoke, Split Mama.', category: 'PIZZAS & DONNERS' },
      { id: 'sp1', name: 'Signature Pizza (PP 8")', price: 750, desc: 'Available in Shahi, Turkish, Tex Mex, Bone Fire, Malai Boti, Americano Heat.', category: 'PIZZAS & DONNERS' },
      { id: 'sp2', name: 'Signature Pizza (Small 11")', price: 1350, desc: 'Signature pizza flavors: Shahi, Turkish, Tex Mex, Bone Fire, Malai Boti.', category: 'PIZZAS & DONNERS' },
      { id: 'sp3', name: 'Signature Pizza (Medium 13")', price: 1650, desc: 'Signature pizza flavors: Shahi, Turkish, Tex Mex, Bone Fire, Malai Boti.', category: 'PIZZAS & DONNERS' },
      { id: 'sp4', name: 'Signature Pizza (Large 15")', price: 2050, desc: 'Signature pizza flavors: Shahi, Turkish, Tex Mex, Bone Fire, Malai Boti.', category: 'PIZZAS & DONNERS' },
      { id: 'tcp1', name: 'The Crust Pizza (Medium 13")', price: 1850, desc: 'Flavors: Stuff Crust, Crown Crust, Kebab Crust, Thin Crust, Stuff Cheese Crust.', category: 'PIZZAS & DONNERS' },
      { id: 'tcp2', name: 'The Crust Pizza (Large 15")', price: 2250, desc: 'Flavors: Stuff Crust, Crown Crust, Kebab Crust, Thin Crust, Stuff Cheese Crust.', category: 'PIZZAS & DONNERS' },
      { id: 'dn1', name: 'X Donner (Small 11")', price: 1450, desc: 'Flavors: Classic Donner, Turkish Donner, Malai Donner.', category: 'PIZZAS & DONNERS' },
      { id: 'dn2', name: 'X Donner (Medium 13")', price: 1850, desc: 'Flavors: Classic Donner, Turkish Donner, Malai Donner.', category: 'PIZZAS & DONNERS' },
      { id: 'dn3', name: 'X Donner (Large 15")', price: 2350, desc: 'Flavors: Classic Donner, Turkish Donner, Malai Donner.', category: 'PIZZAS & DONNERS' }
    ],
    'STARTERS & SIDES': [
      { id: 'st1', name: 'Chicken Cheese Pasta', price: 590, desc: 'Creamy pasta baked with chicken chunks and mozzarella.', category: 'STARTERS & SIDES' },
      { id: 'st2', name: 'Flaming Pasta', price: 590, desc: 'Spicy baked pasta with extra chili sauce.', category: 'STARTERS & SIDES' },
      { id: 'st3', name: 'Peri Wings (6 Pcs)', price: 390, desc: 'Tangy hot peri-peri grilled wings.', category: 'STARTERS & SIDES' },
      { id: 'st4', name: 'Peri Wings (12 Pcs)', price: 690, desc: 'Double serving of tangy hot peri-peri wings.', category: 'STARTERS & SIDES' },
      { id: 'st5', name: 'Oven Baked Wings (6 Pcs)', price: 350, desc: 'Baked wings glazed with sweet BBQ/garlic sauce.', category: 'STARTERS & SIDES' },
      { id: 'st6', name: 'Oven Baked Wings (12 Pcs)', price: 650, desc: 'Double serving of oven-baked glazed wings.', category: 'STARTERS & SIDES' },
      { id: 'st7', name: 'Nuggets (6 Pcs)', price: 310, desc: 'Golden tempura breaded chicken nuggets.', category: 'STARTERS & SIDES' },
      { id: 'st8', name: 'Nuggets (12 Pcs)', price: 590, desc: 'Double serving of golden nuggets.', category: 'STARTERS & SIDES' },
      { id: 'st9', name: '15 Pcs Hot Shots', price: 550, desc: 'Mini crunchy pop-style hot chicken shots.', category: 'STARTERS & SIDES' },
      { id: 'pl1', name: 'X Platter', price: 890, desc: '4 Pcs Spin Rolls, 6 Pcs Baked Wings, 1 Regular Fries, 1 Garlic Dip.', category: 'STARTERS & SIDES' },
      { id: 'f1', name: 'Large Fries', price: 350, desc: 'Golden salted French fries.', category: 'STARTERS & SIDES' },
      { id: 'f2', name: 'Loaded Fries', price: 590, desc: 'Fries topped with cheese sauce, minced chicken, and jalapeños.', category: 'STARTERS & SIDES' },
      { id: 'f3', name: 'Pizza Fries', price: 650, desc: 'Fries baked with pizza sauce, chicken tikka, and mozzarella.', category: 'STARTERS & SIDES' },
      { id: 'cs1', name: '1 Chicken Cheese Stick', price: 650, desc: 'Crunchy deep-fried breaded stick loaded with cheese.', category: 'STARTERS & SIDES' },
      { id: 'cs2', name: '2 Chicken Cheese Stick', price: 1199, desc: 'Double serving of crunchy chicken cheese stick.', category: 'STARTERS & SIDES' }
    ],
    'DRINKS & EXTRAS': [
      { id: 'dr1', name: 'Regular Soft Drink', price: 90, desc: 'Cold glass soft drink (Pepsi/Coke variants).', category: 'DRINKS & EXTRAS' },
      { id: 'dr2', name: 'Can (250 ml)', price: 120, desc: 'Chilled soft drink can.', category: 'DRINKS & EXTRAS' },
      { id: 'dr3', name: '500 ml Drink', price: 130, desc: 'Chilled 500 ml bottle.', category: 'DRINKS & EXTRAS' },
      { id: 'dr4', name: '1 Liter Drink', price: 180, desc: 'Chilled 1 Liter bottle.', category: 'DRINKS & EXTRAS' },
      { id: 'dr5', name: '1.5 Liter Drink', price: 230, desc: 'Chilled 1.5 Liter bottle.', category: 'DRINKS & EXTRAS' },
      { id: 'dr6', name: 'Water (Small)', price: 80, desc: 'Chilled mineral water.', category: 'DRINKS & EXTRAS' },
      { id: 'dr7', name: 'Water (Large)', price: 130, desc: 'Chilled large mineral water.', category: 'DRINKS & EXTRAS' },
      { id: 'dr8', name: 'Nestle Juice', price: 110, desc: 'Tetra-pack Nestle juice.', category: 'DRINKS & EXTRAS' },
      { id: 'dip1', name: 'Garlic Dip', price: 100, desc: 'Signature house garlic dip.', category: 'DRINKS & EXTRAS' },
      { id: 'dip2', name: 'Special Dip', price: 100, desc: 'Spicy house special mayo dip.', category: 'DRINKS & EXTRAS' },
      { id: 'dip3', name: 'Shahi Dip', price: 100, desc: 'Rich local flavor herbs dip.', category: 'DRINKS & EXTRAS' },
      { id: 'dip4', name: 'Tex Mex Dip', price: 100, desc: 'Tangy southwest salsa dip.', category: 'DRINKS & EXTRAS' }
    ]
  };

  // Compile base items and dynamically append FOH custom items in real-time
  const getMergedMenuData = () => {
    const merged = JSON.parse(JSON.stringify(baseMenuData));
    customItems.forEach(item => {
      if (merged[item.category]) {
        // Avoid duplications
        if (!merged[item.category].find(i => i.id === item.id)) {
          merged[item.category].push(item);
        }
      } else {
        merged[item.category] = [item];
      }
    });
    return merged;
  };

  const activeMenuData = getMergedMenuData();

  // Category list with clean UI icons
  const categoriesList = [
    { key: 'FRIED DEALS', label: 'Fried Deals', icon: '🍗' },
    { key: 'PIZZA DEALS', label: 'Pizza Deals', icon: '🍕' },
    { key: 'DONNER & SAVOUR', label: 'Donners & Savour', icon: '🌯' },
    { key: 'BURGERS & WRAPS', label: 'Burgers & Wraps', icon: '🍔' },
    { key: 'PIZZAS & DONNERS', label: 'Pizzas & Donners', icon: '🍕' },
    { key: 'STARTERS & SIDES', label: 'Starters & Sides', icon: '🍟' },
    { key: 'DRINKS & EXTRAS', label: 'Drinks & Extras', icon: '🥤' }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter items logic
  const getFilteredItems = () => {
    let items = [];
    const isSearching = searchQuery.trim() !== '';

    if (isSearching) {
      Object.entries(activeMenuData).forEach(([cat, list]) => {
        list.forEach(item => {
          if (
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
          ) {
            items.push({ ...item, category: cat });
          }
        });
      });
    } else {
      if (activeMenuData[activeCategory]) {
        activeMenuData[activeCategory].forEach(item => {
          items.push({ ...item, category: activeCategory });
        });
      }
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="py-16 sm:py-24 relative min-h-screen">
      {/* Background glow depth spots */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-light-green/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-15%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-medium-jungle/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white">
            XYNER <span className="text-light-green">Menu</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Savor the flavors you love. Select a category below to browse items cleanly without visual clutter.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative max-w-md mx-auto mb-12">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search Zinger, Pizza, Dips..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-11 pr-4 py-3.5 rounded-full bg-black/40 border border-light-green/10 focus:border-light-green focus:ring-1 focus:ring-light-green focus:outline-none text-[#f3f4f6] placeholder-gray-500 text-sm transition-all"
          />
        </div>

        {/* Categories Selector Layout: Non-hectic presentation */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left/Top Category Navigation Panel */}
          {searchQuery.trim() === '' ? (
            <div className="w-full lg:w-1/4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 border-b lg:border-b-0 lg:border-r border-light-green/10 pr-0 lg:pr-6 scrollbar-hide">
              {categoriesList.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 w-auto lg:w-full flex-shrink-0 text-left ${
                      isActive
                        ? 'bg-light-green text-black-forest shadow-lg shadow-light-green/10 transform scale-[1.02]'
                        : 'bg-black/30 border border-light-green/5 text-gray-300 hover:border-light-green/20'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Right/Bottom Filtered Items Grid */}
          <div className={`w-full ${searchQuery.trim() === '' ? 'lg:w-3/4' : 'w-full'} space-y-6`}>
            
            {/* Context Heading */}
            <div className="flex items-center justify-between border-b border-light-green/5 pb-4">
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                {searchQuery.trim() !== '' ? (
                  <>
                    <Eye size={20} className="text-light-green" />
                    Search Results ({filteredItems.length} items found)
                  </>
                ) : (
                  <>
                    <span className="text-2xl">
                      {categoriesList.find(c => c.key === activeCategory)?.icon}
                    </span>
                    {categoriesList.find(c => c.key === activeCategory)?.label}
                  </>
                )}
              </h2>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <SpotlightCard 
                    key={item.id} 
                    className="card-gradient p-6 rounded-3xl flex flex-col justify-between space-y-6 group transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-light-green/10 text-light-green text-[9px] font-bold tracking-wider uppercase border border-light-green/20">
                          {item.category || activeCategory}
                        </span>
                        <span className="text-xl font-serif font-black text-light-green">
                          Rs. {item.price}/-
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white group-hover:text-light-green transition-colors duration-300">
                        {item.name}
                      </h3>
                      
                      {item.desc && (
                        <p className="text-xs text-gray-400 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-light-green text-black-forest font-semibold text-xs btn-glow"
                      >
                        <ShoppingBag size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 card-gradient rounded-3xl space-y-4">
                <HelpCircle className="mx-auto text-gray-600" size={48} />
                <p className="text-gray-400 text-sm">No items found matching your query.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('FRIED DEALS'); }}
                  className="text-light-green text-xs font-semibold hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
