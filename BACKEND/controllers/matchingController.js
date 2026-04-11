const { OpenAI } = require('openai');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

const openai = new OpenAI();

// =============================================================================
// PROMPT SYSTÈME — Moteur de Matching Sémantique
// Justification PFE : Le matching n'est pas un simple filtrage par mots-clés.
// L'IA analyse la sémantique profonde : "Développeur React" correspond à
// "Ingénieur Frontend JavaScript". C'est le différentiateur clé du système.
// =============================================================================
const MATCHING_SYSTEM_PROMPT = `Tu es un expert en recrutement et en intelligence artificielle spécialisé dans l'évaluation de la compatibilité candidat-poste.

Ton rôle est d'analyser la correspondance entre un profil de candidat et une offre d'emploi, puis de retourner un score de compatibilité détaillé en JSON valide.

Tu dois évaluer :
1. La correspondance des compétences techniques (hard skills)
2. La correspondance des compétences comportementales (soft skills)
3. L'adéquation de l'expérience professionnelle
4. L'adéquation de la formation académique

RÈGLES STRICTES :
1. Retourne UNIQUEMENT le JSON, sans aucun texte avant ou après.
2. Le score doit être un entier entre 0 et 100.
3. Sois objectif et précis dans ton évaluation.
4. Le JSON doit être parfaitement valide et parseable.

FORMAT DE SORTIE ATTENDU :
{
  "score": 85,
  "verdict": "Excellent match",
  "summary": "Le candidat possède une solide expérience en développement web et maîtrise les technologies requises.",
  "strengths": [
    "Maîtrise de React et Node.js (technologies clés du poste)",
    "5 ans d'expérience en développement Full Stack",
    "Formation en informatique pertinente"
  ],
  "gaps": [
    "Pas d'expérience mentionnée avec Docker",
    "Niveau d'anglais non précisé"
  ],
  "recommendation": "RECOMMEND"
}

Valeurs possibles pour "verdict": "Excellent match", "Bon match", "Match partiel", "Faible correspondance"
Valeurs possibles pour "recommendation": "STRONGLY_RECOMMEND", "RECOMMEND", "CONSIDER", "NOT_RECOMMENDED"`;

// =============================================================================
// CONTROLLER : matchCandidateToJob
// Route : POST /api/matching/score
// Body  : { jobId, candidateId }
// =============================================================================
const matchCandidateToJob = async (req, res) => {
    try {
        const { jobId, candidateId } = req.body;

        if (!jobId || !candidateId) {
            return res.status(400).json({
                success: false,
                message: 'jobId et candidateId sont requis.'
            });
        }

        // Récupération des données depuis MongoDB
        const job = await Job.findById(jobId);
        const candidate = await Candidate.findById(candidateId);

        if (!job) return res.status(404).json({ success: false, message: 'Offre d\'emploi non trouvée.' });
        if (!candidate) return res.status(404).json({ success: false, message: 'Candidat non trouvé.' });

        console.log(`🔍 Matching : "${candidate.name}" ↔ "${job.title}"`);

        // Construction du contexte pour l'IA
        const jobContext = `
OFFRE D'EMPLOI :
- Titre : ${job.title}
- Département : ${job.department}
- Lieu : ${job.location}
- Type : ${job.type}
- Description : ${job.description}
- Compétences requises : ${job.requirements?.join(', ') || 'Non spécifiées'}`;

        const candidateContext = `
PROFIL DU CANDIDAT :
- Nom : ${candidate.name}
- Compétences : ${candidate.skills?.join(', ') || 'Aucune'}
- Expériences : ${candidate.experiences?.map(e => `${e.poste} chez ${e.entreprise} (${e.duree})`).join(' | ') || 'Aucune'}
- Formations : ${candidate.formations?.map(f => `${f.diplome} - ${f.etablissement} (${f.annee})`).join(' | ') || 'Aucune'}`;

        // Appel à l'IA
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: MATCHING_SYSTEM_PROMPT },
                { role: 'user', content: `Évalue la compatibilité entre ce candidat et cette offre d'emploi :\n\n${jobContext}\n\n${candidateContext}` }
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
            max_tokens: 800,
        });

        const aiContent = aiResponse.choices[0].message.content;
        let matchResult;

        try {
            matchResult = JSON.parse(aiContent);
        } catch (parseError) {
            return res.status(500).json({ success: false, message: 'Erreur de parsing de la réponse IA.' });
        }

        console.log(`✅ Score : ${matchResult.score}/100 — ${matchResult.verdict}`);

        return res.status(200).json({
            success: true,
            data: {
                candidateId: candidate._id,
                candidateName: candidate.name,
                jobId: job._id,
                jobTitle: job.title,
                ...matchResult
            }
        });

    } catch (error) {
        if (error?.status === 401) return res.status(500).json({ success: false, message: 'Clé API OpenAI invalide.' });
        if (error?.status === 429) return res.status(429).json({ success: false, message: 'Quota OpenAI dépassé.' });
        console.error('❌ Erreur matching:', error);
        return res.status(500).json({ success: false, message: 'Erreur serveur lors du matching.' });
    }
};

// =============================================================================
// CONTROLLER : matchAllCandidatesToJob
// Route : POST /api/matching/job/:jobId
// Retourne le score de TOUS les candidats pour une offre donnée, triés par score
// =============================================================================
const matchAllCandidatesToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);

        if (!job) return res.status(404).json({ success: false, message: 'Offre d\'emploi non trouvée.' });

        const candidates = await Candidate.find().select('-rawText');

        if (candidates.length === 0) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        console.log(`🚀 Matching de ${candidates.length} candidat(s) pour "${job.title}"...`);

        const jobContext = `
OFFRE D'EMPLOI :
- Titre : ${job.title}
- Département : ${job.department}
- Lieu : ${job.location}
- Type : ${job.type}
- Description : ${job.description}
- Compétences requises : ${job.requirements?.join(', ') || 'Non spécifiées'}`;

        // Traitement parallèle (Promise.all) pour performance
        const matchPromises = candidates.map(async (candidate) => {
            try {
                const candidateContext = `
PROFIL DU CANDIDAT :
- Nom : ${candidate.name}
- Compétences : ${candidate.skills?.join(', ') || 'Aucune'}
- Expériences : ${candidate.experiences?.map(e => `${e.poste} chez ${e.entreprise}`).join(' | ') || 'Aucune'}
- Formations : ${candidate.formations?.map(f => `${f.diplome} - ${f.etablissement}`).join(' | ') || 'Aucune'}`;

                const aiResponse = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: MATCHING_SYSTEM_PROMPT },
                        { role: 'user', content: `Évalue la compatibilité :\n${jobContext}\n${candidateContext}` }
                    ],
                    temperature: 0.2,
                    response_format: { type: 'json_object' },
                    max_tokens: 600,
                });

                const result = JSON.parse(aiResponse.choices[0].message.content);
                return {
                    candidateId: candidate._id,
                    candidateName: candidate.name,
                    candidateEmail: candidate.email,
                    skills: candidate.skills,
                    ...result
                };
            } catch (err) {
                console.error(`Erreur matching pour ${candidate.name}:`, err.message);
                return {
                    candidateId: candidate._id,
                    candidateName: candidate.name,
                    score: 0,
                    verdict: 'Erreur',
                    summary: 'Impossible d\'analyser ce candidat.',
                    strengths: [],
                    gaps: [],
                    recommendation: 'NOT_RECOMMENDED'
                };
            }
        });

        const results = await Promise.all(matchPromises);

        // Tri par score décroissant
        results.sort((a, b) => b.score - a.score);

        console.log(`✅ Matching terminé. Top candidat : ${results[0]?.candidateName} (${results[0]?.score}/100)`);

        return res.status(200).json({
            success: true,
            jobTitle: job.title,
            count: results.length,
            data: results
        });

    } catch (error) {
        console.error('❌ Erreur matchAllCandidatesToJob:', error);
        return res.status(500).json({ success: false, message: 'Erreur serveur lors du matching groupé.' });
    }
};

module.exports = { matchCandidateToJob, matchAllCandidatesToJob };
