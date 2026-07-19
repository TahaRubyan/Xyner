const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const webhookController = require('./controllers/webhook.controller');

const app = express();

// Parse JSON payloads (essential for WhatsApp webhooks)
app.use(express.json());

// Serve static assets from the compiled React frontend folder
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date() });
});

// WhatsApp Webhook routes
app.get('/webhook', webhookController.verifyWebhook);
app.post('/webhook', webhookController.receiveMessage);

// SPA fallback: Send all other GET requests to the React index.html page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

module.exports = app;
