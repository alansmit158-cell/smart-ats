const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/:candidateId', getMessages);

module.exports = router;
