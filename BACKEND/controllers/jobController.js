const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    const { title, department, location, type, description, requirements, status } = req.body;
    
    if (!title || !department || !location || !description) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const job = await Job.create({
            title,
            department,
            location,
            type,
            description,
            requirements,
            status,
            createdBy: req.user.id // Requires auth middleware
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getJobs,
    createJob
};
