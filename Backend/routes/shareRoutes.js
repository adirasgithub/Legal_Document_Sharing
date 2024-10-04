const express = require('express');
const {
  shareByEmail,
  shareByWhatsApp,
  shareBySMS,
  checkWhatsAppMessageStatus
} = require('../controllers/shareController');

const router = express.Router();

// Share via email, WhatsApp, and SMS routes
router.post('/share/email', shareByEmail);
router.post('/share/whatsapp', shareByWhatsApp);
router.post('/share/sms', shareBySMS);
router.post('/get-status', checkWhatsAppMessageStatus);


module.exports = router;
