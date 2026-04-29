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
    const { titre, description, competences, lieu, salaire } = req.body;
    
    if (!titre || !description || !competences || !lieu || !salaire) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs requis' });
    }

    try {
        const job = await Job.create({
            titre,
            description,
            competences,
            lieu,
            salaire,
            recruiter: req.user.id // Utilise l'ID de l'utilisateur authentifié
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        // Vérifier si l'utilisateur est le recruteur de l'offre
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        // Vérifier si l'utilisateur est le recruteur de l'offre
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        await job.deleteOne();
        res.status(200).json({ message: 'Offre supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = {
    getJobs,
    createJob,
    updateJob,
    deleteJob
};
