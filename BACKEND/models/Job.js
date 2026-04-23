const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    competences: [{
        type: String,
        required: true,
        trim: true
    }],
    lieu: {
        type: String,
        required: true,
        trim: true
    },
    salaire: {
        type: Number,
        required: true
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Job', jobSchema);
