const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./models/Candidate');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');
        
        const candidates = await Candidate.find().sort({ createdAt: -1 }).limit(5);
        console.log(`Found ${candidates.length} candidates.`);
        for (const c of candidates) {
            console.log(`- ID: ${c._id}, Email: ${c.email}, Status: ${c.status}, Name: ${c.prenom} ${c.nom}, File: ${c.fileName}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

check();
