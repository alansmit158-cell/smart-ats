const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    requirements: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        default: 'Active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
