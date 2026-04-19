const express = require('express');
const router = express.Router();
const {
    generateKit,
    getKit
} = require('../controllers/kitController');
const { protect } = require('../middlewares/authMiddleware');

// Toutes les routes sont protégées (nécessite d'être connecté)
router.use(protect);

router.post('/generate/:interviewId', generateKit);
router.get('/:interviewId', getKit);

module.exports = router;
