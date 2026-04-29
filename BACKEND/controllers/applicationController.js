const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Candidate only)
const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // 1. Vérifier si le candidat a un profil/CV parsé
        const candidateProfile = await Candidate.findOne({ user: req.user.id });
        if (!candidateProfile) {
            return res.status(400).json({ 
                success: false, 
                message: "Veuillez d'abord uploader votre CV pour pouvoir postuler." 
            });
        }

        // 2. Vérifier si l'offre existe
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Offre d'emploi non trouvée." });
        }

        // 3. Vérifier les doublons
        const alreadyApplied = await Application.findOne({ 
            candidate: candidateProfile._id, 
            job: jobId 
        });
        if (alreadyApplied) {
            return res.status(400).json({ success: false, message: "Vous avez déjà postulé à cette offre." });
        }

        // 4. Créer la candidature
        const application = await Application.create({
            candidate: candidateProfile._id,
            job: jobId,
            cv: candidateProfile._id, // Le CV est le profil candidat lui-même dans cette architecture
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            data: application,
            message: "Candidature envoyée avec succès !"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
const getMyApplications = async (req, res) => {
    try {
        const candidateProfile = await Candidate.findOne({ user: req.user.id });
        if (!candidateProfile) {
            return res.status(200).json({ success: true, data: [] });
        }

        const applications = await Application.find({ candidate: candidateProfile._id })
            .populate('job', 'titre lieu salaire recruiter description')
            .sort({ dateDepot: -1 });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// @desc    Get applications for a specific job with filters
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { status, scoreMin, scoreMax, sortBy, order } = req.query;

        // Vérifier si l'offre appartient au recruteur
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Offre non trouvée." });
        }

        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Non autorisé à voir ces candidatures." });
        }

        // Construction du filtre
        let filter = { job: jobId };
        if (status) filter.status = status;
        if (scoreMin || scoreMax) {
            filter.scoreMatching = {};
            if (scoreMin) filter.scoreMatching.$gte = Number(scoreMin);
            if (scoreMax) filter.scoreMatching.$lte = Number(scoreMax);
        }

        // Construction du tri
        let sort = {};
        if (sortBy === 'score') sort.scoreMatching = order === 'asc' ? 1 : -1;
        else if (sortBy === 'date') sort.dateDepot = order === 'asc' ? 1 : -1;
        else sort.scoreMatching = -1; // Default sorting by highest score

        const applications = await Application.find(filter)
            .populate({
                path: 'candidate',
                populate: { path: 'user', select: 'nom email' }
            })
            .populate('cv')
            .sort(sort);

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Reviewed', 'Interviewed', 'Rejected', 'Accepted'].includes(status)) {
            return res.status(400).json({ success: false, message: "Statut invalide." });
        }

        const application = await Application.findById(id).populate('job');
        if (!application) {
            return res.status(404).json({ success: false, message: "Candidature non trouvée." });
        }

        // Vérifier si le recruteur est propriétaire de l'offre
        if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Non autorisé." });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            data: application,
            message: `Statut mis à jour : ${status}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

module.exports = {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
};
