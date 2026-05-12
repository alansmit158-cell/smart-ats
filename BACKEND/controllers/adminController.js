const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs.' });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
        
        // Add status logic here if User schema supports status, or fallback to role logic.
        // Assuming user has a 'status' field.
        user.status = status;
        await user.save();
        
        res.status(200).json({ success: true, data: user, message: 'Statut mis à jour' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du statut' });
    }
};

const getHealthStats = async (req, res) => {
    try {
        const Candidate = require('../models/Candidate');
        const Job = require('../models/Job');
        const Application = require('../models/Application');

        const usersCount = await User.countDocuments();
        const recruitersCount = await User.countDocuments({ role: 'recruiter' });
        const candidatesCount = await User.countDocuments({ role: 'candidate' });
        const jobsCount = await Job.countDocuments();
        const applicationsCount = await Application.countDocuments();

        const applications = await Application.find({ scoreMatching: { $gt: 0 } });
        const avgScore = applications.length > 0 
            ? (applications.reduce((acc, curr) => acc + curr.scoreMatching, 0) / applications.length).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                users: usersCount,
                candidates: candidatesCount,
                recruiters: recruitersCount,
                jobs: jobsCount,
                applications: applicationsCount,
                avgScore: parseFloat(avgScore)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors du calcul des stats de santé' });
    }
};

const getOpenAIStats = async (req, res) => {
    // Mock for now as OpenAI API doesn't easily expose billing/usage per key via the Node SDK directly 
    // without using the billing endpoint which requires organization access.
    res.status(200).json({
        success: true,
        data: {
            tokensUsed: 482500,
            tokenLimit: 1000000,
            estimatedCost: 14.28,
            model: "gpt-4o-mini",
            status: "Online"
        }
    });
};

module.exports = { getAllUsers, updateUserStatus, getHealthStats, getOpenAIStats };
