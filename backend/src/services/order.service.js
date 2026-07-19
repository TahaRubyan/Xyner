const { db } = require('../config/firebase');

// Full price index of XYNER menu items for secure backend validation
const MENU_PRICES = {
  // Fried Deals
  'Fried Deal 1': 990, 'Fried Deal 2': 760, 'Fried Deal 3': 890, 'Fried Deal 4': 1550,
  'Fried Deal 5': 660, 'Fried Deal 6': 590, 'Fried Deal 7': 830, 'Fried Deal 8': 1590,
  'Fried Deal 9': 550, 'Fried Deal 10': 590, 'Fried Deal 11': 830, 'Fried Deal 12': 1380,

  // Kids Deals
  'Kids Deal 1': 580, 'Kids Deal 2': 580, 'Kids Deal 3': 680,

  // Pizza Deals
  'Pizza Deal 1': 2350, 'Pizza Deal 2': 1930, 'Pizza Deal 3': 1590, 'Pizza Deal 4': 4250,
  'Pizza Deal 5': 3550, 'Pizza Deal 6': 2900, 'Pizza Deal 7': 3690, 'Pizza Deal 8': 3050,
  'Pizza Deal 9': 1360, 'Pizza Deal 10': 2650,

  // Donner Deals
  'Donner Deal 11': 4650, 'Donner Deal 12': 4180,

  // Savour Deals
  'Savour Deal 1': 730, 'Savour Deal 2': 1399, 'Savour Deal 3': 1740,

  // A La Carte Starters
  'Chicken Cheese Pasta': 590, 'Flaming Pasta': 590, 'Peri Wings 6 Pcs': 390,
  'Peri Wings 12 Pcs': 690, 'Oven Baked Wings 6 Pcs': 350, 'Oven Baked Wings 12 Pcs': 650,
  'Nuggets 6 Pcs': 310, 'Nuggets 12 Pcs': 590, '15 Pcs Hot Shots': 550,
  
  // Platters
  'X Platter': 890,

  // Fries
  'Large Fries': 350, 'Loaded Fries': 590, 'Pizza Fries': 650,

  // Sandwiches
  'Mexican Sandwich': 750, 'Penini Sandwich': 750,

  // Wraps
  'Arabic Wrap': 650, 'Arabic Mint Wrap': 650, 'Arabic Grilled Wrap': 650,
  'Zinger Wrap': 490, 'Zinger Twister': 490,

  // Fried Wings
  'Fried Wings 5 Pcs': 350, 'Fried Wings 10 Pcs': 650, 'Fried Wings 20 Pcs': 1250,

  // Burgers
  'Zinger Burger': 400, 'Fillet Thunder': 400, 'Lava Thunder': 590, 'Tower Sizzler': 590,
  'Double Decker': 600, 'Crispy Burger': 350, 'Tikka Burger': 350, 'Cheese Slice': 100,

  // Cheese Sticks
  '1 Chicken Cheese Stick': 650, '2 Chicken Cheese Stick': 1199,

  // Drinks
  'Reg Drink': 90, 'Can 250 ml': 120, '500 ml Drink': 130, '1 Ltr Drink': 180,
  '1.5 Ltr Drink': 230, 'Water Small': 80, 'Water Large': 130, 'Nestle Juice': 110,

  // Dips
  'Garlic Dip': 100, 'Special Dip': 100, 'Shahi Dip': 100, 'Tex Mex': 100,

  // Classic Pizzas
  'Classic Pizza PP (8")': 650, 'Classic Pizza S (11")': 1250, 'Classic Pizza M (13")': 1650, 'Classic Pizza L (15")': 1950,

  // Signature Pizzas
  'Signature Pizza PP (8")': 750, 'Signature Pizza S (11")': 1350, 'Signature Pizza M (13")': 1650, 'Signature Pizza L (15")': 2050,

  // The Crust Pizzas
  'The Crust Pizza M (13")': 1850, 'The Crust Pizza L (15")': 2250,

  // X Donners
  'X Donner S (11")': 1450, 'X Donner M (13")': 1850, 'X Donner L (15")': 2350,

  // Extra Toppings
  'Extra Topping Small': 150, 'Extra Topping Medium': 180, 'Extra Topping Large': 200
};

/**
 * Validates ordered items, calculates the secure total bill, and creates a pending delivery order.
 * @param {string} customerName - Name of the customer
 * @param {string} phoneNumber - WhatsApp/Phone number of the customer
 * @param {Array} items - Array of items ordered e.g. [{ name: 'Zinger Burger', quantity: 2 }]
 * @param {string} address - Delivery address details
 * @param {string} paymentMethod - "COD" or "EasyPaisa" or "JazzCash"
 * @returns {Promise<{success: boolean, orderId: string, orderToken: string, totalAmount: number}>}
 */
async function createDeliveryOrder(customerName, phoneNumber, items, address, paymentMethod) {
  try {
    let computedTotal = 0;
    const validatedItems = [];

    // Loop through each item to calculate price based on our secure price list
    items.forEach(orderItem => {
      const { name, quantity } = orderItem;
      const cleanName = Object.keys(MENU_PRICES).find(
        key => key.toLowerCase() === name.toLowerCase().trim()
      ) || name; // Fallback to name if not found

      const price = MENU_PRICES[cleanName] || 0;
      const qty = Math.max(1, Number(quantity || 1));
      const subtotal = price * qty;
      computedTotal += subtotal;

      validatedItems.push({
        name: cleanName,
        quantity: qty,
        unit_price: price,
        subtotal: subtotal
      });
    });

    const newOrder = {
      restaurant_id: 'xyner',
      branch: 'Jalalpur Jattan',
      customer_name: customerName,
      phone_number: phoneNumber,
      items: validatedItems,
      total_amount: computedTotal,
      address: address,
      payment_method: paymentMethod,
      screenshot_url: '', // populated when they upload the receipt screenshot
      status: paymentMethod === 'COD' ? 'preparing' : 'pending_verification',
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection('orders').add(newOrder);

    // Generate a human-readable order token e.g. XY-1024
    const tokenPart = docRef.id.slice(-4).toUpperCase();
    const orderToken = `XY-ORD-${tokenPart}`;

    await db.collection('orders').doc(docRef.id).update({ order_token: orderToken });

    return {
      success: true,
      orderId: docRef.id,
      orderToken: orderToken,
      totalAmount: computedTotal
    };
  } catch (error) {
    console.error("Error in createDeliveryOrder service:", error);
    throw error;
  }
}

module.exports = {
  createDeliveryOrder,
  MENU_PRICES
};
