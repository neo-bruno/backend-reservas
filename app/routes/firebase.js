const { Router } = require('express');
const {
  sendOtpController,
  verifyOtpController
} = require('../controllers/firebase.controllers');

const router = Router();

router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);

module.exports = router;
