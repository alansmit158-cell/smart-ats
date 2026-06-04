const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

const preflight = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for preflight check.');

        const usersData = [
            { nom: 'Admin', prenom: 'System', email: 'admin@test.com', password: 'password123', role: 'admin' },
            { nom: 'Recruiter', prenom: 'Senior', email: 'recruiter@test.com', password: 'password123', role: 'recruiter' },
            { nom: 'Candidate', prenom: 'John', email: 'candidate@test.com', password: 'password123', role: 'candidate' }
        ];

        const users = {};
        for (const data of usersData) {
            await User.deleteOne({ email: data.email });
            const user = await User.create(data);
            console.log(`👤 Created/Reset user: ${data.email} (${data.role})`);
            users[data.role] = user;
        }

        // Always reset/recreate the Job to bind it to the fresh recruiter's _id
        await Job.deleteOne({ titre: 'Développeur Full-Stack React/Node' });
        job = await Job.create({
            titre: 'Développeur Full-Stack React/Node',
            description: 'Nous recherchons un développeur expert en MERN stack (React, Node.js, Express, MongoDB) pour rejoindre notre équipe.',
            competences: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
            lieu: 'Paris (Remote)',
            salaire: 60000,
            recruiter: users.recruiter._id
        });
        console.log(`💼 Created/Reset Job: ${job.titre}`);

        console.log('✅ Preflight check and seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Preflight error:', error);
        process.exit(1);
    }
};

preflight();
