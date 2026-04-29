const express = require('express');
const router = express.Router();
const { 
    applyToJob, 
    getMyApplications, 
    getJobApplications, 
    updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// Routes pour les candidats
router.post('/apply/:jobId', applyToJob);
router.get('/my-applications', getMyApplications);

// Routes pour les recruteurs
router.get('/job/:jobId', getJobApplications);
router.patch('/:id/status', updateApplicationStatus);

module.exports = router;
