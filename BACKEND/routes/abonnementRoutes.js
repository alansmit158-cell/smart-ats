const express = require('express');
const router = express.Router();
const { 
    getPlans, 
    subscribe, 
    getMyPlan, 
    cancelSubscription, 
    getAllSubscriptions 
} = require('../controllers/abonnementController');
const { protect } = require('../middlewares/authMiddleware');

// Route publique
router.get('/plans', getPlans);

// Routes protégées
router.use(protect);

router.post('/subscribe', subscribe);
router.get('/my-plan', getMyPlan);

// Routes Admin seulement
const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ success: false, message: "Accès refusé. Administrateur seulement." });
        }
        next();
    };
};

router.get('/all', authorize('admin'), getAllSubscriptions);
router.patch('/:id/cancel', authorize('admin'), cancelSubscription);

module.exports = router;
