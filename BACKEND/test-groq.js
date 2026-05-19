const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: './BACKEND/.env' });

const { OpenAI } = require('openai');
const openai = new OpenAI({ 
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
});

async function testGroq() {
    console.log('Testing Groq CV Parsing...');
    try {
        const dataBuffer = fs.readFileSync('cv.pdf');
        const pdfData = await pdfParse(dataBuffer);
        const pdfText = pdfData.text.substring(0, 5000);
        console.log('PDF Extracted, length:', pdfText.length);
        
        const prompt = `
        Tu es un parseur de CV. Analyse ce CV et extrais les informations en JSON strict sans markdown.
        { "nom": "string", "prenom": "string", "skills": ["skill1"] }
        CV: ${pdfText}
        `;
        
        console.log('Calling Groq API...');
        const response = await openai.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            temperature: 0.1
        });
        
        console.log('Response:', response.choices[0].message.content);
        console.log('SUCCESS');
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}
testGroq();
