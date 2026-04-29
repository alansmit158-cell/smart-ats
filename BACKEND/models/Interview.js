const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema(
    {
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
        },
        job: { // Optional, in case the interview is not linked to a specific job vacancy yet
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
        },
        date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ['Online', 'In-Person'],
            default: 'Online'
        },
        meetLink: {
            type: String,
            default: ''
        },
        location: { // For In-Person
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled'],
            default: 'Scheduled'
        },
        notes: {
            type: String,
            default: ''
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        finalNotes: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Interview', InterviewSchema);
