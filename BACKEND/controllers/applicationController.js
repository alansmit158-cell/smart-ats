const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyToJob = async (req, res) => {
    const { jobId, candidateId } = req.body;

    if (!jobId || !candidateId) {
        return res.status(400).json({ message: 'Veuillez fournir jobId et candidateId' });
    }

    try {
        // Check if already applied
        const existingApp = await Application.findOne({ job: jobId, candidate: candidateId });
        if (existingApp) {
            return res.status(400).json({ message: 'Vous avez déjà postulé à cette offre' });
        }

        const application = await Application.create({
            job: jobId,
            candidate: candidateId,
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// @desc    Get all applications (with population)
// @route   GET /api/applications
// @access  Private (Recruiter/Admin)
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({
                path: 'candidate',
                populate: { path: 'user', select: 'nom email' }
            })
            .populate('job', 'titre lieu');

        res.json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// @desc    Update application status or score
// @route   PUT /api/applications/:id
// @access  Private (Recruiter/Admin)
const updateApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Candidature non trouvée' });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = {
    applyToJob,
    getApplications,
    updateApplication
};
