const { OpenAI } = require('openai');

if (!process.env.GROQ_API_KEY) {
    console.error('❌ ERREUR CRITIQUE: GROQ_API_KEY est manquante dans les variables d\'environnement.');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    maxRetries: 3,
    timeout: 30000,
});

module.exports = openai;
