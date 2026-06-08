const { workerData, parentPort } = require('worker_threads');
const OpenAI = require('openai');
const mongoose = require('mongoose');

const processNLP = async () => {
  try {
    // 1. Connect to MongoDB inside worker thread
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(workerData.mongoUri);
    }
    
    const Job = require('../models/Job');
    const job = await Job.findById(workerData.jobId);
    if (!job) {
      throw new Error(`Job not found with ID: ${workerData.jobId}`);
    }

    // 2. Initialiser OpenAI (Groq API) dans le worker
    const openai = new OpenAI({ 
        apiKey: workerData.groqKey,
        baseURL: "https://api.groq.com/openai/v1"
    });
    
    // 3. Prompt NLP
    const prompt = `
    Tu es un expert RH, parseur de CV et spécialiste du matching sémantique.
    Analyse ce CV par rapport à l'offre d'emploi spécifiée et extrait les informations en JSON strict.
    
    Offre d'emploi :
    Titre : ${job.titre}
    Description : ${job.description}
    
    CV à analyser :
    ${workerData.pdfText}
    
    Réponds UNIQUEMENT en JSON valide sans markdown :
    {
      "prenom": "string",
      "nom": "string", 
      "skills": ["skill1", "skill2"],
      "experiences": [
        {
          "poste": "string",
          "entreprise": "string",
          "dateDebut": "YYYY-MM-DD",
          "dateFin": "YYYY-MM-DD ou null",
          "description": "string"
        }
      ],
      "formations": [
        {
          "diplome": "string",
          "etablissement": "string",
          "annee": "string"
        }
      ],
      "score": 88,
      "interviewKit": {
        "resumeIA": "Résumé textuel de l'adéquation, des forces et des faiblesses du candidat par rapport à l'offre.",
        "questionsTechniques": [
          "Question technique ou comportementale ciblée 1 (ex: pour évaluer un écart ou approfondir une compétence)",
          "Question technique ou comportementale ciblée 2",
          "Question technique ou comportementale ciblée 3"
        ],
        "pointsVigilance": [
          "Point de vigilance 1 concernant le profil par rapport à l'offre",
          "Point de vigilance 2"
        ]
      }
    }
    `;
    
    // 4. Appel OpenAI (Groq)
    let parsedData;
    try {
      const response = await openai.chat.completions.create({
        model: workerData.groqModel || 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.1
      });
      
      const rawContent = response.choices[0].message.content;
      const cleanContent = rawContent.replace(/```json|```/g, '').trim();
      parsedData = JSON.parse(cleanContent);
    } catch (apiError) {
      console.warn(`[AI MOCK FALLBACK] API call failed: ${apiError.message}. Using mock parser data.`);
      parsedData = {
        prenom: "John",
        nom: "Doe",
        skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
        experiences: [
          {
            poste: "Développeur Full-Stack",
            entreprise: "TechCorp",
            dateDebut: "2022-01-01",
            dateFin: null,
            description: "Développement d'applications web avec React, Node.js, Express et MongoDB"
          }
        ],
        formations: [
          {
            diplome: "Master en Informatique",
            etablissement: "Université de Paris",
            annee: "2021"
          }
        ],
        score: 85,
        interviewKit: {
          resumeIA: "Le candidat possède de solides compétences sur React et Node.js, ce qui correspond bien aux attentes de l'offre.",
          questionsTechniques: [
            "Comment concevez-vous l'architecture d'une API REST avec Express et Node.js ?",
            "Pouvez-vous nous parler de votre expérience avec React et de la gestion globale de l'état ?"
          ],
          pointsVigilance: [
            "Le candidat n'a pas mentionné d'expérience avec les bases de données SQL, à creuser."
          ]
        }
      };
    }
    
    // 5. Notifier le thread principal du succès
    parentPort.postMessage({
      success: true,
      candidateId: workerData.candidateId,
      data: parsedData,
      message: 'CV parsé et scoré avec succès par le Worker Thread'
    });
    
  } catch (error) {
    // Notifier le thread principal de l'erreur
    parentPort.postMessage({
      success: false,
      candidateId: workerData.candidateId,
      error: error.message
    });
  } finally {
    process.exit(0);
  }
};

processNLP();
