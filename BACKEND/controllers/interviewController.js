const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const { sendInterviewEmail } = require('../utils/emailService');

// @desc    Create a new interview and send email
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res) => {
    try {
        const { candidateId, jobId, date, type, meetLink, location, notes } = req.body;

        // Verify Candidate
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        // Create Interview
        const interview = new Interview({
            candidate: candidateId,
            job: jobId || null, // Optional
            date,
            type,
            meetLink: type === 'Online' ? meetLink : '',
            location: type === 'In-Person' ? location : '',
            notes
        });

        await interview.save();

        // Send Email using Nodemailer
        if (candidate.email) {
            await sendInterviewEmail(candidate.email, candidate.name, {
                date,
                type,
                meetLink: interview.meetLink,
                location: interview.location
            });
        }

        res.status(201).json({ success: true, data: interview, message: 'Interview scheduled and email sent' });
    } catch (error) {
        console.error('Error creating interview:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find()
            .populate('candidate', 'name email phone fileName')
            .populate('job', 'title department')
            .sort({ date: 1 }); // Sort by upcoming

        res.status(200).json({ success: true, data: interviews });
    } catch (error) {
        console.error('Error fetching interviews:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update interview status (Scheduled, Completed, Cancelled)
// @route   PUT /api/interviews/:id/status
// @access  Private
const updateInterviewStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const interview = await Interview.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        res.status(200).json({ success: true, data: interview });
    } catch (error) {
        console.error('Error updating interview:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createInterview,
    getInterviews,
    updateInterviewStatus
};
