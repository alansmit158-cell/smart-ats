const mongoose = require('mongoose');

// --- Sous-schémas ---

const ExperienceSchema = new mongoose.Schema({
    poste: { type: String, default: '' },
    entreprise: { type: String, default: '' },
    duree: { type: String, default: '' }, // ex: "Jan 2021 - Déc 2023"
    description: { type: String, default: '' },
}, { _id: false });

const FormationSchema = new mongoose.Schema({
    diplome: { type: String, default: '' },
    etablissement: { type: String, default: '' },
    annee: { type: String, default: '' }, // ex: "2020"
}, { _id: false });

// --- Schéma principal ---

const CandidateSchema = new mongoose.Schema(
    {
        // Informations de base extraites par l'IA
        name: { type: String, default: 'Inconnu' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },

        // Compétences techniques et soft skills
        skills: [{ type: String }],

        // Parcours professionnel
        experiences: [ExperienceSchema],

        // Parcours académique
        formations: [FormationSchema],

        // Texte brut extrait du PDF (utile pour re-analyse ou debug)
        rawText: { type: String, default: '' },

        // Nom du fichier CV uploadé
        fileName: { type: String, default: '' },
    },
    {
        timestamps: true, // ajoute createdAt et updatedAt
    }
);

module.exports = mongoose.model('Candidate', CandidateSchema);
