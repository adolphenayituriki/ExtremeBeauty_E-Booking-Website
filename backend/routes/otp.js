const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp } = require('../controllers/otpController');

router.post('/request', requestOtp);
router.post('/verify', verifyOtp);

module.exports = router;
