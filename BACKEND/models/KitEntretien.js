const mongoose = require('mongoose');

const questionTechniqueSchema = new mongoose.Schema({
    question: { type: String, trim: true },
    expectedAnswer: { type: String, trim: true },
    difficulty: { type: String, trim: true }
}, { _id: false });

const pointVigilanceSchema = new mongoose.Schema({
    contenu: { type: String, trim: true }
}, { _id: false });

const resumeIASchema = new mongoose.Schema({
    summary: { type: String, trim: true },
    strengths: [{ type: String, trim: true }],
    weaknesses: [{ type: String, trim: true }],
    recommendation: { type: String, enum: ['hire', 'reject', 'hold'] }
}, { _id: false });

const kitEntretienSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
        unique: true
    },
    resumeIA: resumeIASchema,
    questionsTechniques: [questionTechniqueSchema],
    pointsVigilance: [pointVigilanceSchema]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('KitEntretien', kitEntretienSchema);
