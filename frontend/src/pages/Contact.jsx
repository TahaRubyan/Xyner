import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Phone, MapPin, Clock as ClockIcon, MessageSquare, CheckCircle, ShoppingCart, Truck, UtensilsCrossed, Sparkles, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#96e072',
    },
    background: {
      default: '#0a1c11',
      paper: '#050e09',
    },
  },
});

export default function Contact() {
  const { cart, getCartTotal, clearCart } = useCart();
  const [checkoutType, setCheckoutType] = useState('delivery'); // 'delivery' | 'preorder'
  const [activeMapTab, setActiveMapTab] = useState('indoor'); // 'indoor' | 'outdoor'
  const [selectedTable, setSelectedTable] = useState(null); // { id, name, capacity, type }

  // Playful alternative recommendation states
  const [showRecModal, setShowRecModal] = useState(false);
  const [attemptedTable, setAttemptedTable] = useState(null);
  const [suggestedTable, setSuggestedTable] = useState(null);

  // Custom Calendar picker states
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDateStr, setSelectedDateStr] = useState('');

  // Custom Digital Clock time picker states
  const [timeValue, setTimeValue] = useState(() => dayjs().hour(20).minute(0));

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '08:00 PM',
    guests: '2',
    paymentMethod: 'COD',
    notes: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Dynamic table occupancy database loaded from localStorage to sync FOH open/booked toggles
  const [tableOccupancy, setTableOccupancy] = useState(() => {
    const saved = localStorage.getItem('xyner_table_occupancy');
    return saved ? JSON.parse(saved) : {
      'I-1': false, 'I-2': true, 'I-3': false, 'I-4': false, 'I-5': false, 'I-6': true,
      'O-1': false, 'O-2': false, 'O-3': false, 'O-4': true, 'O-5': false, 'O-6': false,
      'O-7': false, 'O-8': false, 'O-9': true, 'O-10': false, 'O-11': false
    };
  });

  // Keep tableOccupancy updated in real-time
  useEffect(() => {
    const checkOccupancy = () => {
      const saved = localStorage.getItem('xyner_table_occupancy');
      if (saved) {
        setTableOccupancy(JSON.parse(saved));
      }
    };
    checkOccupancy();
    const interval = setInterval(checkOccupancy, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTimeChange = (newValue) => {
    if (newValue) {
      setTimeValue(newValue);
      setFormData(prev => ({ ...prev, time: newValue.format('hh:mm A') }));
    }
  };

  const indoorTables = [
    { id: 'I-1', name: 'Table I-1', capacity: 2, type: 'round', booked: tableOccupancy['I-1'] },
    { id: 'I-2', name: 'Table I-2', capacity: 4, type: 'square', booked: tableOccupancy['I-2'] },
    { id: 'I-3', name: 'Table I-3', capacity: 6, type: 'rectangle', booked: tableOccupancy['I-3'] },
    { id: 'I-4', name: 'Table I-4', capacity: 4, type: 'square', booked: tableOccupancy['I-4'] },
    { id: 'I-5', name: 'Table I-5', capacity: 2, type: 'round', booked: tableOccupancy['I-5'] },
    { id: 'I-6', name: 'Table I-6', capacity: 8, type: 'rectangle', booked: tableOccupancy['I-6'] }
  ];

  const outdoorTables = [
    { id: 'O-1', name: 'Table O-1', capacity: 4, type: 'round', booked: tableOccupancy['O-1'] },
    { id: 'O-2', name: 'Table O-2', capacity: 2, type: 'round', booked: tableOccupancy['O-2'] },
    { id: 'O-3', name: 'Table O-3', capacity: 4, type: 'square', booked: tableOccupancy['O-3'] },
    { id: 'O-4', name: 'Table O-4', capacity: 6, type: 'rectangle', booked: tableOccupancy['O-4'] },
    { id: 'O-5', name: 'Table O-5', capacity: 4, type: 'square', booked: tableOccupancy['O-5'] },
    { id: 'O-6', name: 'Table O-6', capacity: 2, type: 'round', booked: tableOccupancy['O-6'] },
    { id: 'O-7', name: 'Table O-7', capacity: 4, type: 'round', booked: tableOccupancy['O-7'] },
    { id: 'O-8', name: 'Table O-8', capacity: 8, type: 'rectangle', booked: tableOccupancy['O-8'] },
    { id: 'O-9', name: 'Table O-9', capacity: 4, type: 'square', booked: tableOccupancy['O-9'] },
    { id: 'O-10', name: 'Table O-10', capacity: 2, type: 'round', booked: tableOccupancy['O-10'] },
    { id: 'O-11', name: 'Table O-11', capacity: 4, type: 'round', booked: tableOccupancy['O-11'] }
  ];

  const currentTablesList = activeMapTab === 'indoor' ? indoorTables : outdoorTables;

  const handleTableClick = (table) => {
    if (table.booked) {
      const alt = currentTablesList.find(t => !t.booked && t.capacity >= table.capacity);
      setAttemptedTable(table);
      setSuggestedTable(alt || null);
      setShowRecModal(true);
      return;
    }
    
    setSelectedTable(table);
    setFormData(prev => ({ ...prev, guests: String(table.capacity) }));
  };

  const acceptSuggestion = () => {
    if (suggestedTable) {
      setSelectedTable(suggestedTable);
      setFormData(prev => ({ ...prev, guests: String(suggestedTable.capacity) }));
    }
    setShowRecModal(false);
  };

  // Calendar generation helpers
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  const handleSelectDay = (day) => {
    const formattedMonth = String(calendarMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dStr = `${calendarYear}-${formattedMonth}-${formattedDay}`;
    setSelectedDateStr(dStr);
    setFormData(prev => ({ ...prev, date: dStr }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isCartActive = cart.length > 0;
    const token = isCartActive 
      ? `XY-ORD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : `XY-RES-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    let details = {};

    if (isCartActive) {
      details = {
        id: `ord_${Math.random()}`,
        order_token: token,
        customer_name: formData.name,
        phone_number: formData.phone,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        })),
        total_amount: getCartTotal(),
        address: checkoutType === 'delivery' ? formData.address : `Dine-In Pre-Order (Table: ${selectedTable ? selectedTable.name : 'Unassigned'})`,
        payment_method: formData.paymentMethod,
        screenshot_url: '',
        status: 'pending_verification',
        created_at: new Date().toISOString(),
        checkout_type: checkoutType,
        date: formData.date || '',
        time: formData.time || '',
        guests: formData.guests || '',
        selected_table: selectedTable ? selectedTable.name : 'None'
      };

      // Save to local storage for Dashboard link
      const existingOrders = localStorage.getItem('xyner_all_orders')
        ? JSON.parse(localStorage.getItem('xyner_all_orders'))
        : [];
      localStorage.setItem('xyner_all_orders', JSON.stringify([details, ...existingOrders]));

      setOrderDetails(details);
      clearCart();
    } else {
      details = {
        id: `res_${Math.random()}`,
        booking_token: token,
        customer_name: formData.name,
        phone_number: formData.phone,
        booking_date: formData.date,
        booking_time: formData.time,
        guest_count: parseInt(formData.guests),
        notes: formData.notes,
        status: 'pending', // Pending cashier WhatsApp confirmation
        created_at: new Date().toISOString(),
        selected_table: selectedTable ? selectedTable.name : 'Unassigned'
      };

      // If booking table, mark table status as booked in client local state
      if (selectedTable) {
        const nextOccupancy = { ...tableOccupancy, [selectedTable.id]: true };
        localStorage.setItem('xyner_table_occupancy', JSON.stringify(nextOccupancy));
        setTableOccupancy(nextOccupancy);
      }

      const existingReservations = localStorage.getItem('xyner_all_reservations')
        ? JSON.parse(localStorage.getItem('xyner_all_reservations'))
        : [];
      localStorage.setItem('xyner_all_reservations', JSON.stringify([details, ...existingReservations]));

      setOrderDetails(details);
    }

    setFormData({
      name: '',
      phone: '',
      address: '',
      date: '',
      time: '08:00 PM',
      guests: '2',
      paymentMethod: 'COD',
      notes: ''
    });
    setSelectedTable(null);
    setTimeValue(dayjs().hour(20).minute(0));
    setSelectedDateStr('');
    clearCart();

    setSubmitted(true);
  };

  const renderSeatDots = (capacity) => {
    const dots = [];
    for (let i = 0; i < capacity; i++) {
      dots.push(
        <span 
          key={i} 
          className="w-1.5 h-1.5 rounded-full bg-light-green/45 border border-light-green/20"
        />
      );
    }
    return (
      <div className="flex flex-wrap items-center justify-center gap-0.5 mt-1 max-w-[40px]">
        {dots}
      </div>
    );
  };

  // Generate blank blocks before month start
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-8"></div>);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedMonth = String(calendarMonth + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    const cellDateStr = `${calendarYear}-${formattedMonth}-${formattedDay}`;
    const isSelected = selectedDateStr === cellDateStr;
    calendarCells.push(
      <button
        key={`day-${d}`}
        type="button"
        onClick={() => handleSelectDay(d)}
        className={`h-8 w-8 text-xs font-bold rounded-full transition-all flex items-center justify-center ${
          isSelected 
            ? 'bg-light-green text-black-forest shadow-[0_0_12px_rgba(150,224,114,0.45)]' 
            : 'text-gray-300 hover:bg-light-green/10 hover:text-light-green'
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="py-16 sm:py-24 relative min-h-screen">
      {/* Background glow spots */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-light-green/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-15%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-medium-jungle/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white">
            Checkout & <span className="text-light-green">Reservations</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Complete your order, book a premium dining table, or coordinate with our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Branch Details & Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-black text-white">
              XYNER Jalalpur Jattan
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Drop by and enjoy our cozy dine-in experience or call us to check seating availability. Our staff is ready to serve you.
            </p>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-light-green/10 text-light-green flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-white text-lg">Location</h4>
                  <p className="text-sm text-gray-300">New Sialkot Road, Jalalpur Jattan, Pakistan</p>
                </div>
              </div>

              {/* Contact Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-light-green/10 text-light-green flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-white text-lg">Phone Number</h4>
                  <p className="text-sm text-gray-300">(03) 111 373 333</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-light-green/10 text-light-green flex-shrink-0">
                  <ClockIcon size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-white text-lg">Operating Hours</h4>
                  <p className="text-sm text-gray-300">12:00 PM - 12:00 AM (Monday to Sunday)</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="card-gradient p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-serif font-bold text-light-green">
                Looking for instant food delivery?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Send a quick text or voice note directly to our AI agent. Your order will be calculated and dispatched in no time.
              </p>
              <a
                href="https://wa.me/923111373333"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-light-green text-black-forest font-bold text-sm hover:bg-frosted-mint transition-all"
              >
                <MessageSquare size={16} />
                Order via WhatsApp AI Bot
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Form depending on Cart state */}
          <div className="card-gradient p-8 sm:p-10 rounded-3xl">
            {submitted ? (
              <div className="text-center py-10 space-y-6">
                <div className="flex justify-center text-light-green">
                  <CheckCircle size={64} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">Submitted Successfully!</h3>
                
                {orderDetails && (
                  <div className="space-y-4 text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                    <p>
                      Your token reference is <span className="text-light-green font-black">{orderDetails.order_token || orderDetails.booking_token}</span>
                    </p>
                    {orderDetails.selected_table && orderDetails.selected_table !== 'None' && (
                      <p>
                        Selected Seating Table: <span className="text-light-green font-bold">{orderDetails.selected_table}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 bg-black/40 border border-light-green/10 rounded-2xl p-4 mt-2">
                      Your order has been directly submitted to the Cashier Dashboard. Our FOH cashier will review it and initiate a confirmation text via WhatsApp shortly!
                    </p>
                  </div>
                )}
                
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => { setSubmitted(false); setOrderDetails(null); setSelectedTable(null); }}
                    className="px-8 py-3 rounded-full bg-light-green text-black-forest font-bold text-xs btn-glow"
                  >
                    Done (Go Back)
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cart summary if items are present */}
                {cart.length > 0 ? (
                  <div className="border border-light-green/20 rounded-2xl p-5 bg-black/40 space-y-4">
                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-light-green/5 pb-2">
                      <ShoppingCart size={18} className="text-light-green" />
                      Checkout Summary
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-300 max-h-36 overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-semibold text-light-green">Rs. {item.price * item.quantity}/-</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between text-sm font-serif font-black text-white pt-2 border-t border-light-green/5">
                      <span>Total Amount</span>
                      <span className="text-light-green">Rs. {getCartTotal()}/-</span>
                    </div>

                    {/* Delivery / Pre-Order Toggle tabs */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutType('delivery')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          checkoutType === 'delivery'
                            ? 'bg-light-green text-black-forest shadow-md'
                            : 'bg-black/30 text-gray-400 hover:text-white border border-light-green/5'
                        }`}
                      >
                        <Truck size={14} />
                        Home Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutType('preorder')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          checkoutType === 'preorder'
                            ? 'bg-light-green text-black-forest shadow-md'
                            : 'bg-black/30 text-gray-400 hover:text-white border border-light-green/5'
                        }`}
                      >
                        <UtensilsCrossed size={14} />
                        Pre-Order Dine-in
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3 className="text-2xl font-serif font-bold text-white border-b border-light-green/5 pb-2">
                    Book A Table
                  </h3>
                )}

                {/* Shared User details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ahmad"
                      className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 03001234567"
                      className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Seating Map block: Renders if Booking table OR Pre-ordering dine-in food */}
                {(cart.length === 0 || (cart.length > 0 && checkoutType === 'preorder')) && (
                  <div className="border border-light-green/15 rounded-2xl p-5 bg-black/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-light-green/5 pb-2">
                      <h4 className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                        <Sparkles size={16} className="text-light-green" />
                        Select a Table on Map
                      </h4>
                      {/* Indoor / Outdoor Toggle buttons */}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveMapTab('indoor')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            activeMapTab === 'indoor'
                              ? 'bg-light-green/20 text-light-green border border-light-green/30'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Indoor (6)
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveMapTab('outdoor')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            activeMapTab === 'outdoor'
                              ? 'bg-light-green/20 text-light-green border border-light-green/30'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Outdoor (11)
                        </button>
                      </div>
                    </div>

                    {/* Table Map Grid with Rich Hover states */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-2">
                      {currentTablesList.map((table) => {
                        const isSelected = selectedTable && selectedTable.id === table.id;
                        return (
                          <button
                            key={table.id}
                            type="button"
                            onClick={() => handleTableClick(table)}
                            className={`relative flex flex-col items-center justify-center p-3 h-20 transition-all duration-300 ${
                              table.booked 
                                ? 'bg-gray-800/10 border border-gray-800 text-gray-500 opacity-60 cursor-not-allowed' 
                                : isSelected
                                ? 'bg-light-green text-black-forest font-bold rounded-2xl shadow-lg border-2 border-white scale-105 shadow-light-green/25'
                                : 'bg-black/40 border border-light-green/15 text-gray-300 hover:border-light-green hover:bg-light-green/10 hover:shadow-[0_0_12px_rgba(150,224,114,0.3)] hover:scale-105'
                            } ${
                              table.type === 'round' 
                                ? 'rounded-full' 
                                : table.type === 'square' 
                                ? 'rounded-xl' 
                                : 'rounded-2xl w-full'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-black">{table.name}</span>
                            <span className="text-[9px] opacity-75">{table.capacity} Seats</span>
                            
                            {/* Render small graphical seat dots */}
                            {!table.booked && !isSelected && renderSeatDots(table.capacity)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Display selection summary details */}
                    <div className="text-center bg-[#070a07]/50 rounded-xl p-3 border border-light-green/5 text-xs">
                      {selectedTable ? (
                        <p className="text-gray-300">
                          Selected Seating: <span className="text-light-green font-bold">{activeMapTab === 'indoor' ? 'Indoor' : 'Outdoor'} {selectedTable.name}</span> ({selectedTable.capacity} Seats)
                        </p>
                      ) : (
                        <p className="text-red-400 animate-pulse">
                          Please select a table on the map to complete your booking.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Date & Time Selectors for dine-in / table booking */}
                {(cart.length === 0 || (cart.length > 0 && checkoutType === 'preorder')) ? (
                  <div className="space-y-6 border border-light-green/10 rounded-2xl p-5 bg-black/20">
                    
                    {/* Custom Calendar Date Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-1">
                        <CalendarIcon size={14} className="text-light-green" />
                        Select Date
                      </label>
                      
                      <div className="bg-black/40 border border-light-green/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <button type="button" onClick={handlePrevMonth} className="p-1 hover:text-light-green">
                            <ChevronLeft size={16} />
                          </button>
                          <span className="text-xs font-bold text-white">
                            {monthNames[calendarMonth]} {calendarYear}
                          </span>
                          <button type="button" onClick={handleNextMonth} className="p-1 hover:text-light-green">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-500 font-bold border-b border-light-green/5 pb-1">
                          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {calendarCells}
                        </div>
                      </div>
                      {formData.date ? (
                        <p className="text-xs text-light-green">Selected: <b>{formData.date}</b></p>
                      ) : (
                        <p className="text-xs text-red-400">Please choose a date from the calendar above.</p>
                      )}
                    </div>

                    {/* Material UI StaticTimePicker Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-1">
                        <ClockIcon size={14} className="text-light-green" />
                        Select Seating Time
                      </label>
                      <div className="bg-black/40 border border-light-green/10 rounded-2xl overflow-hidden p-2">
                        <ThemeProvider theme={darkTheme}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StaticTimePicker 
                              orientation="landscape"
                              value={timeValue}
                              onChange={handleTimeChange}
                              slotProps={{
                                actionBar: { actions: [] }
                              }}
                              sx={{
                                '& .MuiDialogActions-root': { display: 'none' },
                                '& .MuiPickersLayout-root': { background: 'transparent' },
                                '& .MuiPickersLayout-contentWrapper': { background: 'transparent' },
                                '& .MuiTimePickerToolbar-timeDigitsContainer': { color: '#ffffff' }
                              }}
                            />
                          </LocalizationProvider>
                        </ThemeProvider>
                      </div>
                      <p className="text-xs text-light-green">Selected Time: <b>{formData.time}</b></p>
                    </div>

                  </div>
                ) : (
                  /* Address block for delivery checkout */
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Delivery Address</label>
                    <textarea
                      rows="2"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. House 4, Street 1, Mohallah Khepran, Jalalpur Jattan"
                      className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm placeholder-gray-500 resize-none"
                    />
                  </div>
                )}

                {/* Payment Selection for E-Commerce Cart Checkout */}
                {cart.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm select-dark"
                    >
                      {checkoutType === 'delivery' ? (
                        <>
                          <option value="COD">Cash on Delivery (COD)</option>
                          <option value="EasyPaisa">EasyPaisa Mobile Banking</option>
                          <option value="JazzCash">JazzCash Mobile Banking</option>
                        </>
                      ) : (
                        <>
                          <option value="Counter">Pay at Counter (Dine-in / Takeaway)</option>
                          <option value="EasyPaisa">EasyPaisa Mobile Banking</option>
                          <option value="JazzCash">JazzCash Mobile Banking</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Special Instructions (Optional)</label>
                  <textarea
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Extra ketchup, birthday decor, window seat..."
                    className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm placeholder-gray-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    (!formData.date && (cart.length === 0 || (cart.length > 0 && checkoutType === 'preorder'))) || 
                    ((cart.length === 0 || (cart.length > 0 && checkoutType === 'preorder')) && !selectedTable)
                  }
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-full bg-light-green text-black-forest font-bold hover:bg-frosted-mint transition-all btn-glow shadow-md ${
                    ((!formData.date && (cart.length === 0 || (cart.length > 0 && checkoutType === 'preorder'))) || 
                    ((cart.length === 0 || (cart.length > 0 && checkoutType === 'preorder')) && !selectedTable))
                      ? 'opacity-55 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <CalendarIcon size={18} />
                  {cart.length > 0 ? 'Place Order & Confirm' : 'Request Table Booking'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Playful Alternative Recommendation Modal */}
      {showRecModal && attemptedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="card-gradient max-w-md w-full p-8 rounded-[32px] border border-light-green/20 bg-black-forest/90 relative text-center space-y-6">
            <button
              onClick={() => setShowRecModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="p-3 rounded-full bg-light-green/10 text-light-green inline-block mx-auto animate-pulse">
              <Sparkles size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-black text-white">Table Occupied!</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Hey friend, <span className="text-light-green font-bold">{attemptedTable.name}</span> is currently reserved for this shift.
              </p>
            </div>

            {suggestedTable ? (
              <div className="bg-black/40 border border-light-green/10 rounded-2xl p-5 space-y-3">
                <p className="text-xs text-gray-300 leading-relaxed">
                  But check this out! We highly recommend <span className="text-light-green font-black">{suggestedTable.name} ({suggestedTable.capacity} Seats)</span>. It has a cozier layout and a much better view of the cafe!
                </p>
                <button
                  type="button"
                  onClick={acceptSuggestion}
                  className="w-full py-2.5 rounded-xl bg-light-green text-black-forest font-bold text-xs btn-glow"
                >
                  Book Recommended Table ({suggestedTable.name})
                </button>
              </div>
            ) : (
              <p className="text-xs text-red-400">
                Unfortunately, all tables in this section are currently reserved. Please check the other section (Indoor/Outdoor) for availability.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowRecModal(false)}
              className="text-xs text-gray-400 hover:text-light-green"
            >
              Close & Keep Exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
