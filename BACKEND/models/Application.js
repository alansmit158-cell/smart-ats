const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Scored', 'Reviewed', 'Interviewed', 'Rejected', 'Accepted'],
        default: 'Pending',
        required: true
    },
    cv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    scoreMatching: {
        type: Number,
        default: 0
    },
    interviewKit: {
        resumeIA: { type: String, default: '' },
        questionsTechniques: [{ type: String }],
        pointsVigilance: [{ type: String }]
    },
    dateDepot: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Application', applicationSchema);
