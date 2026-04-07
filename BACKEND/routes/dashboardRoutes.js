const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// Using protect middleware to assume only logged in users can see dashboard stats
router.get('/stats', protect, getDashboardStats);

module.exports = router;
