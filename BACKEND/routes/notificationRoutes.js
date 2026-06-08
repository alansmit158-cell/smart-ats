const express = require('express');
const router = express.Router();
const { getNotifications, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// GET  /api/notifications        — fetch all notifications for the current user
router.get('/', getNotifications);

// PATCH /api/notifications/read  — mark all messages as read
router.patch('/read', markAllRead);

module.exports = router;
