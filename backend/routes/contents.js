const express = require('express');
const router = express.Router();
const { getContent, getAllContent, upsertContent, deleteContent } = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

router.get('/all', getAllContent);
router.get('/:key', getContent);
router.put('/', protect, upsertContent);
router.delete('/:key', protect, deleteContent);

module.exports = router;
