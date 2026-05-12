const { OpenAI } = require('openai');

if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERREUR CRITIQUE: OPENAI_API_KEY est manquante dans les variables d\'environnement.');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
    timeout: 30000,
});

module.exports = openai;
