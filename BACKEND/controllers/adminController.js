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

module.exports = { getAllUsers, updateUserStatus };
