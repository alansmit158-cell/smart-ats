const express = require('express');
const router = express.Router();
const { matchCandidateToJob, matchAllCandidatesToJob } = require('../controllers/matchingController');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Calcule le score de matching pour 1 candidat + 1 offre
// @route   POST /api/matching/score
// @access  Private
router.post('/score', protect, matchCandidateToJob);

// @desc    Calcule et classe tous les candidats pour une offre donnée
// @route   POST /api/matching/job/:jobId
// @access  Private
router.post('/job/:jobId', protect, matchAllCandidatesToJob);

module.exports = router;
