const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getContacts, createContact, replyContact, deleteContact } = require('../controllers/contactController');

router.get('/', getContacts);
router.post('/', createContact);
router.post('/:id/reply', protect, replyContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
