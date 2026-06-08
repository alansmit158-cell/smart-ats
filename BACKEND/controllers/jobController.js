const Job = require('../models/Job');
const Abonnement = require('../models/Abonnement');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        
        // If logged-in user is a candidate, inject their compatibility scores
        if (req.user && req.user.role === 'candidate') {
            const Candidate = require('../models/Candidate');
            const candidate = await Candidate.findOne({ user: req.user.id });
            if (candidate && candidate.jobMatchings) {
                const jobsWithScore = jobs.map(job => {
                    const match = candidate.jobMatchings.find(m => m.job.toString() === job._id.toString());
                    const jobObj = job.toObject();
                    jobObj.compatibilityScore = match ? match.score : 0;
                    return jobObj;
                });
                return res.status(200).json(jobsWithScore);
            }
        }

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    let { titre, description, competences, lieu, salaire } = req.body;
    
    if (!titre || !description || !competences || !lieu || !salaire) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs requis' });
    }

    if (description.trim().length < 200) {
        return res.status(400).json({ message: "La description de l'offre est obligatoire et doit contenir au moins 200 caractères." });
    }

    // Conversion des compétences en tableau si c'est une chaîne
    if (typeof competences === 'string') {
        competences = competences.split(',').map(s => s.trim()).filter(s => s !== '');
    }

    // Nettoyage du salaire (enlever les symboles € et k pour la conversion en nombre)
    if (typeof salaire === 'string') {
        const numericSalaire = parseInt(salaire.replace(/[^0-9]/g, ''));
        salaire = isNaN(numericSalaire) ? 0 : numericSalaire;
    }

    try {
        const abonnement = await Abonnement.findOne({ recruteur: req.user.id });
        if (!abonnement || abonnement.status !== 'active') {
            return res.status(403).json({ message: "Vous n'avez pas d'abonnement actif." });
        }
        
        if (abonnement.jobsCreated >= abonnement.jobLimit && abonnement.jobLimit !== 9999) {
            return res.status(403).json({ message: "Quota d'offres atteint. Veuillez mettre à niveau votre abonnement." });
        }

        const job = await Job.create({
            titre,
            description,
            competences,
            lieu,
            salaire,
            recruiter: req.user.id
        });
        
        abonnement.jobsCreated += 1;
        await abonnement.save();

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

        if (req.body.description !== undefined && (!req.body.description || req.body.description.trim().length < 200)) {
            return res.status(400).json({ message: "La description de l'offre est obligatoire et doit contenir au moins 200 caractères." });
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
        
        // Décrémenter le quota
        const abonnement = await Abonnement.findOne({ recruteur: req.user.id });
        if (abonnement && abonnement.jobsCreated > 0) {
            abonnement.jobsCreated -= 1;
            await abonnement.save();
        }
        
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
