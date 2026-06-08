const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    titre: { type: String, trim: true },
    entreprise: { type: String, trim: true },
    dateDebut: { type: Date },
    dateFin: { type: Date },
    description: { type: String, trim: true }
}, { _id: false });

const formationSchema = new mongoose.Schema({
    diplome: { type: String, trim: true },
    etablissement: { type: String, trim: true },
    dateDebut: { type: Date },
    dateFin: { type: Date }
}, { _id: false });

const candidateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    prenom: { type: String, trim: true, default: '' },
    nom: { type: String, trim: true, default: '' },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    experiences: [experienceSchema],
    formations: [formationSchema],
    skills: [{
        type: String,
        trim: true
    }],
    rawText: { type: String, default: '' },
    fileName: { type: String, default: '' },
    anomalies: [
        {
            type: { type: String },
            severite: { type: String, enum: ['faible', 'moyenne', 'elevee'] },
            description: { type: String },
            element_concerne: { type: String },
            recommandation: { type: String }
        }
    ],
    scoreFiabilite: { type: Number, default: 100 },
    resumeAnomalies: { type: String, default: '' },
    jobMatchings: [
        {
            job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
            score: { type: Number, default: 0 },
            verdict: { type: String, default: '' },
            summary: { type: String, default: '' },
            strengths: [{ type: String }],
            gaps: [{ type: String }],
            recommendation: { type: String, default: '' }
        }
    ]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Candidate', candidateSchema);
