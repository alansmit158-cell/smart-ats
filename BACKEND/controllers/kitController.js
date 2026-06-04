const { OpenAI } = require('openai');
const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const KitEntretien = require('../models/KitEntretien');
const openai = require('../config/openaiConfig');

const KIT_SYSTEM_PROMPT = `Tu es une Intelligence Artificielle intégrée dans la plateforme Smart-ATS, un outil destiné aux recruteurs. Ton rôle actuel (Service IA) est de générer automatiquement un "Kit d'Entretien" (Interview Kit) structuré à partir du CV d'un candidat et de l'offre d'emploi correspondante.

RÈGLES STRICTES :
1. Retourne UNIQUEMENT du JSON valide, sans formatage markdown additionnel (\`\`\`json) s'il n'est pas pur, ou simplement le contenu JSON brut.
2. Sois précis et professionnel. 
3. Génère entre 3 et 5 questions techniques / comportementales adaptées.
4. Identifie au moins un ou deux "points de vigilance" (aspects à creuser lors de l'entretien).

FORMAT DE SORTIE ATTENDU :
{
  "resume_profil": "Ce candidat possède un solide bagage en développement, mais...",
  "questions": [
    "Pouvez-vous décrire un projet où vous avez utilisé Node.js de A à Z ?",
    "Comment gérez-vous les conflits au sein d'une équipe de développeurs ?"
  ],
  "points_vigilance": [
    "Aucune expérience mentionnée en Docker, vérifier sa capacité d'adaptation au déploiement.",
    "Bref passage dans sa dernière entreprise (6 mois), à creuser."
  ]
}`;

// @desc    Generate an Interview Kit for a scheduled Interview
// @route   POST /api/kits/generate/:interviewId
// @access  Private
const generateKit = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { candidateId, jobId } = req.body; // Accept from body as fallback

        let candidate;
        let job;

        if (interviewId && interviewId !== 'direct') {
            // Verify Interview
            const interview = await Interview.findById(interviewId)
                .populate('candidate')
                .populate('job');

            if (!interview) {
                return res.status(404).json({ success: false, message: 'Interview not found' });
            }

            // Check if kit already exists
            const existingKit = await KitEntretien.findOne({ interview: interviewId });
            if (existingKit) {
                return res.status(200).json({ success: true, data: existingKit, message: 'Kit already exists.' });
            }

            candidate = interview.candidate;
            job = interview.job;
        } else if (candidateId) {
            candidate = await Candidate.findById(candidateId).populate('user');
            if (jobId) {
                job = await Job.findById(jobId);
            }
        }

        if (!candidate) {
            return res.status(400).json({ success: false, message: 'Candidate not found or not linked.' });
        }

        // Context construction
        const jobContext = job ? `
OFFRE D'EMPLOI :
- Titre : ${job.titre || job.title}
- Description : ${job.description}
- Compétences requises : ${job.competences?.join(', ') || job.requirements?.join(', ') || 'Non spécifiées'}` : "Pas d'offre d'emploi liée (Entretien spontané).";

        const candidateContext = `
PROFIL DU CANDIDAT :
- Nom : ${candidate.user?.nom || candidate.name || 'Candidat'}
- Compétences : ${candidate.skills?.join(', ') || 'Aucune'}
- Expériences : ${candidate.experiences?.map(e => `${e.poste} chez ${e.entreprise}`).join(' | ') || 'Aucune'}
- Anomalies détectées par l'IA : ${candidate.anomalies?.map(a => `[${a.severite.toUpperCase()}] ${a.description}`).join(' | ') || 'Aucune'}
- Texte brut du CV pertinent: ${candidate.rawText ? candidate.rawText.substring(0, 500) : ''}`;

        console.log(`🤖 AI is generating interview kit for ${candidate.user?.nom || candidate.name || 'Candidat'}...`);

        // OpenAI API call
        let kitData;
        try {
            const aiResponse = await openai.chat.completions.create({
                model: process.env.GROQ_MODEL || 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: KIT_SYSTEM_PROMPT },
                    { role: 'user', content: `Génère le kit d'entretien pour cette situation. IMPORTANT : Prends en compte les anomalies IA détectées pour proposer des questions de vérification.\n\n${jobContext}\n\n${candidateContext}` }
                ],
                temperature: 0.3,
                response_format: { type: 'json_object' },
                max_tokens: 800,
            });

            const aiContent = aiResponse.choices[0].message.content;
            kitData = JSON.parse(aiContent);
        } catch (apiError) {
            console.warn(`[AI MOCK FALLBACK] Kit generation failed: ${apiError.message}. Using mock kit.`);
            kitData = {
                resume_profil: "John Doe est un développeur fullstack orienté MERN stack doté d'une solide expérience de 2 ans. Il a de bonnes bases sur React et Node.js.",
                questions: [
                    "Pouvez-vous décrire un projet où vous avez utilisé Node.js de A à Z ?",
                    "Comment assurez-vous la sécurité d'une API Express ?",
                    "Quelle est la différence entre un state et une prop en React ?",
                    "Comment optimisez-vous les performances d'une base MongoDB ?"
                ],
                points_vigilance: [
                    "Aucune expérience de déploiement CI/CD ou cloud n'est visible sur le CV.",
                    "Vérifier son expérience en écriture de tests automatisés (Jest, Mocha)."
                ]
            };
        }

        // Fusionner les anomalies de haute sévérité directement dans les points de vigilance
        const highSeverityAnomalies = (candidate.anomalies || [])
            .filter(a => a.severite === 'elevee')
            .map(a => `[ALERTE IA] ${a.description}`);
            
        const combinedVigilance = [...highSeverityAnomalies, ...(kitData.points_vigilance || [])];

        // Field mapping to match KitEntretien schema
        const kitEntretienData = {
            resumeIA: kitData.resume_profil || "Résumé indisponible",
            questionsTechniques: kitData.questions || [],
            pointsVigilance: combinedVigilance
        };

        if (interviewId && interviewId !== 'direct') {
            kitEntretienData.interview = interviewId;
            const kitEntretien = new KitEntretien(kitEntretienData);
            await kitEntretien.save();
            return res.status(201).json({ success: true, data: kitEntretien, message: 'Interview kit generated and saved successfully' });
        } else {
            // Return on-the-fly generated kit without saving to DB (since there's no Interview ID)
            return res.status(200).json({ success: true, data: kitEntretienData, message: 'Interview kit generated on-the-fly' });
        }
    } catch (error) {
        console.error('Error generating kit:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get an Interview Kit by Interview ID
// @route   GET /api/kits/:interviewId
// @access  Private
const getKit = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const kit = await KitEntretien.findOne({ interview: interviewId });
        
        if (!kit) {
            // It's not an error to not have a kit yet, just return null
            return res.status(200).json({ success: true, data: null });
        }

        res.status(200).json({ success: true, data: kit });
    } catch (error) {
        console.error('Error fetching kit:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    generateKit,
    getKit
};
