const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

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
        // --- Étape 1 : Vérification du fichier uploadé ---
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier CV fourni. Veuillez uploader un fichier PDF.',
            });
        }

        const { originalname, buffer, mimetype } = req.file;

        // Vérification du type MIME
        if (mimetype !== 'application/pdf') {
            return res.status(400).json({
                success: false,
                message: 'Format de fichier invalide. Seuls les fichiers PDF sont acceptés.',
            });
        }

        console.log(`📄 Fichier reçu : ${originalname} (${(buffer.length / 1024).toFixed(1)} KB)`);

        // --- Étape 2 : Extraction du texte brut depuis le PDF ---
        const pdfData = await pdfParse(buffer);
        const rawText = pdfData.text.trim();

        if (!rawText || rawText.length < 50) {
            return res.status(422).json({
                success: false,
                message: 'Impossible d\'extraire le texte du PDF. Le fichier est peut-être scanné (image) ou vide.',
            });
        }

        console.log(`📝 Texte extrait : ${rawText.length} caractères`);

        // --- Étape 3 : Analyse IA via OpenAI (Moteur NLP) ---
        console.log('🤖 Envoi à OpenAI pour analyse NLP...');

        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Modèle optimisé : rapide et économique pour l'extraction
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: `Voici le texte brut du CV à analyser :\n\n---\n${rawText}\n---`,
                },
            ],
            temperature: 0.1,       // Faible créativité = résultats déterministes et fiables
            response_format: { type: 'json_object' }, // Force le mode JSON d'OpenAI
            max_tokens: 2000,
        });

        const aiContent = aiResponse.choices[0].message.content;
        console.log('✅ Réponse OpenAI reçue');

        // --- Étape 4 : Parsing de la réponse JSON ---
        let parsedData;
        try {
            parsedData = JSON.parse(aiContent);
        } catch (parseError) {
            console.error('❌ Erreur de parsing JSON depuis OpenAI:', aiContent);
            return res.status(500).json({
                success: false,
                message: 'L\'IA a retourné un format invalide. Veuillez réessayer.',
            });
        }

        // --- Étape 5 : Gestion de l'Utilisateur et Sauvegarde dans MongoDB ---
        let userId;

        // On cherche si un User existe déjà avec cet email
        let user = await User.findOne({ email: parsedData.email });

if (!user) {
    // Si l'utilisateur n'existe pas, on le crée (rôle candidat)
    user = await User.create({
        nom: parsedData.name || 'Inconnu',
        email: parsedData.email || `temp_${Date.now()}@smart-ats.com`,
        password: 'password123', // Mot de passe par défaut pour le PFE
        role: 'candidate'
    });
}
userId = user._id;

const candidate = await Candidate.create({
    user: userId,
    skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
    experiences: Array.isArray(parsedData.experiences) ? parsedData.experiences.map(exp => ({
        titre: exp.poste,
        entreprise: exp.entreprise,
        description: exp.description
        // On pourrait parser la durée pour dateDebut/dateFin si besoin
    })) : [],
    formations: Array.isArray(parsedData.formations) ? parsedData.formations.map(f => ({
        diplome: f.diplome,
        etablissement: f.etablissement
        // On pourrait parser l'année si besoin
    })) : [],
    rawText: rawText,
    fileName: originalname,
});

console.log(`💾 Candidat sauvegardé en base : ${candidate._id} — ${parsedData.name}`);

// --- Étape 6 : Réponse succès ---
return res.status(201).json({
    success: true,
    message: `CV de "${parsedData.name}" analysé et lié à l'utilisateur ${user.email}.`,
    data: candidate,
});

    } catch (error) {
        // Gestion des erreurs OpenAI spécifiques
        if (error?.status === 401) {
            return res.status(500).json({
                success: false,
                message: 'Clé API OpenAI invalide ou manquante. Vérifiez votre fichier .env.',
            });
        }
        if (error?.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'Quota OpenAI dépassé. Veuillez réessayer dans quelques instants.',
            });
        }

        console.error('❌ Erreur dans uploadAndParse:', error);
        return res.status(500).json({
            success: false,
            message: 'Une erreur interne est survenue lors de l\'analyse du CV.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
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

module.exports = { uploadAndParse, getAllCandidates, getCandidateById };
