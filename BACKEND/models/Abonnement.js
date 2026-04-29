const mongoose = require('mongoose');

const abonnementSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Starter', 'Pro', 'Enterprise'], 
        required: true 
    },
    prix: { 
        type: Number, 
        required: true 
    },
    statut: { 
        type: String, 
        enum: ['active', 'inactive', 'suspended'], 
        default: 'inactive' 
    },
    dateDebut: {
        type: Date
    },
    dateFin: {
        type: Date
    },
    recruteur: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // Un seul abonnement par recruteur
    },
    limiteOffres: {
        type: Number,
        required: true
    },
    limiteAnalyses: {
        type: Number,
        required: true
    },
    offresUtilisees: {
        type: Number,
        default: 0
    },
    analysesUtilisees: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Abonnement', abonnementSchema);
