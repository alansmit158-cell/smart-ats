const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    uploadAndParse, 
    getAllCandidates, 
    getCandidateById, 
    getMyProfile,
    detectAnomalies 
} = require('../controllers/candidateController');

// Configuration de multer (stockage en mémoire pour passage direct à pdf-parse)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite à 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Format non supporté. Seul le PDF est autorisé.'));
        }
    }
});

// Middleware local pour gérer les erreurs Multer
const handleUpload = (req, res, next) => {
    const uploadMiddleware = upload.single('cv');
    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Erreur d'upload: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// =============================================================================
// ROUTES
// =============================================================================

// @desc    Upload un CV (PDF), extrait le texte et l'analyse via OpenAI (NER)
// @route   POST /api/candidates/upload
// @access  Public (pour l'instant)
router.post('/upload', handleUpload, uploadAndParse);

// @desc    Récupérer tous les candidats analysés
// @route   GET /api/candidates
// @access  Public
router.get('/', getAllCandidates);

const { protect } = require('../middlewares/authMiddleware');

// @desc    Récupérer mon propre profil candidat
// @route   GET /api/candidates/me
// @access  Private
router.get('/me', protect, getMyProfile);

// @desc    Récupérer un candidat spécifique
router.get('/:id', getCandidateById);

// @desc    Détecter les anomalies dans un CV via IA
// @route   POST /api/candidates/:id/detect-anomalies
// @access  Private (Recruiter/Admin)
router.post('/:id/detect-anomalies', protect, detectAnomalies);

module.exports = router;
