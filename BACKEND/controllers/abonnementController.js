const Abonnement = require('../models/Abonnement');
const User = require('../models/User');

// @desc    Get all available plans
// @route   GET /api/abonnements/plans
// @access  Public
const getPlans = (req, res) => {
    const plans = [
        {
            id: 'starter',
            type: 'Starter',
            prix: 49,
            limiteOffres: 5,
            limiteAnalyses: 50,
            features: ['5 Offres actives', 'Analyses IA Standard', 'Support Email', 'Dashboard Recruteur']
        },
        {
            id: 'pro',
            type: 'Pro',
            prix: 149,
            limiteOffres: 20,
            limiteAnalyses: 500,
            features: ['20 Offres actives', 'Analyses IA Prioritaires', 'Support 24/7', 'Matching Avancé', 'Export de données']
        },
        {
            id: 'enterprise',
            type: 'Enterprise',
            prix: 499,
            limiteOffres: 9999,
            limiteAnalyses: 99999,
            features: ['Offres Illimitées', 'Analyses IA Custom', 'Accès API Full', 'Account Manager dédié', 'Formation équipe']
        }
    ];
    res.status(200).json({ success: true, data: plans });
};

// @desc    Subscribe to a plan
// @route   POST /api/abonnements/subscribe
// @access  Private (Recruiter)
const subscribe = async (req, res) => {
    try {
        const { planType } = req.body;
        
        let limiteOffres, limiteAnalyses, prix;
        
        switch (planType) {
            case 'Starter':
                limiteOffres = 5;
                limiteAnalyses = 50;
                prix = 49;
                break;
            case 'Pro':
                limiteOffres = 20;
                limiteAnalyses = 500;
                prix = 149;
                break;
            case 'Enterprise':
                limiteOffres = 9999;
                limiteAnalyses = 99999;
                prix = 499;
                break;
            default:
                return res.status(400).json({ success: false, message: "Type de plan invalide." });
        }

        const dateDebut = new Date();
        const dateFin = new Date();
        dateFin.setMonth(dateFin.getMonth() + 1); // 1 mois d'abonnement

        // Chercher si un abonnement existe déjà
        let abonnement = await Abonnement.findOne({ recruteur: req.user.id });

        if (abonnement) {
            abonnement.type = planType;
            abonnement.prix = prix;
            abonnement.statut = 'active';
            abonnement.dateDebut = dateDebut;
            abonnement.dateFin = dateFin;
            abonnement.limiteOffres = limiteOffres;
            abonnement.limiteAnalyses = limiteAnalyses;
            await abonnement.save();
        } else {
            abonnement = await Abonnement.create({
                type: planType,
                prix,
                statut: 'active',
                dateDebut,
                dateFin,
                recruteur: req.user.id,
                limiteOffres,
                limiteAnalyses
            });
        }

        res.status(200).json({
            success: true,
            data: abonnement,
            message: `Abonnement ${planType} activé avec succès !`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// @desc    Get recruiter's current plan
// @route   GET /api/abonnements/my-plan
// @access  Private (Recruiter)
const getMyPlan = async (req, res) => {
    try {
        const abonnement = await Abonnement.findOne({ recruteur: req.user.id });
        if (!abonnement) {
            return res.status(200).json({ success: true, data: null, message: "Aucun abonnement actif." });
        }
        res.status(200).json({ success: true, data: abonnement });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// @desc    Cancel/Suspend subscription
// @route   PATCH /api/abonnements/:id/cancel
// @access  Private (Admin)
const cancelSubscription = async (req, res) => {
    try {
        const abonnement = await Abonnement.findById(req.params.id);
        if (!abonnement) {
            return res.status(404).json({ success: false, message: "Abonnement non trouvé." });
        }

        abonnement.statut = 'suspended';
        await abonnement.save();

        res.status(200).json({ success: true, message: "Abonnement suspendu." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// @desc    Get all subscriptions
// @route   GET /api/abonnements/all
// @access  Private (Admin)
const getAllSubscriptions = async (req, res) => {
    try {
        const abonnements = await Abonnement.find().populate('recruteur', 'nom email');
        res.status(200).json({ success: true, data: abonnements });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

module.exports = {
    getPlans,
    subscribe,
    getMyPlan,
    cancelSubscription,
    getAllSubscriptions
};
