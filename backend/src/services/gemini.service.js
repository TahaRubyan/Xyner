const { GoogleGenAI } = require('@google/genai');
const reservationService = require('./reservation.service');
const orderService = require('./order.service');

// Initialize Google Gen AI client
const apiKey = process.env.GEMINI_API_KEY || 'MOCK_KEY';
const ai = new GoogleGenAI({ apiKey });

// System instructions containing persona, language routing rules, current time injection, and the entire XYNER menu
function getSystemInstruction() {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentDayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return `You are an elite, respectful, and highly efficient digital front-of-house manager and ordering assistant for "XYNER" (The cafe you love) located in Jalalpur Jattan, Pakistan.
Contact number: (03) 111 373 333
Today's Date reference: ${currentDate} (${currentDayOfWeek})

Strict Language Guardrails:
1. You are natively fluent in English, Urdu (Urdu Script), and Roman Urdu. Always match the primary language used by the guest.
2. BEHAVIOR FOR PUNJABI INPUT: If a guest messages you in Punjabi (e.g., "Veeray, 4 bandyan di thaan mil jasi aj rati 8 baje?" or "sanu 2 zinger burgers delivery kar de"), you must instantly parse their intent, extract variables (guests, items, time, date), but you MUST respond exclusively in polite, warm Urdu (e.g., "Ji bilkul, main aap ke liye abhi order confirm karta hoon..."). You are strictly forbidden from outputting text strings in Punjabi.
3. Cultural Tone: Always employ professional Urdu honorifics such as 'Ji', 'Aap', and 'Tashreef rakhein' to maximize hospitality. Keep replies concise and formatted for mobile screen readability. Do not output markdown blocks like asterisks for bolding excessively.

XYNER MENU & PRICES (Rs.):

#### FRIED DEALS
- Fried Deal 1: Sandwich, Reg Fries, Reg Drink — Rs. 990
- Fried Deal 2: Zinger Twister, Reg Fries, Reg Drink — Rs. 760
- Fried Deal 3: Arabic Wrap, Reg Fries, Reg Drink — Rs. 890
- Fried Deal 4: 2 Arabic Wraps, Reg Fries, 500 ml Drink — Rs. 1550
- Fried Deal 5: 10 Hot Wings, Reg Drink — Rs. 660
- Fried Deal 6: Zinger Burger, Reg Fries, Reg Drink — Rs. 590
- Fried Deal 7: 2 Zinger Burgers, 500 ml Drink — Rs. 830
- Fried Deal 8: 4 Zinger Burgers, 1 Liter Drink — Rs. 1590
- Fried Deal 9: Crispy Burger, Reg Fries, Reg Drink — Rs. 550
- Fried Deal 10: Fillet Burger, Reg Fries, Reg Drink — Rs. 590
- Fried Deal 11: 2 Fillet Burgers, 500 ml Drink — Rs. 830
- Fried Deal 12: 2 Zinger Burgers, 10 Hot Wings, 500 ml Drink — Rs. 1380

#### KIDS MEALS
- Kids Deal 1: Crispy Burger, Reg Fries, Slice Juice — Rs. 580
- Kids Deal 2: 6 Pcs Nuggets, Reg Fries, Slice Juice — Rs. 580
- Kids Deal 3: Crispy Burger, 6 Pcs Nuggets, Slice Juice — Rs. 680

#### PIZZA DEALS
- Pizza Deal 1: Large Pizza, Large Fries, 1.5 Liter Drink — Rs. 2350
- Pizza Deal 2: Medium Pizza, Large Fries, 1 Liter Drink — Rs. 1930
- Pizza Deal 3: Small Pizza, Reg Fries, 500 ml Drink — Rs. 1590
- Pizza Deal 4: 2 Large Pizzas, Large Fries, 1.5 Liter Drink — Rs. 4250
- Pizza Deal 5: 2 Medium Pizzas, Large Fries, 1.5 Liter Drink — Rs. 3550
- Pizza Deal 6: 2 Small Pizzas, Reg Fries, 1 Liter Drink — Rs. 2900
- Pizza Deal 7: Large Pizza, Medium Pizza, 1.5 Liter Drink — Rs. 3690
- Pizza Deal 8: Medium Pizza, Small Pizza, 1.5 Liter Drink — Rs. 3050
- Pizza Deal 9: 2 Pan Pizzas, 500 ml Drink — Rs. 1360
- Pizza Deal 10: 4 Pan Pizzas, 1 Liter Drink — Rs. 2650
*(Note: The Crust Pizzas are not included in deals)*

#### DONNER DEALS
- Donner Deal 11: 2 Large Donners, 1.5 Liter Drink — Rs. 4650
- Donner Deal 12: 1 Large Donner, 1 Medium Donner, 1.5 Liter Drink — Rs. 4180

#### SAVOUR DEALS
- Savour Deal 1: 1 Pan Pizza, Reg Drink — Rs. 730
- Savour Deal 2: 1 Small Pizza, 500 ml Drink — Rs. 1399
- Savour Deal 3: 1 Medium Pizza, 1 Liter Drink — Rs. 1740

#### A LA CARTE MENU
* STARTERS
  - Chicken Cheese Pasta — Rs. 590
  - Flaming Pasta — Rs. 590
  - Peri Wings 6 Pcs — Rs. 390 | Peri Wings 12 Pcs — Rs. 690
  - Oven Baked Wings 6 Pcs — Rs. 350 | Oven Baked Wings 12 Pcs — Rs. 650
  - Nuggets 6 Pcs — Rs. 310 | Nuggets 12 Pcs — Rs. 590
  - 15 Pcs Hot Shots — Rs. 550
* X PLATTER — Rs. 890
  - Includes: 4 Pcs Spin Rolls, 6 Pcs Baked Wings, 1 Reg Fries, 1 Garlic Dip
* FRIES
  - Large Fries — Rs. 350
  - Loaded Fries — Rs. 590
  - Pizza Fries — Rs. 650
* SANDWICHES
  - Mexican Sandwich — Rs. 750
  - Penini Sandwich — Rs. 750
* WRAPS
  - Arabic Wrap — Rs. 650
  - Arabic Mint Wrap — Rs. 650
  - Arabic Grilled Wrap — Rs. 650
  - Zinger Wrap — Rs. 490
  - Zinger Twister — Rs. 490
* FRIED WINGS
  - Fried Wings 5 Pcs — Rs. 350 | Fried Wings 10 Pcs — Rs. 650 | Fried Wings 20 Pcs — Rs. 1250
* BURGERS
  - Zinger Burger — Rs. 400
  - Fillet Thunder — Rs. 400
  - Lava Thunder — Rs. 590
  - Tower Sizzler — Rs. 590
  - Double Decker — Rs. 600
  - Crispy Burger — Rs. 350
  - Tikka Burger — Rs. 350
  - Cheese Slice — Rs. 100
* CHEESE STICKS
  - 1 Chicken Cheese Stick — Rs. 650
  - 2 Chicken Cheese Stick — Rs. 1199
* DRINKS
  - Reg Drink — Rs. 90
  - Can 250 ml — Rs. 120
  - 500 ml Drink — Rs. 130
  - 1 Ltr Drink — Rs. 180
  - 1.5 Ltr Drink — Rs. 230
  - Water Small — Rs. 80 | Water Large — Rs. 130
  - Nestle Juice — Rs. 110
* DIPS
  - Garlic Dip / Special Dip / Shahi Dip / Tex Mex — Rs. 100 each
* PIZZAS (Classic Flavors: Chicken Tikka Pizza, Chicken Fajita Pizza, Chicken Supreme Pizza, Smoke Pizza, Split Mama, Cheese Lover Pizza, Vegi Lover Pizza)
  - Classic Pizza PP (8") — Rs. 650
  - Classic Pizza S (11") — Rs. 1250
  - Classic Pizza M (13") — Rs. 1650
  - Classic Pizza L (15") — Rs. 1950
* PIZZAS (Signature Flavors: Shahi Pizza, Turkish Pizza, Tex Mex Pizza, Bone Fire Pizza, Malai Boti Pizza, Americano Heat Pizza)
  - Signature Pizza PP (8") — Rs. 750
  - Signature Pizza S (11") — Rs. 1350
  - Signature Pizza M (13") — Rs. 1650
  - Signature Pizza L (15") — Rs. 2050
* THE CRUST PIZZAS (Flavors: Stuff Crust, Crown Crust, Kebab Crust, Thin Crust, Stuff Cheese Crust)
  - The Crust Pizza M (13") — Rs. 1850
  - The Crust Pizza L (15") — Rs. 2250
* X DONNERS (Flavors: Classic Donner, Turkish Donner, Malai Donner)
  - X Donner S (11") — Rs. 1450
  - X Donner M (13") — Rs. 1850
  - X Donner L (15") — Rs. 2350
* EXTRA TOPPING
  - Extra Topping Small — Rs. 150 | Extra Topping Medium — Rs. 180 | Extra Topping Large — Rs. 200

Reservation Logic:
- Call checkAvailability first to confirm capacity.
- If available, take customerName and phoneNumber and trigger createReservation.

Delivery Ordering Logic:
1. If the guest lists items they wish to order, summarize the items and ask for:
   - Delivery Address in Jalalpur Jattan.
   - Payment method: "COD" (Cash on Delivery) or Mobile Wallet ("EasyPaisa" or "JazzCash").
2. Once you have Name, Phone, Items, Address, and Payment Method, call createDeliveryOrder.
3. If payment method is EasyPaisa or JazzCash:
   - Provide the account details: Number 0311-1373333 (Account Title: XYNER Cafe).
   - Inform the user that they must transfer the amount and upload the payment screenshot to finalize.
`;
}

// Tool definitions for Gemini
const tools = [
  {
    functionDeclarations: [
      {
        name: 'checkAvailability',
        description: 'Checks table seating availability at XYNER for a specific date, time, and guest count.',
        parameters: {
          type: 'OBJECT',
          properties: {
            date: { type: 'STRING', description: 'Date in YYYY-MM-DD format.' },
            time: { type: 'STRING', description: 'Time in 24-hour format (HH:MM), e.g., 20:00.' },
            guestCount: { type: 'INTEGER', description: 'The number of guests.' }
          },
          required: ['date', 'time', 'guestCount']
        }
      },
      {
        name: 'createReservation',
        description: 'Creates a reservation booking at XYNER for a customer.',
        parameters: {
          type: 'OBJECT',
          properties: {
            customerName: { type: 'STRING', description: 'The name of the customer.' },
            phoneNumber: { type: 'STRING', description: 'The WhatsApp/phone number of the customer.' },
            date: { type: 'STRING', description: 'Date in YYYY-MM-DD format.' },
            time: { type: 'STRING', description: 'Time in 24-hour format (HH:MM), e.g., 20:00.' },
            guestCount: { type: 'INTEGER', description: 'The number of guests.' }
          },
          required: ['customerName', 'phoneNumber', 'date', 'time', 'guestCount']
        }
      },
      {
        name: 'createDeliveryOrder',
        description: 'Creates a food delivery order at XYNER for a customer.',
        parameters: {
          type: 'OBJECT',
          properties: {
            customerName: { type: 'STRING', description: 'The name of the customer.' },
            phoneNumber: { type: 'STRING', description: 'The WhatsApp/phone number of the customer.' },
            items: {
              type: 'ARRAY',
              description: 'Array of items ordered.',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING', description: 'Exact item name from the menu.' },
                  quantity: { type: 'INTEGER', description: 'Quantity of item.' }
                },
                required: ['name', 'quantity']
              }
            },
            address: { type: 'STRING', description: 'Full physical delivery address.' },
            paymentMethod: {
              type: 'STRING',
              description: 'COD, EasyPaisa, or JazzCash.',
              enum: ['COD', 'EasyPaisa', 'JazzCash']
            }
          },
          required: ['customerName', 'phoneNumber', 'items', 'address', 'paymentMethod']
        }
      }
    ]
  }
];

/**
 * Communicates with Gemini, executing tools when requested.
 */
async function getAgentResponse(userMessage, history = []) {
  if (apiKey === 'MOCK_KEY') {
    return mockAgentLogic(userMessage);
  }

  try {
    const contents = [];
    
    // Format history turns
    history.forEach(turn => {
      contents.push({
        role: turn.role,
        parts: [{ text: turn.content }]
      });
    });

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    let response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: getSystemInstruction(),
        tools: tools
      }
    });

    let iterations = 0;
    while (response.functionCalls && response.functionCalls.length > 0 && iterations < 5) {
      iterations++;
      const functionCall = response.functionCalls[0];
      const { name, args } = functionCall;
      
      console.log(`🤖 Gemini triggered tool: ${name} with args:`, args);
      let toolResult;

      if (name === 'checkAvailability') {
        toolResult = await reservationService.checkAvailability(args.date, args.time, args.guestCount);
      } else if (name === 'createReservation') {
        toolResult = await reservationService.createReservation(
          args.customerName,
          args.phoneNumber,
          args.date,
          args.time,
          args.guestCount
        );
      } else if (name === 'createDeliveryOrder') {
        toolResult = await orderService.createDeliveryOrder(
          args.customerName,
          args.phoneNumber,
          args.items,
          args.address,
          args.paymentMethod
        );
      }

      console.log(`🔌 Executed tool result:`, toolResult);

      contents.push({
        role: 'model',
        parts: [{ functionCall: functionCall }]
      });

      contents.push({
        role: 'user',
        parts: [{
          functionResponse: {
            name: name,
            response: toolResult
          }
        }]
      });

      response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(),
          tools: tools
        }
      });
    }

    const replyText = response.text || '';
    
    const newHistory = [
      ...history,
      { role: 'user', content: userMessage },
      { role: 'model', content: replyText }
    ];

    if (newHistory.length > 20) {
      newHistory.splice(0, newHistory.length - 20);
    }

    return {
      text: replyText,
      updatedHistory: newHistory
    };

  } catch (error) {
    console.error("Gemini service error:", error);
    return {
      text: "Sorry, I encountered a connection error. Please try again shortly. / Maazrat, connection ka masla aa raha hai.",
      updatedHistory: history
    };
  }
}

/**
 * Mock Agent Logic
 */
async function mockAgentLogic(message) {
  const msgLower = message.toLowerCase();
  
  let isEnglish = /[a-zA-Z]/.test(message) && !msgLower.includes('kya') && !msgLower.includes('raat') && !msgLower.includes('baje') && !msgLower.includes('yaar') && !msgLower.includes('sanu');
  let isPunjabi = msgLower.includes('yaar') || msgLower.includes('sanu') || msgLower.includes('bandyan') || msgLower.includes('chahidi') || msgLower.includes('ae');
  let isRomanUrdu = !isEnglish && !isPunjabi && (msgLower.includes('kya') || msgLower.includes('aaj') || msgLower.includes('raat') || msgLower.includes('logon') || msgLower.includes('jagah'));

  let reply = "";

  if (isPunjabi) {
    reply = "Ji bilkul, main aap ke liye seating check karta hoon. Baraye meherbani thora intezar farmayein.";
  } else if (isRomanUrdu) {
    reply = "Ji haan, humare paas seats available hain. Aap kis naam se booking karwana chahenge?";
  } else {
    reply = "Hello! Welcome to XYNER. I would be happy to check table availability or help you explore our menu. How many guests and what time?";
  }

  if (msgLower.includes('deal 7') || msgLower.includes('deal 7 price')) {
    reply = isEnglish 
      ? "Fried Deal 7 includes 2 Zinger Burgers and a 500 ml Drink for Rs. 830." 
      : "Fried Deal 7 me 2 Zinger Burgers aur 500 ml Drink Rs. 830 me shamil hain.";
  }

  // Simulate order creation mock reply
  if (msgLower.includes('burger') && (msgLower.includes('order') || msgLower.includes('delivery'))) {
    reply = "I've created your order for a Zinger Burger (COD). Your order token is XY-ORD-MOCK.";
  }

  return {
    text: reply,
    updatedHistory: [
      { role: 'user', content: message },
      { role: 'model', content: reply }
    ]
  };
}

module.exports = {
  getAgentResponse
};
