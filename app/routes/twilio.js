const { Router } = require('express');
const {
  sendOtpController,
  verifyOtpAndRegisterController
} = require('../controllers/twilio.controllers');

const router = Router();

router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpAndRegisterController);

module.exports = router;
