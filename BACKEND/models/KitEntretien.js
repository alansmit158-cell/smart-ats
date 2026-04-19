const mongoose = require('mongoose');

const KitEntretienSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
        unique: true // Un seul kit par entretien
    },
    resume_profil: {
        type: String,
        required: true
    },
    questions: [{
        type: String
    }],
    points_vigilance: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('KitEntretien', KitEntretienSchema);
