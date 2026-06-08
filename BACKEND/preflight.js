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
            description: 'Nous recherchons un développeur expert en MERN stack (React, Node.js, Express, MongoDB) pour rejoindre notre équipe. Vous participerez activement à la conception, au développement, au déploiement et à la maintenance de nos applications web à forte valeur ajoutée, en garantissant la qualité du code et les performances.',
            competences: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
            lieu: 'Paris (Remote)',
            salaire: 60000,
            recruiter: users.recruiter._id
        });
        console.log(`💼 Created/Reset Job: ${job.titre}`);

        // Seed an active Enterprise subscription for the recruiter.
        // createJob() checks for an active Abonnement before allowing job creation (403 otherwise).
        const Abonnement = require('./models/Abonnement');
        await Abonnement.deleteOne({ recruteur: users.recruiter._id });
        const now = new Date();
        const nextYear = new Date(now);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        await Abonnement.create({
            plan: 'Enterprise',
            prix: 299,
            status: 'active',
            dateDebut: now,
            dateFin: nextYear,
            recruteur: users.recruiter._id,
            jobLimit: 9999,
            limiteAnalyses: 9999,
            jobsCreated: 0,
            analysesUtilisees: 0
        });
        console.log(`🔑 Created/Reset Enterprise Abonnement for recruiter@test.com`);

        console.log('✅ Preflight check and seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Preflight error:', error);
        process.exit(1);
    }
};

preflight();
