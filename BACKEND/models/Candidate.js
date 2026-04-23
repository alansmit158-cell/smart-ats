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
    experiences: [experienceSchema],
    formations: [formationSchema],
    skills: [{
        type: String,
        trim: true
    }],
    rawText: { type: String, default: '' },
    fileName: { type: String, default: '' }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Candidate', candidateSchema);
