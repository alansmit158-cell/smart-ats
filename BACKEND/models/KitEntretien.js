const mongoose = require('mongoose');

const kitEntretienSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
        unique: true
    },
    resumeIA: {
        type: String,
        required: true,
        trim: true
    },
    questionsTechniques: [{
        type: String,
        trim: true
    }],
    pointsVigilance: [{
        type: String,
        trim: true
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('KitEntretien', kitEntretienSchema);
