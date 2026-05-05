const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const workerPool = require('../workers/workerPool');

// Initialisation du client OpenAI (utilise process.env.OPENAI_API_KEY)
const openai = new OpenAI();

// =============================================================================
// PROMPT SYSTÈME — Moteur NLP pour extraction de données CV
// Justification : Les CV sont hétérogènes et non-structurés. L'IA normalise
// les données vers un JSON exploitable pour le matching sémantique (Module 2).
// =============================================================================
const SYSTEM_PROMPT = `Tu es un expert en analyse de CV et en ressources humaines.
Ton unique rôle est d'extraire les informations d'un CV et de les retourner en JSON valide.

Tu dois extraire et structurer les informations suivantes :
- "name"        : Nom complet du candidat (string)
- "email"       : Email du candidat (string)
- "phone"       : Numéro de téléphone (string)
- "skills"      : Liste de compétences techniques ET soft skills (tableau de strings)
- "experiences" : Expériences professionnelles (tableau d'objets avec les champs : "poste", "entreprise", "duree", "description")
- "formations"  : Formations académiques (tableau d'objets avec les champs : "diplome", "etablissement", "annee")

RÈGLES STRICTES :
1. Retourne UNIQUEMENT le JSON, sans aucun texte avant ou après.
2. Si une information est absente du CV, utilise une chaîne vide "" ou un tableau vide [].
3. Ne jamais inventer d'informations qui ne sont pas dans le CV.
4. Le JSON doit être parfaitement valide et parseable.

FORMAT DE SORTIE ATTENDU :
{
  "name": "Prénom Nom",
  "email": "email@exemple.com",
  "phone": "+216 XX XXX XXX",
  "skills": ["JavaScript", "React", "Node.js", "Gestion de projet"],
  "experiences": [
    {
      "poste": "Développeur Full Stack",
      "entreprise": "TechCorp",
      "duree": "Jan 2022 - Déc 2023",
      "description": "Développement d'applications web avec React et Node.js"
    }
  ],
  "formations": [
    {
      "diplome": "Licence en Informatique",
      "etablissement": "Université de Tunis",
      "annee": "2021"
    }
  ]
}`;

// =============================================================================
// CONTROLLER : uploadAndParse
// Route : POST /api/candidates/upload
// Body  : multipart/form-data avec champ "cv" (fichier PDF)
// =============================================================================
const uploadAndParse = async (req, res) => {
  try {
    const fs = require('fs');
    
    // 1. Vérifications de base
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier PDF reçu'
      });
    }

    if (!req.user || !req.user.id) {
      // Nettoyer en cas d'erreur
      fs.unlinkSync(req.file.path);
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    // 2. Extraire le texte du PDF (rapide — pas d'IA ici)
    const dataBuffer = fs.readFileSync(req.file.path);
    let pdfText = '';
    
    try {
      const pdfData = await pdfParse(dataBuffer);
      pdfText = pdfData.text;
    } catch (pdfError) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'PDF illisible ou corrompu'
      });
    }

    // Nettoyer le fichier temporaire immédiatement
    fs.unlinkSync(req.file.path);

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Le PDF semble vide. Utilisez un PDF avec du texte sélectionnable.'
      });
    }

    // 3. Créer un candidat "en cours de traitement" en MongoDB
    // RÉPONSE IMMÉDIATE possible grâce au Worker Thread
    let candidate = await Candidate.findOne({ user: req.user.id });
    
    if (!candidate) {
      candidate = await Candidate.create({
        user: req.user.id,
        prenom: 'En cours...',
        nom: '...',
        skills: [],
        experiences: [],
        formations: [],
        status: 'processing',
        fileName: req.file.originalname
      });
    } else {
        // Mettre à jour si existe déjà
        candidate.status = 'processing';
        candidate.fileName = req.file.originalname;
        await candidate.save();
    }

    // 4. Répondre IMMÉDIATEMENT au frontend
    // Le parsing IA continue en arrière-plan dans un Worker Thread
    res.status(202).json({
      success: true,
      message: 'CV reçu. Analyse IA en cours dans un Worker Thread...',
      candidateId: candidate._id,
      status: 'processing'
    });

    // 5. Déléguer le traitement NLP au Worker Pool
    // (s'exécute APRÈS la réponse HTTP, sans bloquer)
    workerPool.processCV({
      pdfText,
      candidateId: candidate._id.toString()
    }).then((result) => {
      console.log(`✅ NLP terminé pour candidat ${candidate._id}`);
    }).catch((error) => {
      console.error(`❌ NLP échoué pour candidat ${candidate._id}:`, error.message);
      // Mettre à jour le statut en erreur
      Candidate.findByIdAndUpdate(candidate._id, { status: 'failed' }).exec();
    });

  } catch (error) {
    console.error('Upload CV Error:', error);
    const fs = require('fs');
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de l\\'upload'
    });
  }
};

// =============================================================================
// CONTROLLER : getAllCandidates
// Route : GET /api/candidates
// =============================================================================
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find()
            .select('-rawText') // On exclut le texte brut pour alléger la réponse
            .sort({ createdAt: -1 }); // Les plus récents en premier

        return res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates,
        });
    } catch (error) {
        console.error('❌ Erreur dans getAllCandidates:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des candidats.',
        });
    }
};

// =============================================================================
// CONTROLLER : getCandidateById
// Route : GET /api/candidates/:id
// =============================================================================
const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidat non trouvé.',
            });
        }

        return res.status(200).json({
            success: true,
            data: candidate,
        });
    } catch (error) {
        console.error('❌ Erreur dans getCandidateById:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du candidat.',
        });
    }
};

// =============================================================================
// CONTROLLER : getMyProfile
// Route : GET /api/candidates/me
// =============================================================================
const getMyProfile = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ user: req.user.id });

        if (!candidate) {
            return res.status(200).json({
                success: true,
                data: null,
                message: 'Aucun profil candidat trouvé.'
            });
        }

        return res.status(200).json({
            success: true,
            data: candidate,
        });
    } catch (error) {
        console.error('❌ Erreur dans getMyProfile:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de votre profil.',
        });
    }
};

// =============================================================================
// CONTROLLER : detectAnomalies
// Route : POST /api/candidates/:id/detect-anomalies
// =============================================================================
const detectAnomalies = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidat non trouvé.' });
        }

        console.log(`🤖 Analyse des anomalies pour : ${candidate.fileName}`);

        const prompt = `Tu es un expert en détection de fraudes et en analyse RH. 
Analyse les données suivantes d'un CV et identifie les anomalies potentielles (trous dans le parcours, incohérences de dates, compétences surévaluées par rapport aux expériences, contradictions).

DONNÉES DU CV :
${candidate.rawText}

Retourne UNIQUEMENT un objet JSON avec ce format :
{
  "anomalies": [
    {
      "type": "gap_temporel | competence_surestimee | contradiction | date_invalide | experience_insuffisante",
      "severite": "faible | moyenne | elevee",
      "description": "Description claire de l'anomalie",
      "element_concerne": "L'élément du CV concerné",
      "recommandation": "Question à poser en entretien pour clarifier"
    }
  ],
  "score_fiabilite": 0-100,
  "resume_anomalies": "Résumé global en 2 phrases"
}`;

        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3
        });

        const result = JSON.parse(aiResponse.choices[0].message.content);

        // Sauvegarde dans la base
        candidate.anomalies = result.anomalies;
        candidate.scoreFiabilite = result.score_fiabilite;
        candidate.resumeAnomalies = result.resume_anomalies;
        await candidate.save();

        res.status(200).json({
            success: true,
            data: {
                anomalies: result.anomalies,
                scoreFiabilite: result.score_fiabilite,
                resumeAnomalies: result.resume_anomalies
            },
            message: "Analyse des anomalies terminée avec succès."
        });

    } catch (error) {
        console.error('❌ Erreur detectAnomalies:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la détection des anomalies.' });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        let candidate = await Candidate.findOne({ user: req.user.id });
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Profil non trouvé' });
        }
        
        // Update fields allowed
        if (req.body.skills) candidate.skills = req.body.skills;
        if (req.body.experiences) candidate.experiences = req.body.experiences;
        if (req.body.formations) candidate.formations = req.body.formations;
        
        await candidate.save();
        
        res.status(200).json({ success: true, data: candidate, message: 'Profil mis à jour' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour' });
    }
};

const getParsingStatus = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidat non trouvé' });
    }
    res.json({
      success: true,
      status: candidate.status,
      data: candidate.status === 'completed' ? candidate : null,
      message: candidate.status === 'processing' 
        ? 'Analyse IA en cours...' 
        : candidate.status === 'completed'
        ? 'Analyse terminée !'
        : 'Analyse échouée'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
    uploadAndParse, 
    getAllCandidates, 
    getCandidateById,
    getMyProfile,
    detectAnomalies,
    updateMyProfile,
    getParsingStatus
};
