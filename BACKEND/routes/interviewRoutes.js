const express = require('express');
const router = express.Router();
const {
    createInterview,
    getInterviews,
    updateInterviewStatus
} = require('../controllers/interviewController');
const { protect } = require('../middlewares/authMiddleware');

// Toutes les routes sont protégées (nécessite d'être connecté)
router.use(protect);

router.post('/', createInterview);
router.get('/', getInterviews);
router.put('/:id/status', updateInterviewStatus);

module.exports = router;
