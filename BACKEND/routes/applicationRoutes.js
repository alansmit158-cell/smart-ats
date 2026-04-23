const express = require('express');
const router = express.Router();
const { 
    applyToJob, 
    getApplications, 
    updateApplication 
} = require('../controllers/applicationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getApplications)
    .post(protect, applyToJob);

router.route('/:id')
    .put(protect, updateApplication);

module.exports = router;
