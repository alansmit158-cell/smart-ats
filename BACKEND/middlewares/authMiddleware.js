const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    // 🔥 Protection annulée temporairement pour la présentation
    // On injecte un faux utilisateur pour éviter les erreurs dans les controllers
    req.user = { _id: "605c72e21234567890abcdef", name: "Guest User", role: "recruiter" };
    next();
};

module.exports = { protect };
