const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { 
    uploadAndParse, 
    getAllCandidates, 
    getCandidateById, 
    getMyProfile,
    detectAnomalies,
    updateMyProfile,
    getParsingStatus
} = require('../controllers/candidateController');

// 1. Ajouter la création automatique du dossier uploads/
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Améliorer la config Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
    }
  },
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max
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

const { protect } = require('../middlewares/authMiddleware');

// =============================================================================
// ROUTES
// =============================================================================

// @desc    Upload un CV (PDF), extrait le texte et l'analyse via OpenAI (NER)
// @route   POST /api/candidates/upload
// @access  Private (Candidat)
router.post('/upload', protect, handleUpload, uploadAndParse);

// @desc    Récupérer tous les candidats analysés
// @route   GET /api/candidates
// @access  Public
router.get('/', getAllCandidates);

// @desc    Récupérer mon propre profil candidat
// @route   GET /api/candidates/me
// @access  Private
router.get('/me', protect, getMyProfile);

// @desc    Mettre à jour mon profil
// @route   PATCH /api/candidates/me
// @access  Private
router.patch('/me', protect, updateMyProfile);

// @desc    Status du parsing NLP
// @route   GET /api/candidates/status/:candidateId
router.get('/status/:candidateId', protect, getParsingStatus);

// @desc    Récupérer un candidat spécifique
router.get('/:id', getCandidateById);

// @desc    Détecter les anomalies dans un CV via IA
// @route   POST /api/candidates/:id/detect-anomalies
// @access  Private (Recruiter/Admin)
router.post('/:id/detect-anomalies', protect, detectAnomalies);

module.exports = router;
