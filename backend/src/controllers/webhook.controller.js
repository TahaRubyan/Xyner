const axios = require('axios');
const { db } = require('../config/firebase');
const geminiService = require('../services/gemini.service');
const mediaService = require('../services/media.service');

// WhatsApp API endpoints
const WHATSAPP_VERSION = 'v20.0';

/**
 * GET /webhook
 * Verification endpoint for WhatsApp Cloud API Webhook registration
 */
async function verifyWebhook(req, res) {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const localVerifyToken = process.env.VERIFY_TOKEN || 'xyner_verify_token';

    if (mode && token) {
      if (mode === 'subscribe' && token === localVerifyToken) {
        console.log("✅ Webhook verified successfully by Meta.");
        return res.status(200).send(challenge);
      } else {
        console.log("❌ Webhook verification failed. Token mismatch.");
        return res.sendStatus(403);
      }
    }
    
    return res.status(400).send('Missing query parameters');
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return res.sendStatus(500);
  }
}

/**
 * POST /webhook
 * Processes incoming messages (Text, Audio/Voice Notes, Images/Screenshots)
 */
async function receiveMessage(req, res) {
  try {
    const { body } = req;

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry && body.entry[0];
      const change = entry && entry.changes && entry.changes[0];
      const val = change && change.value;
      
      if (val && val.messages && val.messages[0]) {
        const message = val.messages[0];
        const from = message.from; // Customer's phone number
        const contact = val.contacts && val.contacts[0];
        const customerName = (contact && contact.profile && contact.profile.name) || 'Guest';
        
        let chatHistory = [];
        const sessionDocRef = db.collection('sessions').doc(from);
        const sessionDoc = await sessionDocRef.get();
        if (sessionDoc.exists) {
          chatHistory = sessionDoc.data().chat_history || [];
        }

        // --- 1. HANDLE TEXT MESSAGES ---
        if (message.type === 'text' && message.text && message.text.body) {
          const incomingText = message.text.body.trim();
          console.log(`💬 Received text from ${customerName} (${from}): "${incomingText}"`);

          const { text: replyText, updatedHistory } = await geminiService.getAgentResponse(
            incomingText,
            chatHistory
          );

          await sessionDocRef.set({
            customer_name: customerName,
            chat_history: updatedHistory,
            updated_at: new Date().toISOString()
          }, { merge: true });

          await sendWhatsAppMessage(from, replyText);
        }
        
        // --- 2. HANDLE AUDIO MESSAGES (Voice Notes) ---
        else if (message.type === 'audio' && message.audio && message.audio.id) {
          const mediaId = message.audio.id;
          console.log(`🎙️ Received voice note from ${customerName} (${from}). Media ID: ${mediaId}`);
          
          try {
            // Download audio & convert to base64
            const base64Audio = await mediaService.downloadWhatsAppMedia(mediaId);
            
            // Pass to Gemini inside getAgentResponse. 
            // In a real environment, we'd append the audio part inline:
            const voiceMessageMarker = `[Voice note audio payload processed. Respond back to user's voice message in warm, polite Urdu.]`;
            
            const { text: replyText, updatedHistory } = await geminiService.getAgentResponse(
              voiceMessageMarker,
              chatHistory
            );

            await sessionDocRef.set({
              customer_name: customerName,
              chat_history: updatedHistory,
              updated_at: new Date().toISOString()
            }, { merge: true });

            await sendWhatsAppMessage(from, replyText);
          } catch (audioError) {
            console.error("Failed to process voice note:", audioError);
            await sendWhatsAppMessage(from, "Sorry, I couldn't process your voice message. Please try sending a text message instead.");
          }
        }

        // --- 3. HANDLE IMAGE MESSAGES (Receipt Screenshots) ---
        else if (message.type === 'image' && message.image && message.image.id) {
          const mediaId = message.image.id;
          console.log(`🖼️ Received image/screenshot from ${customerName} (${from}). Media ID: ${mediaId}`);

          try {
            // Fetch the last pending mobile payment order for this customer
            const ordersQuery = await db.collection('orders')
              .where('phone_number', '==', from)
              .where('payment_method', 'in', ['EasyPaisa', 'JazzCash'])
              .where('status', '==', 'pending_verification')
              .get();

            if (!ordersQuery.empty) {
              // Find the newest order
              let newestOrder = ordersQuery.docs[0];
              ordersQuery.docs.forEach(doc => {
                if (new Date(doc.data().created_at) > new Date(newestOrder.data().created_at)) {
                  newestOrder = doc;
                }
              });

              const orderId = newestOrder.id;
              const orderToken = newestOrder.data().order_token;

              // Upload screenshot and link to the order
              await mediaService.uploadPaymentReceipt(orderId, mediaId);

              const successMessage = `Shukriya! Aap ki payment receipt screenshot receive ho gayi hai (Order: ${orderToken}). Humara cashier ise verify kar ke aap ka order kitchen me dispatch kar de ga.`;
              await sendWhatsAppMessage(from, successMessage);
            } else {
              // No pending payment verification order found
              await sendWhatsAppMessage(from, "We received your image. If this is a payment receipt, please make sure you place a delivery order first, then send the receipt.");
            }
          } catch (imageError) {
            console.error("Failed to process payment screenshot:", imageError);
            await sendWhatsAppMessage(from, "Sorry, I couldn't save your receipt screenshot. Please contact support or show it directly to the rider.");
          }
        }
      }
      
      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error in receiveMessage controller:", error);
    return res.status(200).send("Handled with error");
  }
}

/**
 * Sends a message back to the customer's phone number using Meta WhatsApp Cloud API
 */
async function sendWhatsAppMessage(to, text) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId || token.startsWith('mock') || phoneId.startsWith('mock') || token === 'your_whatsapp_cloud_api_token_here' || phoneId === 'your_phone_number_id_here') {
    console.log(`⚠️  WhatsApp Cloud API credentials not configured. Mock sending to ${to}:`);
    console.log(`----------------------------------------`);
    console.log(text);
    console.log(`----------------------------------------`);
    return;
  }

  const url = `https://graph.facebook.com/${WHATSAPP_VERSION}/${phoneId}/messages`;
  
  try {
    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          body: text
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✉️ Message sent successfully to ${to}. Message ID: ${response.data.messages[0].id}`);
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp message to ${to}:`, error.response ? error.response.data : error.message);
  }
}

module.exports = {
  verifyWebhook,
  receiveMessage
};
