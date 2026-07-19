const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { db } = require('../config/firebase');

const useMock = process.env.USE_FIREBASE_MOCK === 'true';

/**
 * Downloads a WhatsApp media file using Meta API and returns it as a base64 string.
 * @param {string} mediaId - Meta media identifier
 * @returns {Promise<string>} Base64 audio representation
 */
async function downloadWhatsAppMedia(mediaId) {
  const token = process.env.WHATSAPP_TOKEN;

  if (useMock || !token || token.startsWith('mock')) {
    console.log(`⚠️ Mock downloading WhatsApp media ID: ${mediaId}`);
    // Return a mock base64 representing empty audio for testing
    return 'UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA';
  }

  try {
    // 1. Fetch Media URL from WhatsApp Graph API
    const mediaMetadataUrl = `https://graph.facebook.com/v20.0/${mediaId}`;
    const metadataResponse = await axios.get(mediaMetadataUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const downloadUrl = metadataResponse.data.url;
    if (!downloadUrl) {
      throw new Error(`Failed to retrieve download URL for media ID: ${mediaId}`);
    }

    // 2. Download the binary payload
    const binaryResponse = await axios.get(downloadUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'arraybuffer'
    });

    // 3. Convert to base64
    return Buffer.from(binaryResponse.data).toString('base64');
  } catch (error) {
    console.error(`Error downloading WhatsApp media ID ${mediaId}:`, error.message);
    throw error;
  }
}

/**
 * Uploads a local/webhook image payload to Firebase Storage (or returns a mock URL).
 * Links the screenshot to the matching order.
 * @param {string} orderId - Target order database ID
 * @param {string} mediaId - Meta media screenshot identifier
 * @returns {Promise<string>} Public URL of the uploaded image
 */
async function uploadPaymentReceipt(orderId, mediaId) {
  if (useMock) {
    console.log(`⚠️ Mock uploading receipt screenshot ID ${mediaId} for order ${orderId}`);
    const mockUrl = `https://firebasestorage.googleapis.com/v0/b/mock-project/o/receipts%2F${orderId}.jpg?alt=media`;
    
    // Update order status and screenshot URL in database
    await db.collection('orders').doc(orderId).update({
      screenshot_url: mockUrl,
      status: 'pending_verification'
    });
    
    return mockUrl;
  }

  try {
    const token = process.env.WHATSAPP_TOKEN;
    // 1. Download screenshot from Meta
    const mediaMetadataUrl = `https://graph.facebook.com/v20.0/${mediaId}`;
    const metadataResponse = await axios.get(mediaMetadataUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const downloadUrl = metadataResponse.data.url;
    const binaryResponse = await axios.get(downloadUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'arraybuffer'
    });

    // 2. Upload to Firebase Storage
    // In a live environment with firebase-admin, we would write to default bucket:
    // const bucket = admin.storage().bucket();
    // const file = bucket.file(`receipts/${orderId}.jpg`);
    // await file.save(binaryResponse.data, { contentType: 'image/jpeg' });
    // const publicUrl = await file.getSignedUrl({ action: 'read', expires: '03-09-2499' });
    
    // For this prototype, we'll store it as a base64 field inside Firestore itself, or a mock URL, 
    // to keep it functional even if Firebase Storage bucket is not provisioned.
    const base64Image = Buffer.from(binaryResponse.data).toString('base64');
    const imageUri = `data:image/jpeg;base64,${base64Image}`;

    await db.collection('orders').doc(orderId).update({
      screenshot_url: imageUri,
      status: 'pending_verification'
    });

    console.log(`✅ Uploaded payment receipt screenshot to Firestore for order ${orderId}`);
    return imageUri;
  } catch (error) {
    console.error(`Error uploading receipt screenshot:`, error.message);
    throw error;
  }
}

module.exports = {
  downloadWhatsAppMedia,
  uploadPaymentReceipt
};
