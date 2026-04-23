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

module.exports = {
    getJobs,
    createJob
};
