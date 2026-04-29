const Message = require('../models/Message');

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/:candidateId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: candidateId },
                { sender: candidateId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
        return res.status(400).json({ message: 'Veuillez fournir un destinataire et un contenu' });
    }

    try {
        const message = await Message.create({
            sender: req.user.id,
            receiver,
            content
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = {
    getMessages,
    sendMessage
};
