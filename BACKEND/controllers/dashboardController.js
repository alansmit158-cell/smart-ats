const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Interview = require('../models/Interview');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (or Public for now depending on auth setup)
const getDashboardStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const totalCandidates = await Candidate.countDocuments();
        
        // Dynamic fetch of interviews
        const interviewsScheduled = await Interview.countDocuments({ status: 'Scheduled' });
        
        const upcomingInterviews = await Interview.find({ status: 'Scheduled' })
            .populate({
                path: 'candidate',
                populate: { path: 'user', select: 'nom' }
            })
            .populate('job', 'titre')
            .sort({ date: 1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                totalJobs,
                totalCandidates,
                interviewsScheduled,
                upcomingInterviews: upcomingInterviews.map(i => ({
                    _id: i._id,
                    candidateName: i.candidate?.user?.nom || 'Inconnu',
                    jobTitle: i.job?.titre || 'Poste non spécifié',
                    date: i.date,
                    type: i.type
                }))
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
