const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

// Middleware to ensure user is admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Non autorisé. Rôle administrateur requis.' });
    }
};

const workerPool = require('../workers/workerPool');

router.get('/users', protect, adminOnly, getAllUsers);
router.patch('/users/:id/status', protect, adminOnly, updateUserStatus);
router.get('/worker-stats', protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    data: workerPool.getStats()
  });
});

module.exports = router;
