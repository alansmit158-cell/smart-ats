const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Register schemas by requiring models
require('./models/User');
require('./models/Candidate');
require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');
        
        const apps = await Application.find()
            .populate({
                path: 'candidate',
                populate: { path: 'user' }
            })
            .populate('job');
            
        console.log(`Found ${apps.length} applications.`);
        for (const app of apps) {
            console.log(`- App ID: ${app._id}`);
            console.log(`  Job: ${app.job?.titre}`);
            console.log(`  Candidate ID: ${app.candidate?._id}`);
            console.log(`  Candidate Name: ${app.candidate?.user?.nom}`);
            console.log(`  Candidate Status: ${app.candidate?.status}`);
            console.log(`  Matching Score: ${app.scoreMatching}%`);
            console.log(`  Status: ${app.status}`);
        }
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
};
check();
