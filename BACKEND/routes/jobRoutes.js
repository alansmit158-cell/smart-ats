const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getJobs)
    .post(protect, createJob);

router.route('/:id')
    .put(protect, updateJob)
    .delete(protect, deleteJob);

module.exports = router;
