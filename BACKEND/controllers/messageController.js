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

// @desc    Get all unique conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find messages where user is either sender or receiver
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ createdAt: -1 });

        // Extract unique user IDs from messages
        const conversationUserIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== userId) conversationUserIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== userId) conversationUserIds.add(msg.receiver.toString());
        });

        const User = require('../models/User');
        const users = await User.find({ _id: { $in: Array.from(conversationUserIds) } }).select('nom email role');

        // Add last message and unread count
        const conversations = users.map(user => {
            const lastMsg = messages.find(m => 
                (m.sender.toString() === user._id.toString() && m.receiver.toString() === userId) ||
                (m.sender.toString() === userId && m.receiver.toString() === user._id.toString())
            );
            return {
                user,
                lastMessage: lastMsg ? lastMsg.content : '',
                lastMessageDate: lastMsg ? lastMsg.createdAt : null
            };
        });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    getConversations
};
