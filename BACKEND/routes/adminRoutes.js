const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, getHealthStats, getOpenAIStats } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');
const workerPool = require('../workers/workerPool');

router.get('/users', protect, admin, getAllUsers);
router.patch('/users/:id/status', protect, admin, updateUserStatus);

router.get('/health-stats', protect, admin, getHealthStats);
router.get('/openai-stats', protect, admin, getOpenAIStats);

router.get('/worker-stats', protect, admin, (req, res) => {
  res.json({
    success: true,
    data: workerPool.getStats()
  });
});

router.get('/audit-logs', protect, admin, (req, res) => {
  res.json({
    success: true,
    data: workerPool.auditLogs
  });
});

module.exports = router;
