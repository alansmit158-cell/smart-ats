const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// ⚠️ CES ROUTES NE DOIVENT PAS AVOIR protect COMME MIDDLEWARE
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
