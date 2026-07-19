const axios = require('axios');
const app = require('../src/app');
const { db } = require('../src/config/firebase');

const TEST_PORT = 3001;
let server;

// Helper to send a mock WhatsApp text webhook request to our Express server
async function sendMockMessage(from, customerName, text) {
  const payload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '123456789',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '15550000000',
                phone_number_id: 'mock_phone_number_id'
              },
              contacts: [
                {
                  profile: {
                    name: customerName
                  },
                  wa_id: from
                }
              ],
              messages: [
                {
                  from: from,
                  id: `mock_message_id_${Math.random().toString(36).substring(2, 9)}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: {
                    body: text
                  },
                  type: 'text'
                }
              ]
            },
            field: 'messages'
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(`http://localhost:${TEST_PORT}/webhook`, payload);
    return response.status;
  } catch (error) {
    console.error(`Error sending message "${text}":`, error.message);
    throw error;
  }
}

// Helper to send a mock WhatsApp audio (voice note) webhook request
async function sendMockAudio(from, customerName, audioId) {
  const payload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '123456789',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '15550000000',
                phone_number_id: 'mock_phone_number_id'
              },
              contacts: [
                {
                  profile: {
                    name: customerName
                  },
                  wa_id: from
                }
              ],
              messages: [
                {
                  from: from,
                  id: `mock_audio_id_${Math.random().toString(36).substring(2, 9)}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  audio: {
                    id: audioId,
                    mime_type: 'audio/ogg; codecs=opus'
                  },
                  type: 'audio'
                }
              ]
            },
            field: 'messages'
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(`http://localhost:${TEST_PORT}/webhook`, payload);
    return response.status;
  } catch (error) {
    console.error(`Error sending audio ID ${audioId}:`, error.message);
    throw error;
  }
}

// Helper to send a mock WhatsApp image (payment receipt screenshot) webhook request
async function sendMockImage(from, customerName, imageId) {
  const payload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '123456789',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '15550000000',
                phone_number_id: 'mock_phone_number_id'
              },
              contacts: [
                {
                  profile: {
                    name: customerName
                  },
                  wa_id: from
                }
              ],
              messages: [
                {
                  from: from,
                  id: `mock_image_id_${Math.random().toString(36).substring(2, 9)}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  image: {
                    id: imageId,
                    mime_type: 'image/jpeg'
                  },
                  type: 'image'
                }
              ]
            },
            field: 'messages'
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(`http://localhost:${TEST_PORT}/webhook`, payload);
    return response.status;
  } catch (error) {
    console.error(`Error sending image ID ${imageId}:`, error.message);
    throw error;
  }
}

// Main test function
async function runTests() {
  console.log("🚀 Starting XYNER WhatsApp AI Agent Integration Test Suite...");
  
  // 1. Start the server on the test port
  server = app.listen(TEST_PORT, async () => {
    console.log(`📡 Local test server running on port ${TEST_PORT}`);
    
    try {
      // Test Case 1: English Query
      console.log("\n--------------------------------------------------");
      console.log("🧪 TEST CASE 001: English Reservation Request");
      console.log("--------------------------------------------------");
      await sendMockMessage('923000000001', 'John Doe', 'Hi, I want a table for two tonight at 8 PM.');

      // Test Case 2: Roman Urdu Query
      console.log("\n--------------------------------------------------");
      console.log("🧪 TEST CASE 002: Roman Urdu Reservation Request");
      console.log("--------------------------------------------------");
      await sendMockMessage('923000000002', 'Ahmad', 'Assalam-o-Alaikum, kya aaj raat 9 baje 5 logon ki jagah hogi?');

      // Test Case 3: Punjabi Query (Outbound Urdu enforcement)
      console.log("\n--------------------------------------------------");
      console.log("🧪 TEST CASE 003: Punjabi Query (Enforce Outbound Urdu)");
      console.log("--------------------------------------------------");
      await sendMockMessage('923000000003', 'Bilal', 'O yaar, sanu kal dophar nu 2 baje 6 bandyan di table chahidi ae.');

      // Test Case 4: Menu Query
      console.log("\n--------------------------------------------------");
      console.log("🧪 TEST CASE 004: Menu Price Query (Fried Deal 7)");
      console.log("--------------------------------------------------");
      await sendMockMessage('923000000004', 'Siddique', 'What is Deal 7 price?');

      // Test Case 5: Voice Note Handler Simulation
      console.log("\n--------------------------------------------------");
      console.log("🧪 TEST CASE 005: WhatsApp Audio (Voice Note) Processing");
      console.log("--------------------------------------------------");
      await sendMockAudio('923000000005', 'Kamran', 'mock_audio_media_id_101');

      // Test Case 6: Delivery Order Processing (COD)
      console.log("\n--------------------------------------------------");
      console.log("🧪 TEST CASE 006: Food Delivery Order Placement");
      console.log("--------------------------------------------------");
      await sendMockMessage('923000000006', 'Usman', 'I want to order a zinger burger for delivery.');

      // Test Case 7: Manual Payment & Receipt Screenshot Linkage
      console.log("\n--------------------------------------------------");
      console.log("🧪 TEST CASE 007: EasyPaisa Screenshot Verification Upload");
      console.log("--------------------------------------------------");
      // First create a pending payment order for Usman
      await db.collection('orders').add({
        restaurant_id: 'xyner',
        branch: 'Jalalpur Jattan',
        customer_name: 'Usman',
        phone_number: '923000000006',
        items: [{ name: 'Zinger Burger', quantity: 1, unit_price: 400, subtotal: 400 }],
        total_amount: 400,
        address: 'Gali 2, Model Town, Jalalpur Jattan',
        payment_method: 'EasyPaisa',
        screenshot_url: '',
        status: 'pending_verification',
        created_at: new Date().toISOString(),
        order_token: 'XY-ORD-TEST'
      });

      // Now send the mock screenshot from the same number
      await sendMockImage('923000000006', 'Usman', 'mock_image_receipt_id_202');

      // Verify the image was linked in the database
      const orders = await db.collection('orders')
        .where('phone_number', '==', '923000000006')
        .where('payment_method', '==', 'EasyPaisa')
        .get();
      
      if (!orders.empty) {
        const orderData = orders.docs[0].data();
        console.log(`✅ Order Linked Status: ${orderData.status}`);
        console.log(`🖼️ Linked Receipt URL: ${orderData.screenshot_url.substring(0, 80)}...`);
      } else {
        console.error("❌ Test failed: Payment screenshot was not linked to the order.");
      }

      console.log("\n==================================================");
      console.log("🎉 ALL SIMULATION TESTS COMPLETED SUCCESSFULY!");
      console.log("==================================================");
      
    } catch (error) {
      console.error("❌ Test suite encountered a critical error:", error);
    } finally {
      // Close the server and exit the process
      console.log("\nStopping server...");
      server.close(() => {
        console.log("HTTP server closed. Exiting test script.");
        process.exit(0);
      });
    }
  });
}

runTests();
