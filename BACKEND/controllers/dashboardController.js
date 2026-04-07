const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (or Public for now depending on auth setup)
const getDashboardStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const totalCandidates = await Candidate.countDocuments();

        res.json({
            success: true,
            data: {
                totalJobs,
                totalCandidates,
                // Static count for interviews scheduled for now
                interviewsScheduled: 42 
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getDashboardStats
};
