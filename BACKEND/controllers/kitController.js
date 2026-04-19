const { OpenAI } = require('openai');
const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const KitEntretien = require('../models/KitEntretien');

const openai = new OpenAI();

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

        const candidate = interview.candidate;
        const job = interview.job;

        if (!candidate) {
            return res.status(400).json({ success: false, message: 'Candidate not linked to this interview.' });
        }

        // Context construction
        const jobContext = job ? `
OFFRE D'EMPLOI :
- Titre : ${job.title}
- Description : ${job.description}
- Compétences requises : ${job.requirements?.join(', ') || 'Non spécifiées'}` : "Pas d'offre d'emploi liée (Entretien spontané).";

        const candidateContext = `
PROFIL DU CANDIDAT :
- Nom : ${candidate.name}
- Compétences : ${candidate.skills?.join(', ') || 'Aucune'}
- Expériences : ${candidate.experiences?.map(e => `${e.poste} chez ${e.entreprise}`).join(' | ') || 'Aucune'}
- Formations : ${candidate.formations?.map(f => `${f.diplome}`).join(' | ') || 'Aucune'}
- Texte brut du CV pertinent: ${candidate.rawText ? candidate.rawText.substring(0, 500) : ''}`;

        console.log(`🤖 AI is generating interview kit for ${candidate.name}...`);

        // OpenAI API call
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: KIT_SYSTEM_PROMPT },
                { role: 'user', content: `Génère le kit d'entretien pour cette situation :\n\n${jobContext}\n\n${candidateContext}` }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' },
            max_tokens: 800,
        });

        const aiContent = aiResponse.choices[0].message.content;
        let kitData;

        try {
            kitData = JSON.parse(aiContent);
        } catch (parseError) {
            return res.status(500).json({ success: false, message: 'Erreur de parsing de la réponse IA.' });
        }

        // Save Kit to DB
        const kitEntretien = new KitEntretien({
            interview: interviewId,
            resume_profil: kitData.resume_profil || "Résumé indisponible",
            questions: kitData.questions || [],
            points_vigilance: kitData.points_vigilance || []
        });

        await kitEntretien.save();

        res.status(201).json({ success: true, data: kitEntretien, message: 'Interview kit generated successfully' });
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
