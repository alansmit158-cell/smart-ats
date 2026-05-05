const { workerData, parentPort } = require('worker_threads');
const OpenAI = require('openai');
const mongoose = require('mongoose');

// Ce worker reçoit :
// workerData = {
//   pdfText: string,
//   candidateId: string,
//   mongoUri: string,
//   openaiKey: string
// }

const processNLP = async () => {
  try {
    // 1. Connexion MongoDB dans le worker
    await mongoose.connect(workerData.mongoUri);
    
    // 2. Initialiser OpenAI dans le worker
    const openai = new OpenAI({ apiKey: workerData.openaiKey });
    
    // 3. Prompt NLP
    const prompt = `
    Tu es un expert RH et parseur de CV.
    Analyse ce CV et extrais les informations en JSON strict.
    
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
      ]
    }
    
    CV à analyser :
    ${workerData.pdfText}
    `;
    
    // 4. Appel OpenAI (bloque UNIQUEMENT ce thread worker)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.1
    });
    
    // 5. Parser la réponse JSON
    const rawContent = response.choices[0].message.content;
    const cleanContent = rawContent.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanContent);
    
    // 6. Mettre à jour le candidat en MongoDB
    const Candidate = require('../models/Candidate');
    await Candidate.findByIdAndUpdate(
      workerData.candidateId,
      {
        prenom: parsedData.prenom || '',
        nom: parsedData.nom || '',
        skills: parsedData.skills || [],
        experiences: parsedData.experiences || [],
        formations: parsedData.formations || [],
        status: 'completed'
      },
      { new: true }
    );
    
    // 7. Notifier le thread principal du succès
    parentPort.postMessage({
      success: true,
      candidateId: workerData.candidateId,
      data: parsedData,
      message: 'CV parsé avec succès par le Worker Thread'
    });
    
  } catch (error) {
    // 8. Mettre à jour le statut en 'failed' si erreur d'exécution dans le worker lui-même
    try {
        const Candidate = require('../models/Candidate');
        await Candidate.findByIdAndUpdate(workerData.candidateId, { status: 'failed' });
    } catch (dbErr) {
        // Ignorer l'erreur db ici
    }
    // Notifier le thread principal de l'erreur
    parentPort.postMessage({
      success: false,
      candidateId: workerData.candidateId,
      error: error.message
    });
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

processNLP();
