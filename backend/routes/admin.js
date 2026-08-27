const express = require('express');
const router = express.Router();
const {
  registerAdmin, loginAdmin, getMe, updateProfile,
  getAdmins, createAdmin, updateAdmin, deleteAdmin,
} = require('../controllers/adminController');
const { getAuditLogs } = require('../controllers/auditController');
const { getNotifications } = require('../controllers/notificationController');
const { protect, requireSuperadmin } = require('../middleware/auth');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

router.get('/admins', protect, requireSuperadmin, getAdmins);
router.post('/admins', protect, requireSuperadmin, createAdmin);
router.put('/admins/:id', protect, requireSuperadmin, updateAdmin);
router.delete('/admins/:id', protect, requireSuperadmin, deleteAdmin);

router.get('/audit', protect, requireSuperadmin, getAuditLogs);
router.get('/notifications', protect, getNotifications);

module.exports = router;
