import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Check, X, ShieldAlert, BadgeInfo, Bell, Settings, Power, Volume2, UserPlus, KeyRound, Printer, Plus, LayoutDashboard, PlusCircle, Unlock, Utensils, Sparkles, RefreshCw, MessageSquare, History } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import { useCart } from '../context/CartContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
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

// Standard Seed Data for initial cashier dashboard
const MOCK_ORDERS = [
  {
    id: 'ord1',
    order_token: 'XY-ORD-9A2X',
    customer_name: 'Usman Ghani',
    phone_number: '03001234567',
    items: [
      { name: 'Zinger Burger', quantity: 2, unit_price: 400, subtotal: 800 },
      { name: 'Large Fries', quantity: 1, unit_price: 350, subtotal: 350 },
      { name: '1.5 Ltr Drink', quantity: 1, unit_price: 230, subtotal: 230 }
    ],
    total_amount: 1380,
    address: 'Gali 3, Model Town, Jalalpur Jattan',
    payment_method: 'EasyPaisa',
    screenshot_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=300',
    status: 'pending_verification',
    created_at: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'ord2',
    order_token: 'XY-ORD-F3K1',
    customer_name: 'Sobia Ahmad',
    phone_number: '03217654321',
    items: [
      { name: 'Chicken Tikka Pizza M', quantity: 1, unit_price: 1650, subtotal: 1650 },
      { name: 'Peri Wings 6 Pcs', quantity: 1, unit_price: 390, subtotal: 390 }
    ],
    total_amount: 2040,
    address: 'Mohallah Khepran, Jalalpur Jattan',
    payment_method: 'COD',
    screenshot_url: '',
    status: 'preparing',
    created_at: new Date(Date.now() - 15 * 60000).toISOString()
  }
];

const MOCK_RESERVATIONS = [
  {
    id: 'res1',
    booking_token: 'XY-RES-F42D',
    customer_name: 'Dr. Faisal',
    phone_number: '03123456789',
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: '20:30',
    guest_count: 4,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    selected_table: 'Table I-3'
  },
  {
    id: 'res2',
    booking_token: 'XY-RES-A82K',
    customer_name: 'Zainab Bibi',
    phone_number: '03338889991',
    booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    booking_time: '14:00',
    guest_count: 2,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    selected_table: 'Table O-2'
  }
];

// Pre-seeded cashier credentials database
const MOCK_USERS = [
  { username: 'admin', password: 'admin123', securityAnswer: 'green' }
];

const DEFAULT_OCCUPANCY = {
  'I-1': false, 'I-2': true, 'I-3': false, 'I-4': false, 'I-5': false, 'I-6': true,
  'O-1': false, 'O-2': false, 'O-3': false, 'O-4': true, 'O-5': false, 'O-6': false,
  'O-7': false, 'O-8': false, 'O-9': true, 'O-10': false, 'O-11': false
};

// Safe JSON parser helper to prevent corrupt local storage crashes
const safeParse = (key, fallback, storageType = 'local') => {
  try {
    const storage = storageType === 'session' ? sessionStorage : localStorage;
    const saved = storage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    
    // Validate types matching fallbacks
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) {
      if (typeof parsed !== 'object' || Array.isArray(parsed) || !parsed) return fallback;
    }
    return parsed;
  } catch (e) {
    console.error(`Error parsing storage key "${key}":`, e);
    return fallback;
  }
};

export default function Dashboard() {
  // Authentication & Cashier sessions state
  const [currentUser, setCurrentUser] = useState(() => safeParse('xyner_active_cashier', null, 'session'));
  const [usersDb, setUsersDb] = useState(() => safeParse('xyner_users', MOCK_USERS));

  useEffect(() => {
    localStorage.setItem('xyner_users', JSON.stringify(usersDb));
  }, [usersDb]);

  // Login inputs state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Add User Drawer state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSecAnswer, setNewSecAnswer] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Forget password wizard state
  const [showForgetModal, setShowForgetModal] = useState(false);
  const [forgetUsername, setForgetUsername] = useState('');
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [forgetStep, setForgetStep] = useState(1); 
  const [forgetError, setForgetError] = useState('');

  // Core order and reservation lists
  const [orders, setOrders] = useState(() => safeParse('xyner_all_orders', MOCK_ORDERS));
  const [reservations, setReservations] = useState(() => safeParse('xyner_all_reservations', MOCK_RESERVATIONS));

  useEffect(() => {
    localStorage.setItem('xyner_all_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('xyner_all_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Seating tables layout occupied state mapping
  const [tableOccupancy, setTableOccupancy] = useState(() => safeParse('xyner_table_occupancy', DEFAULT_OCCUPANCY));

  useEffect(() => {
    localStorage.setItem('xyner_table_occupancy', JSON.stringify(tableOccupancy));
  }, [tableOccupancy]);

  // Menu Creation Drawer states
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCat, setNewItemCat] = useState('FRIED DEALS');
  const [newItemImage, setNewItemImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400');

  // Receipt Printing modal states
  const [printReceiptOrder, setPrintReceiptOrder] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Real-time Incoming Order / Reservation Alert popup states
  const [activeNewOrderPopup, setActiveNewOrderPopup] = useState(null);
  const [activeNewResPopup, setActiveNewResPopup] = useState(null);

  // Rejection reasons modal states
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('The kitchen is closed');
  const [customReason, setCustomReason] = useState('');

  const handleRejectAction = (e) => {
    e.preventDefault();
    if (!rejectingItem) return;
    
    const finalReason = rejectionReason === 'custom' ? customReason : rejectionReason;
    
    if (rejectingItem.type === 'order') {
      updateOrderStatus(rejectingItem.id, 'cancelled');
      const text = `Hi ${rejectingItem.name}, we are sorry to inform you that your order (${rejectingItem.token}) at XYNER was cancelled because: ${finalReason}. We apologize for the inconvenience!`;
      window.open(`https://wa.me/${rejectingItem.phone}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      updateReservationStatus(rejectingItem.id, 'cancelled');
      const text = `Hi ${rejectingItem.name}, we are sorry to inform you that your table reservation (${rejectingItem.token}) at XYNER was declined because: ${finalReason}. We apologize for the inconvenience!`;
      window.open(`https://wa.me/${rejectingItem.phone}?text=${encodeURIComponent(text)}`, '_blank');
    }

    setRejectingItem(null);
    setCustomReason('');
    setRejectionReason('The kitchen is closed');
  };

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'tables' | 'history'
  const [notificationSound, setNotificationSound] = useState(true);
  const [historyFilterDate, setHistoryFilterDate] = useState('');
  const [historyFilterTime, setHistoryFilterTime] = useState('');
  const [historyDateVal, setHistoryDateVal] = useState(null);
  const [historyTimeVal, setHistoryTimeVal] = useState(null);

  const handleHistoryDateChange = (newValue) => {
    setHistoryDateVal(newValue);
    setHistoryFilterDate(newValue ? newValue.format('YYYY-MM-DD') : '');
  };

  const handleHistoryTimeChange = (newValue) => {
    setHistoryTimeVal(newValue);
    setHistoryFilterTime(newValue ? newValue.format('HH:mm') : '');
  };

  const clearHistoryFilters = () => {
    setHistoryFilterDate('');
    setHistoryFilterTime('');
    setHistoryDateVal(null);
    setHistoryTimeVal(null);
  };

  const convert24to12 = (time24) => {
    if (!time24) return '';
    const [hourStr, minStr] = time24.split(':');
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const formattedHour = String(hour12).padStart(2, '0');
    return `${formattedHour}:${minStr} ${period}`;
  };

  // Resume Web Audio Context to bypass browser auto-play policies
  const enableAudioContext = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const tempCtx = new AudioContextClass();
        if (tempCtx.state === 'suspended') {
          tempCtx.resume();
        }
      }
    } catch (e) {
      console.log('Error activating AudioContext:', e);
    }
  };

  // Pre-activate AudioContext on mount via global document click
  useEffect(() => {
    const handleDocClick = () => {
      enableAudioContext();
    };
    window.addEventListener('click', handleDocClick);
    return () => window.removeEventListener('click', handleDocClick);
  }, []);

  // Bell ring oscillator alert for mock arrivals
  const triggerAudioAlert = () => {
    if (!notificationSound) return;
    try {
      enableAudioContext();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.log('Audio Alert failed:', e);
    }
  };

  // Real-time storage syncing listener + polling (every 2 seconds) to sync orders & reservations placed by users immediately
  useEffect(() => {
    const syncLocalStorage = () => {
      const latestOrders = safeParse('xyner_all_orders', MOCK_ORDERS);
      const latestRes = safeParse('xyner_all_reservations', MOCK_RESERVATIONS);
      const latestOccupancy = safeParse('xyner_table_occupancy', DEFAULT_OCCUPANCY);

      // 1. Detect new incoming orders (triggers popup & audio alert)
      if (Array.isArray(orders) && Array.isArray(latestOrders) && latestOrders.length > orders.length) {
        const freshOrder = latestOrders.find(lo => 
          lo.status === 'pending_verification' && 
          !orders.some(o => o.id === lo.id)
        );
        if (freshOrder) {
          setActiveNewOrderPopup(freshOrder);
          triggerAudioAlert();
        }
      }

      // 2. Detect new incoming table reservations (triggers popup & audio alert)
      if (Array.isArray(reservations) && Array.isArray(latestRes) && latestRes.length > reservations.length) {
        const freshRes = latestRes.find(lr => 
          lr.status === 'pending' &&
          !reservations.some(r => r.id === lr.id)
        );
        if (freshRes) {
          setActiveNewResPopup(freshRes);
          triggerAudioAlert();
        }
      }

      // Sync state if localStorage changed
      if (JSON.stringify(latestOrders) !== JSON.stringify(orders)) {
        setOrders(latestOrders);
      }
      if (JSON.stringify(latestRes) !== JSON.stringify(reservations)) {
        setReservations(latestRes);
      }
      if (JSON.stringify(latestOccupancy) !== JSON.stringify(tableOccupancy)) {
        setTableOccupancy(latestOccupancy);
      }
    };

    const handleStorageEvent = (e) => {
      if (e.key === 'xyner_all_orders' || e.key === 'xyner_all_reservations' || e.key === 'xyner_table_occupancy') {
        syncLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    const interval = setInterval(syncLocalStorage, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(interval);
    };
  }, [orders, reservations, tableOccupancy]);

  // Auth Action Handlers wrapped defensively
  const handleLogin = (e) => {
    e.preventDefault();
    enableAudioContext();
    try {
      const user = usersDb.find(u => u.username === loginUsername && u.password === loginPassword);
      if (user) {
        setCurrentUser(user);
        sessionStorage.setItem('xyner_active_cashier', JSON.stringify(user));
        setLoginError('');
      } else {
        setLoginError('Invalid Cashier credentials. Seed account is admin / admin123');
      }
    } catch (err) {
      console.error('Error during login execution:', err);
      setLoginError('An internal error occurred during login. Resetting database might help.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('xyner_active_cashier');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    try {
      if (usersDb.find(u => u.username === newUsername)) {
        alert('Username already exists!');
        return;
      }
      const updatedUsers = [...usersDb, { username: newUsername, password: newPassword, securityAnswer: newSecAnswer.toLowerCase().trim() }];
      setUsersDb(updatedUsers);
      setShowAddUserModal(false);
      setNewUsername('');
      setNewPassword('');
      setNewSecAnswer('');
      alert(`Account created successfully for cashier: ${newUsername}`);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const handleForgetPassword = (e) => {
    e.preventDefault();
    try {
      if (forgetStep === 1) {
        const user = usersDb.find(u => u.username === forgetUsername);
        if (user) {
          setForgetStep(2);
          setForgetError('');
        } else {
          setForgetError('Username not found in Cashier database.');
        }
      } else if (forgetStep === 2) {
        const user = usersDb.find(u => u.username === forgetUsername);
        if (user && user.securityAnswer === securityAnswerInput.toLowerCase().trim()) {
          setForgetStep(3);
          setForgetError('');
        } else {
          setForgetError('Incorrect security verification answer.');
        }
      } else if (forgetStep === 3) {
        const updatedUsers = usersDb.map(u => u.username === forgetUsername ? { ...u, password: newResetPassword } : u);
        setUsersDb(updatedUsers);
        alert('Password successfully reset! You can now log in.');
        setShowForgetModal(false);
        setForgetStep(1);
        setForgetUsername('');
        setSecurityAnswerInput('');
        setNewResetPassword('');
        setForgetError('');
      }
    } catch (err) {
      console.error('Error during password reset:', err);
    }
  };

  // Order & Reservation Status Changers
  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(ord => ord.id === id ? { ...ord, status: newStatus } : ord));
  };

  const updateReservationStatus = (id, newStatus) => {
    setReservations(prev => prev.map(res => {
      if (res.id === id) {
        // If reservation is completed/cancelled, release table occupancy
        if ((newStatus === 'completed' || newStatus === 'cancelled') && res.selected_table) {
          const tId = res.selected_table.replace('Table ', '');
          setTableStatus(tId, 'open');
        }
        return { ...res, status: newStatus };
      }
      return res;
    }));
  };

  // WhatsApp Messages generated from Cashier side to notify customer
  const sendCashierWhatsAppConfirm = (type, recipient) => {
    let text = '';
    if (type === 'reservation') {
      text = `Hi ${recipient.customer_name}, your table reservation (Token: ${recipient.booking_token}) at XYNER is verified! Looking forward to serve you!`;
      updateReservationStatus(recipient.id, 'confirmed');
    } else {
      text = `Hi ${recipient.customer_name}, your order (Token: ${recipient.order_token}) is verified! The food is being prepared and will be at your doorstep in 40 minutes. Thank you for choosing XYNER!`;
      updateOrderStatus(recipient.id, 'preparing');
    }
    window.open(`https://wa.me/${recipient.phone_number}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Set explicit status for a table (Booked vs Open) from a dropdown select option
  const setTableStatus = (tableId, value) => {
    const status = value === 'booked';
    setTableOccupancy(prev => {
      const next = { ...prev, [tableId]: status };
      localStorage.setItem('xyner_table_occupancy', JSON.stringify(next));
      return next;
    });
  };

  // Menu Creation Handlers
  const handleCreateMenuItem = (e) => {
    e.preventDefault();
    try {
      const newItem = {
        id: `custom_${Math.random().toString(36).substring(2, 9)}`,
        name: newItemName,
        price: parseFloat(newItemPrice),
        desc: newItemDesc,
        category: newItemCat,
        image: newItemImage
      };

      const savedCustom = safeParse('xyner_menu_custom_items', []);
      localStorage.setItem('xyner_menu_custom_items', JSON.stringify([newItem, ...savedCustom]));
      setShowMenuModal(false);
      setNewItemName('');
      setNewItemPrice('');
      setNewItemDesc('');
      alert(`Menu item successfully created and published under ${newItemCat}!`);
    } catch (err) {
      console.error('Error creating menu item:', err);
    }
  };

  // Reset database recovery action
  const resetTerminalData = () => {
    if (window.confirm("Are you sure you want to reset all local terminal data? This will clear all custom orders, custom items, and restore default cashier profiles.")) {
      localStorage.removeItem('xyner_all_orders');
      localStorage.removeItem('xyner_all_reservations');
      localStorage.removeItem('xyner_table_occupancy');
      localStorage.removeItem('xyner_users');
      localStorage.removeItem('xyner_menu_custom_items');
      sessionStorage.removeItem('xyner_active_cashier');
      window.location.reload();
    }
  };

  // Print POS Receipt Preview trigger
  const triggerPrintReceipt = (order) => {
    setPrintReceiptOrder(order);
    setShowPrintModal(true);
  };

  const handlePrintAction = () => {
    window.print();
  };

  // Analytics helper metrics
  const getAnalytics = () => {
    const ordersList = Array.isArray(orders) ? orders : [];
    const resList = Array.isArray(reservations) ? reservations : [];

    const totalSales = ordersList
      .filter(o => o.status === 'preparing' || o.status === 'completed')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const confirmations = ordersList.filter(o => o.status === 'preparing' || o.status === 'completed').length;

    return {
      totalOrders: ordersList.length,
      confirmations,
      totalSales,
      totalReservations: resList.length
    };
  };

  const stats = getAnalytics();

  // Filters to separate Active vs History Log
  const activeOrders = (orders || []).filter(o => o.status === 'pending_verification' || o.status === 'preparing');
  
  const historyOrders = (orders || [])
    .filter(o => o.status === 'preparing' || o.status === 'completed' || o.status === 'cancelled')
    .filter(o => {
      if (!historyFilterDate) return true;
      const orderDate = new Date(o.created_at).toISOString().split('T')[0];
      return orderDate === historyFilterDate;
    })
    .filter(o => {
      if (!historyFilterTime) return true;
      const orderTimeStr = new Date(o.created_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return orderTimeStr === convert24to12(historyFilterTime);
    });

  const activeReservations = (reservations || []).filter(r => r.status === 'pending' || r.status === 'confirmed');
  
  const historyReservations = (reservations || [])
    .filter(r => r.status === 'confirmed' || r.status === 'completed' || r.status === 'cancelled')
    .filter(r => {
      if (!historyFilterDate) return true;
      return r.booking_date === historyFilterDate;
    })
    .filter(r => {
      if (!historyFilterTime) return true;
      return r.booking_time === convert24to12(historyFilterTime);
    });

  // If cashier session not active, display Login layout page
  if (!currentUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="absolute top-[10%] left-[-15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-light-green/10 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-15%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-medium-jungle/10 blur-[150px] rounded-full pointer-events-none z-0" />

        <div className="card-gradient max-w-md w-full p-8 rounded-[32px] border border-light-green/20 relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-black text-white">FOH Terminal</h2>
            <p className="text-xs text-gray-400">Jalalpur Jattan Cafe Management Console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wide">Username</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter cashier username"
                className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wide">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter cashier password"
                className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-semibold">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-light-green text-black-forest font-bold hover:bg-frosted-mint transition-all btn-glow text-sm"
            >
              Start Shift (Login)
            </button>
          </form>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => { setShowForgetModal(true); setForgetStep(1); setForgetError(''); }}
              className="text-xs text-light-green hover:underline font-semibold"
            >
              Forget Password?
            </button>

            <button
              onClick={resetTerminalData}
              className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1.5 font-semibold"
            >
              <RefreshCw size={12} />
              Reset Terminal
            </button>
          </div>
        </div>

        {/* Forget Password Modal */}
        {showForgetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="card-gradient max-w-sm w-full p-8 rounded-[32px] border border-light-green/20 relative space-y-6">
              <button onClick={() => setShowForgetModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={20} />
              </button>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-serif font-bold text-white">Reset Credentials</h3>
                <p className="text-xs text-gray-400">Security Reset wizard for FOH shifts</p>
              </div>

              <form onSubmit={handleForgetPassword} className="space-y-4">
                {forgetStep === 1 && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wide font-sans">Enter Username</label>
                    <input
                      type="text"
                      required
                      value={forgetUsername}
                      onChange={(e) => setForgetUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm"
                    />
                  </div>
                )}

                {forgetStep === 2 && (
                  <div className="space-y-3">
                    <div className="bg-light-green/5 border border-light-green/20 rounded-xl p-3 text-xs text-light-green flex items-start gap-2">
                      <BadgeInfo size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Security Question Challenge: What is your favorite color?</span>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wide">Your Answer</label>
                      <input
                        type="text"
                        required
                        value={securityAnswerInput}
                        onChange={(e) => setSecurityAnswerInput(e.target.value)}
                        placeholder="Security answer response"
                        className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm"
                      />
                    </div>
                  </div>
                )}

                {forgetStep === 3 && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wide">New Password</label>
                    <input
                      type="password"
                      required
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-sm"
                    />
                  </div>
                )}

                {forgetError && <p className="text-xs text-red-400 font-semibold">{forgetError}</p>}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-light-green text-black-forest font-bold text-xs btn-glow"
                >
                  {forgetStep === 1 ? 'Verify User' : forgetStep === 2 ? 'Verify Security Answer' : 'Save New Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If cashier session active, render Main FOH dashboard
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dashboard Top Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-light-green/10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-white flex items-center gap-3">
            FOH Panel
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-green/10 text-light-green text-xs font-bold border border-light-green/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-light-green" />
              Shift Active
            </span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Active Cashier: <span className="text-light-green font-bold">{currentUser?.username || 'Cashier'}</span> | Shift Started
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setNotificationSound(!notificationSound)}
            className={`p-3 rounded-2xl border transition-all ${
              notificationSound 
                ? 'bg-light-green/10 border-light-green/30 text-light-green' 
                : 'bg-black/30 border-light-green/10 text-gray-500 hover:text-gray-300'
            }`}
            title="Toggle Notification Sound"
          >
            <Volume2 size={20} />
          </button>
          
          <button
            onClick={() => setShowMenuModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/40 border border-light-green/20 text-gray-300 hover:text-light-green hover:border-light-green transition-all text-xs font-semibold"
          >
            <PlusCircle size={18} />
            Create Menu Item
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/40 border border-light-green/20 text-gray-300 hover:text-light-green hover:border-light-green transition-all text-xs font-semibold"
          >
            <UserPlus size={18} />
            Add Cashier Account
          </button>
          
          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
            title="End Shift (Logout)"
          >
            <Power size={20} />
          </button>
        </div>
      </div>

      {/* Analytics Statistics Panel Widget */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card-gradient rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Sales</span>
          <span className="text-2xl sm:text-3xl font-serif font-black text-light-green">Rs. {stats.totalSales}/-</span>
        </div>
        <div className="card-gradient rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
          <span className="text-2xl sm:text-3xl font-serif font-black text-white">{stats.totalOrders}</span>
        </div>
        <div className="card-gradient rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirmations Count</span>
          <span className="text-2xl sm:text-3xl font-serif font-black text-light-green">{stats.confirmations}</span>
        </div>
        <div className="card-gradient rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Reservations</span>
          <span className="text-2xl sm:text-3xl font-serif font-black text-white">{stats.totalReservations}</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-serif font-bold text-xs tracking-wider transition-all duration-300 ${
            activeTab === 'orders'
              ? 'bg-light-green text-black-forest shadow-md shadow-light-green/10'
              : 'bg-black/30 border border-light-green/15 text-gray-300 hover:border-light-green/50'
          }`}
        >
          <ShoppingBag size={16} />
          Incoming Orders ({activeOrders.length})
        </button>
        
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-serif font-bold text-xs tracking-wider transition-all duration-300 ${
            activeTab === 'reservations'
              ? 'bg-light-green text-black-forest shadow-md shadow-light-green/10'
              : 'bg-black/30 border border-light-green/15 text-gray-300 hover:border-light-green/50'
          }`}
        >
          <Calendar size={16} />
          Active Reservations ({activeReservations.length})
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-serif font-bold text-xs tracking-wider transition-all duration-300 ${
            activeTab === 'tables'
              ? 'bg-light-green text-black-forest shadow-md shadow-light-green/10'
              : 'bg-black/30 border border-light-green/15 text-gray-300 hover:border-light-green/50'
          }`}
        >
          <Utensils size={16} />
          Table Map Manager
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-serif font-bold text-xs tracking-wider transition-all duration-300 ${
            activeTab === 'history'
              ? 'bg-light-green text-black-forest shadow-md shadow-light-green/10'
              : 'bg-black/30 border border-light-green/15 text-gray-300 hover:border-light-green/50'
          }`}
        >
          <History size={16} />
          History Log
        </button>
      </div>

      {/* Conditional lists grids */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {activeOrders.length === 0 ? (
            <div className="text-center py-20 card-gradient rounded-3xl space-y-3">
              <ShoppingBag className="mx-auto text-gray-600" size={48} />
              <p className="text-gray-400 text-sm">No new incoming orders pending cashier review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeOrders.map((ord) => (
                <SpotlightCard key={ord.id} className="card-gradient p-6 sm:p-8 rounded-[32px] flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-light-green/5 pb-3">
                      <div>
                        <span className="text-xs font-semibold text-light-green">{ord.order_token}</span>
                        <h4 className="text-lg font-serif font-bold text-white mt-1">{ord.customer_name}</h4>
                        <p className="text-xs text-gray-400">{ord.phone_number}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        ord.status === 'preparing' 
                          ? 'bg-light-green/10 text-light-green border border-light-green/20' 
                          : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                        {ord.status === 'preparing' ? 'Preparing' : 'Pending review'}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {(ord.items || []).map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-gray-400">Rs. {item.subtotal}/-</span>
                        </li>
                      ))}
                    </ul>

                    {ord.address && (
                      <div className="bg-black/30 border border-light-green/5 rounded-2xl p-4 space-y-1 text-xs">
                        <span className="block font-semibold text-white">Delivery Coordinates:</span>
                        <p className="text-gray-400">{ord.address}</p>
                        <p className="text-gray-400 mt-1">Payment: {ord.payment_method}</p>
                      </div>
                    )}

                    {ord.screenshot_url && (
                      <div className="space-y-2">
                        <span className="block text-xs font-semibold text-yellow-500">EasyPaisa Verification Receipt:</span>
                        <img src={ord.screenshot_url} alt="Receipt Screenshot" className="h-32 object-cover rounded-xl border border-yellow-500/20 w-auto" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-light-green/5">
                    <span className="text-xl font-serif font-black text-light-green">Rs. {ord.total_amount}/-</span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerPrintReceipt(ord)}
                        className="p-2.5 rounded-full bg-black/40 border border-light-green/15 text-gray-300 hover:text-light-green hover:border-light-green transition-all"
                        title="Print Receipt"
                      >
                        <Printer size={16} />
                      </button>

                      {ord.status === 'pending_verification' ? (
                        <>
                          <button
                            onClick={() => setRejectingItem({ id: ord.id, token: ord.order_token, name: ord.customer_name, phone: ord.phone_number, type: 'order' })}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                          >
                            <X size={14} />
                            Reject
                          </button>
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'preparing')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-light-green text-black-forest hover:bg-frosted-mint transition-all text-xs font-bold btn-glow"
                          >
                            <Check size={14} />
                            Accept
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              const text = `Hi ${ord.customer_name}, your order (${ord.order_token}) is verified! The food is being prepared and will be at your doorstep in 40 minutes. Thank you for choosing XYNER!`;
                              window.open(`https://wa.me/${ord.phone_number}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-light-green/30 text-light-green hover:bg-light-green hover:text-black-forest transition-all text-[10px] font-bold animate-pulse"
                          >
                            <MessageSquare size={14} />
                            Send WhatsApp Confirmation
                          </button>
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'completed')}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-light-green text-black-forest font-bold text-xs btn-glow"
                          >
                            <Check size={14} />
                            Mark Completed
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="space-y-6">
          {activeReservations.length === 0 ? (
            <div className="text-center py-20 card-gradient rounded-3xl space-y-3">
              <Calendar className="mx-auto text-gray-600" size={48} />
              <p className="text-gray-400 text-sm">No active reservations mapped for this week.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeReservations.map((res) => (
                <SpotlightCard key={res.id} className="card-gradient p-6 rounded-[32px] flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-light-green/5 pb-3">
                      <div>
                        <span className="text-xs font-semibold text-light-green">{res.booking_token}</span>
                        <h4 className="text-lg font-serif font-bold text-white mt-1">{res.customer_name}</h4>
                        <p className="text-xs text-gray-400">{res.phone_number}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-light-green/10 text-light-green text-[9px] font-bold border border-light-green/20">
                          {res.selected_table || 'Unassigned'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          res.status === 'confirmed' 
                            ? 'bg-light-green/10 text-light-green border border-light-green/20' 
                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        }`}>
                          {res.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-300">
                      <div className="bg-black/25 border border-light-green/5 p-2 rounded-xl">
                        <span className="block text-[9px] opacity-75 font-semibold">GUESTS</span>
                        <span className="font-bold text-white mt-0.5 block">{res.guest_count}</span>
                      </div>
                      <div className="bg-black/25 border border-light-green/5 p-2 rounded-xl col-span-2">
                        <span className="block text-[9px] opacity-75 font-semibold">DATE & TIME</span>
                        <span className="font-bold text-white mt-0.5 block">{res.booking_date} at {res.booking_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-light-green/5">
                    {res.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => setRejectingItem({ id: res.id, token: res.booking_token, name: res.customer_name, phone: res.phone_number, type: 'reservation' })}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Reject
                        </button>
                        
                        <button
                          onClick={() => updateReservationStatus(res.id, 'confirmed')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-light-green text-black-forest hover:bg-frosted-mint transition-all text-xs font-bold btn-glow"
                        >
                          <Check size={14} />
                          Accept
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            const text = `Hi ${res.customer_name}, your table reservation (Token: ${res.booking_token}) at XYNER is verified! Looking forward to serve you!`;
                            window.open(`https://wa.me/${res.phone_number}?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-light-green/30 text-light-green hover:bg-light-green hover:text-black-forest transition-all text-[10px] font-bold animate-pulse"
                        >
                          <MessageSquare size={12} />
                          Send WhatsApp Confirmation
                        </button>
                        <button
                          onClick={() => updateReservationStatus(res.id, 'completed')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-light-green text-black-forest text-[10px] font-bold btn-glow"
                        >
                          <Check size={12} />
                          Check-in (Complete)
                        </button>
                      </>
                    )}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="card-gradient p-8 rounded-[32px] border border-light-green/15 space-y-6">
          <div className="border-b border-light-green/10 pb-4">
            <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-light-green" />
              Table Map Manager
            </h3>
            <p className="text-xs text-gray-400 mt-1">Manage active layouts. Choose table status Booked or Open directly from the drop-down menu selectors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Indoor Panel */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider border-l-2 border-light-green pl-2">Indoor Section (6 Tables)</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(tableOccupancy || {}).filter(k => k.startsWith('I-')).map(tableId => {
                  const isBooked = tableOccupancy[tableId];
                  return (
                    <div
                      key={tableId}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center border transition-all duration-300 hover:scale-105 hover:border-light-green/60 text-xs font-bold gap-2 ${
                        isBooked 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                          : 'bg-light-green/10 border-light-green/30 text-light-green hover:shadow-[0_0_12px_rgba(150,224,114,0.15)]'
                      }`}
                    >
                      <span>Table {tableId}</span>
                      <select
                        value={isBooked ? 'booked' : 'open'}
                        onChange={(e) => setTableStatus(tableId, e.target.value)}
                        className={`bg-black-forest/80 text-[10px] font-bold border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-light-green select-dark ${
                          isBooked ? 'border-red-500/30 text-red-400' : 'border-light-green/30 text-light-green'
                        }`}
                      >
                        <option value="open">Open (Available)</option>
                        <option value="booked">Booked (Occupied)</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outdoor Panel */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider border-l-2 border-light-green pl-2">Outdoor Section (11 Tables)</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(tableOccupancy || {}).filter(k => k.startsWith('O-')).map(tableId => {
                  const isBooked = tableOccupancy[tableId];
                  return (
                    <div
                      key={tableId}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center border transition-all duration-300 hover:scale-105 hover:border-light-green/60 text-xs font-bold gap-2 ${
                        isBooked 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                          : 'bg-light-green/10 border-light-green/30 text-light-green hover:shadow-[0_0_12px_rgba(150,224,114,0.15)]'
                      }`}
                    >
                      <span>Table {tableId}</span>
                      <select
                        value={isBooked ? 'booked' : 'open'}
                        onChange={(e) => setTableStatus(tableId, e.target.value)}
                        className={`bg-black-forest/80 text-[10px] font-bold border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-light-green select-dark ${
                          isBooked ? 'border-red-500/30 text-red-400' : 'border-light-green/30 text-light-green'
                        }`}
                      >
                        <option value="open">Open (Available)</option>
                        <option value="booked">Booked (Occupied)</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Log Tab: Processed Orders and Archived Reservations */}
      {activeTab === 'history' && (
        <div className="space-y-8">
          {/* History Filters block utilizing MUI pickers */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch bg-black/40 border border-light-green/10 p-6 rounded-3xl">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-gray-400">Filter History Date</label>
              <div className="bg-black/60 border border-light-green/20 rounded-2xl overflow-hidden p-2 flex justify-center">
                <ThemeProvider theme={darkTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                      orientation="landscape"
                      value={historyDateVal}
                      onChange={handleHistoryDateChange}
                      slotProps={{
                        actionBar: { actions: [] }
                      }}
                      sx={{
                        '& .MuiDialogActions-root': { display: 'none' },
                        '& .MuiPickersLayout-root': { background: 'transparent' },
                        '& .MuiPickersLayout-contentWrapper': { background: 'transparent' }
                      }}
                    />
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-gray-400">Filter History Time</label>
              <div className="bg-black/60 border border-light-green/20 rounded-2xl overflow-hidden p-2 flex justify-center">
                <ThemeProvider theme={darkTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticTimePicker
                      orientation="landscape"
                      value={historyTimeVal}
                      onChange={handleHistoryTimeChange}
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
            </div>
            {(historyFilterDate || historyFilterTime) && (
              <div className="flex items-end justify-center pb-2">
                <button
                  onClick={clearHistoryFilters}
                  className="px-5 py-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                >
                  Clear History Filters
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders History Section */}
            <div className="space-y-4 border border-light-green/10 p-6 rounded-[32px] bg-black/20">
              <h3 className="text-xl font-serif font-bold text-white border-b border-light-green/5 pb-2 flex items-center gap-2">
                <ShoppingBag size={18} className="text-light-green" />
                Processed Orders History ({historyOrders.length})
              </h3>
              
              {historyOrders.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-10">No matching processed orders found in history log.</p>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                  {historyOrders.map(ord => (
                    <div key={ord.id} className="bg-black-forest/50 border border-light-green/5 rounded-2xl p-4 space-y-3 animate-fade-in">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-light-green">{ord.order_token}</span>
                          <h5 className="font-bold text-white text-sm">{ord.customer_name}</h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          ord.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : ord.status === 'preparing'
                            ? 'bg-light-green/10 text-light-green border border-light-green/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <ul className="text-[11px] text-gray-400 space-y-0.5">
                        {(ord.items || []).map((i, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{i.quantity}x {i.name}</span>
                            <span>Rs. {i.subtotal}/-</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex justify-between items-center border-t border-light-green/5 pt-2 text-xs">
                        <span className="text-gray-500">{new Date(ord.created_at).toLocaleDateString()} at {new Date(ord.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => triggerPrintReceipt(ord)}
                            className="p-1.5 rounded-full bg-black/40 border border-light-green/15 text-gray-300 hover:text-light-green hover:border-light-green transition-all"
                            title="Print Slip"
                          >
                            <Printer size={12} />
                          </button>
                          <span className="font-serif font-black text-light-green">Rs. {ord.total_amount}/-</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          {/* Reservations History Section */}
          <div className="space-y-4 border border-light-green/10 p-6 rounded-[32px] bg-black/20">
            <h3 className="text-xl font-serif font-bold text-white border-b border-light-green/5 pb-2 flex items-center gap-2">
              <Calendar size={18} className="text-light-green" />
              Archived Reservations History ({historyReservations.length})
            </h3>

            {historyReservations.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-10">No archived reservations in history log.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {historyReservations.map(res => (
                  <div key={res.id} className="bg-black-forest/50 border border-light-green/5 rounded-2xl p-4 space-y-3 animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-light-green">{res.booking_token}</span>
                        <h5 className="font-bold text-white text-sm">{res.customer_name}</h5>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        res.status === 'confirmed'
                          ? 'bg-light-green/15 text-light-green border border-light-green/30'
                          : res.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 space-y-1">
                      <p>Table: <span className="text-white font-bold">{res.selected_table}</span> | Guests: <span className="text-white font-bold">{res.guest_count}</span></p>
                      <p>Date & Time: {res.booking_date} at {res.booking_time}</p>
                    </div>

                    <div className="text-[9px] text-gray-600 border-t border-light-green/5 pt-2">
                      Registered: {new Date(res.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Add Cashier Account Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="card-gradient max-w-sm w-full p-8 rounded-[32px] border border-light-green/20 relative space-y-6">
            <button onClick={() => setShowAddUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-serif font-bold text-white">Create Cashier Account</h3>
              <p className="text-xs text-gray-400">Add credentials for shift changeovers</p>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-300 uppercase">Username</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. Sobia"
                  className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-300 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create shift password"
                  className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-300 uppercase">Backup Question: Fav Color?</label>
                <input
                  type="text"
                  required
                  value={newSecAnswer}
                  onChange={(e) => setNewSecAnswer(e.target.value)}
                  placeholder="e.g. green"
                  className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs"
                />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-full bg-light-green text-black-forest font-bold text-xs btn-glow mt-2">
                Register Cashier Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Item Creation Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="card-gradient max-w-md w-full p-8 rounded-[32px] border border-light-green/20 relative space-y-6">
            <button onClick={() => setShowMenuModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-serif font-bold text-white">Create Menu Item</h3>
              <p className="text-xs text-gray-400">Add food items directly to active menus</p>
            </div>
            <form onSubmit={handleCreateMenuItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-300 uppercase">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Obsidian Deal 10"
                    className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-300 uppercase">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="e.g. 1290"
                    className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-300 uppercase">Category</label>
                <select
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value)}
                  className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-white text-xs select-dark"
                >
                  <option value="FRIED DEALS">Fried Deals</option>
                  <option value="PIZZA DEALS">Pizza Deals</option>
                  <option value="DONNER & SAVOUR">Donner & Savour</option>
                  <option value="BURGERS & WRAPS">Burgers & Wraps</option>
                  <option value="PIZZAS & DONNERS">Pizzas & Donners</option>
                  <option value="STARTERS & SIDES">Starters & Sides</option>
                  <option value="DRINKS & EXTRAS">Drinks & Extras</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-300 uppercase">Description</label>
                <textarea
                  rows="2"
                  required
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. 2 crispy Zinger Burgers, regular fries, 500ml cold drink"
                  className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-300 uppercase">Image Showcase Path</label>
                <input
                  type="text"
                  required
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs"
                />
              </div>

              <button type="submit" className="w-full py-3.5 rounded-full bg-light-green text-black-forest font-bold text-xs btn-glow mt-2">
                Publish Menu Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Real-time Order Popup modal */}
      {activeNewOrderPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="card-gradient max-w-lg w-full p-8 rounded-[32px] border-2 border-light-green bg-black-forest/95 relative space-y-6 shadow-[0_0_35px_rgba(150,224,114,0.3)] animate-float">
            <button 
              onClick={() => setActiveNewOrderPopup(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2 border-b border-light-green/10 pb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 animate-pulse">
                <Bell size={12} className="animate-bounce" />
                New Order Received
              </span>
              <h3 className="text-2xl font-serif font-black text-white mt-1">Real-time Order Alert</h3>
              <p className="text-xs text-light-green font-mono font-bold">Token: {activeNewOrderPopup.order_token}</p>
            </div>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex justify-between border-b border-light-green/5 pb-2">
                <span>Customer Name:</span>
                <span className="font-bold text-white">{activeNewOrderPopup.customer_name}</span>
              </div>
              <div className="flex justify-between border-b border-light-green/5 pb-2">
                <span>Phone:</span>
                <span className="font-bold text-white">{activeNewOrderPopup.phone_number}</span>
              </div>
              <div className="space-y-1.5">
                <span className="block font-semibold text-white">Items:</span>
                <ul className="space-y-1 pl-3 list-disc text-gray-400">
                  {(activeNewOrderPopup.items || []).map((item, idx) => (
                    <li key={idx}>{item.quantity}x {item.name} - Rs. {item.subtotal}/-</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-light-green/10">
              <div>
                <span className="block text-[9px] text-gray-500 font-bold uppercase">Total Bill</span>
                <span className="text-xl font-serif font-black text-light-green">Rs. {activeNewOrderPopup.total_amount}/-</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRejectingItem({
                      id: activeNewOrderPopup.id,
                      token: activeNewOrderPopup.order_token,
                      name: activeNewOrderPopup.customer_name,
                      phone: activeNewOrderPopup.phone_number,
                      type: 'order'
                    });
                    setActiveNewOrderPopup(null);
                  }}
                  className="px-5 py-2.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    updateOrderStatus(activeNewOrderPopup.id, 'preparing');
                    setActiveNewOrderPopup(null);
                  }}
                  className="px-6 py-2.5 rounded-full bg-light-green text-black-forest font-bold text-xs btn-glow"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Seating Reservation Popup modal */}
      {activeNewResPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="card-gradient max-w-lg w-full p-8 rounded-[32px] border-2 border-light-green bg-black-forest/95 relative space-y-6 shadow-[0_0_35px_rgba(150,224,114,0.3)] animate-float">
            <button 
              onClick={() => setActiveNewResPopup(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2 border-b border-light-green/10 pb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 animate-pulse">
                <Bell size={12} className="animate-bounce" />
                New Reservation Received
              </span>
              <h3 className="text-2xl font-serif font-black text-white mt-1">Real-time Booking Alert</h3>
              <p className="text-xs text-light-green font-mono font-bold">Token: {activeNewResPopup.booking_token}</p>
            </div>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex justify-between border-b border-light-green/5 pb-2">
                <span>Customer Name:</span>
                <span className="font-bold text-white">{activeNewResPopup.customer_name}</span>
              </div>
              <div className="flex justify-between border-b border-light-green/5 pb-2">
                <span>Phone:</span>
                <span className="font-bold text-white">{activeNewResPopup.phone_number}</span>
              </div>
              <div className="flex justify-between border-b border-light-green/5 pb-2">
                <span>Table Selected:</span>
                <span className="font-bold text-light-green">{activeNewResPopup.selected_table || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between border-b border-light-green/5 pb-2">
                <span>Guests Count:</span>
                <span className="font-bold text-white">{activeNewResPopup.guest_count} Persons</span>
              </div>
              <div className="flex justify-between border-b border-light-green/5 pb-2">
                <span>Date & Time:</span>
                <span className="font-bold text-white">{activeNewResPopup.booking_date} at {activeNewResPopup.booking_time}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-light-green/10">
              <button
                onClick={() => {
                  setRejectingItem({
                    id: activeNewResPopup.id,
                    token: activeNewResPopup.booking_token,
                    name: activeNewResPopup.customer_name,
                    phone: activeNewResPopup.phone_number,
                    type: 'reservation'
                  });
                  setActiveNewResPopup(null);
                }}
                className="px-5 py-2.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
              >
                Reject
              </button>
              
              <button
                onClick={() => {
                  updateReservationStatus(activeNewResPopup.id, 'confirmed');
                  setActiveNewResPopup(null);
                }}
                className="px-6 py-2.5 rounded-full bg-light-green text-black-forest font-bold text-xs btn-glow"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS receipt print modal */}
      {showPrintModal && printReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="card-gradient max-w-sm w-full p-8 rounded-[32px] border border-light-green/20 relative space-y-6 no-print">
            <button onClick={() => setShowPrintModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <div className="text-center border-b border-light-green/10 pb-3">
              <h3 className="text-xl font-serif font-bold text-white flex items-center justify-center gap-1.5">
                <Printer size={18} className="text-light-green" />
                POS Receipt Preview
              </h3>
            </div>

            {/* Visual preview slip */}
            <div className="bg-white text-black p-5 rounded-lg font-mono text-xs space-y-4 shadow-inner max-h-[350px] overflow-y-auto print-receipt-container">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-sm tracking-wider">XYNER CAFE</h4>
                <p className="text-[10px] opacity-75">Jalalpur Jattan Branch</p>
                <p className="text-[9px] opacity-75">Ph: (03) 111 373 333</p>
                <p className="text-[10px]">---------------------------</p>
              </div>

              <div className="space-y-1 text-[10px]">
                <p>Token: {printReceiptOrder.order_token}</p>
                <p>Cashier Shift: {currentUser?.username || 'Cashier'}</p>
                <p>Date: {printReceiptOrder.created_at ? new Date(printReceiptOrder.created_at).toLocaleDateString() : ''}</p>
                <p>Time: {printReceiptOrder.created_at ? new Date(printReceiptOrder.created_at).toLocaleTimeString() : ''}</p>
                <p>Client: {printReceiptOrder.customer_name}</p>
                <p>---------------------------</p>
              </div>

              <ul className="space-y-1 text-[10px]">
                {(printReceiptOrder.items || []).map((i, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{i.quantity}x {i.name}</span>
                    <span>Rs. {i.subtotal}/-</span>
                  </li>
                ))}
              </ul>

              <div className="text-right text-[10px] border-t border-dashed border-black pt-2">
                <p className="font-bold">Total Sales: Rs. {printReceiptOrder.total_amount}/-</p>
                <p className="text-[9px] opacity-75 mt-0.5">Method: {printReceiptOrder.payment_method}</p>
              </div>

              <div className="text-center text-[9px] opacity-75 pt-3">
                <p>Thank you for ordering at XYNER!</p>
                <p>Fast Food redefined.</p>
              </div>
            </div>

            <button
              onClick={handlePrintAction}
              className="w-full py-4 rounded-full bg-light-green text-black-forest font-bold hover:bg-frosted-mint transition-all btn-glow text-sm"
            >
              Print Receipt (80mm)
            </button>
          </div>
        </div>
      )}
      {/* Rejection Reasons Dialog Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="card-gradient max-w-sm w-full p-8 rounded-[32px] border border-red-500/30 bg-black-forest/95 relative space-y-6">
            <button 
              onClick={() => setRejectingItem(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="text-center border-b border-light-green/10 pb-3 space-y-1">
              <h3 className="text-xl font-serif font-bold text-white flex items-center justify-center gap-1.5">
                <ShieldAlert size={18} className="text-red-400" />
                Select Rejection Reason
              </h3>
              <p className="text-[10px] text-gray-400">Refuse token: <span className="text-red-400 font-mono font-bold">{rejectingItem.token}</span></p>
            </div>

            <form onSubmit={handleRejectAction} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Choose Reason</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="block w-full px-4 py-3 rounded-2xl bg-black/45 border border-light-green/15 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs select-dark"
                >
                  <option value="The kitchen is closed">The kitchen is closed</option>
                  <option value="Select items are currently out of stock">Select items are currently out of stock</option>
                  <option value="Delivery location is outside our coverage area">Delivery location is outside our coverage area</option>
                  <option value="Dine-in seating is fully booked for this time slot">Dine-in seating is fully booked for this time slot</option>
                  <option value="custom">Custom Reason...</option>
                </select>
              </div>

              {rejectionReason === 'custom' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-300 uppercase">Write Custom Reason</label>
                  <textarea
                    rows="2"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Describe specific rejection details..."
                    className="block w-full px-4 py-3 rounded-2xl bg-black/40 border border-light-green/10 focus:border-light-green focus:outline-none text-[#f3f4f6] text-xs resize-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all btn-glow shadow-md shadow-red-500/10"
              >
                Confirm Rejection & Notify via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
