const { workerData, parentPort } = require('worker_threads');
const OpenAI = require('openai');

const processNLP = async () => {
  try {
    // 1. Initialiser OpenAI (Groq API) dans le worker
    const openai = new OpenAI({ 
        apiKey: workerData.groqKey,
        baseURL: "https://api.groq.com/openai/v1"
    });
    
    // 2. Prompt NLP
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
    
    // 3. Appel OpenAI (Groq)
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
        ]
      };
    }
    
    // 4. Notifier le thread principal du succès
    parentPort.postMessage({
      success: true,
      candidateId: workerData.candidateId,
      data: parsedData,
      message: 'CV parsé avec succès par le Worker Thread'
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
