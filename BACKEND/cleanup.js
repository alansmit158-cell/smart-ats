const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./models/Candidate');
const Application = require('./models/Application');
const Interview = require('./models/Interview');
const KitEntretien = require('./models/KitEntretien');
const Job = require('./models/Job');
const User = require('./models/User');
const Message = require('./models/Message');
const Abonnement = require('./models/Abonnement');

dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for cleanup.');

        const candDel = await Candidate.deleteMany({});
        console.log(`🧹 Deleted ${candDel.deletedCount} Candidate profiles.`);

        const appDel = await Application.deleteMany({});
        console.log(`🧹 Deleted ${appDel.deletedCount} Applications.`);

        const intDel = await Interview.deleteMany({});
        console.log(`🧹 Deleted ${intDel.deletedCount} Interviews.`);

        const kitDel = await KitEntretien.deleteMany({});
        console.log(`🧹 Deleted ${kitDel.deletedCount} Interview Kits.`);

        const jobDel = await Job.deleteMany({});
        console.log(`🧹 Deleted ${jobDel.deletedCount} Jobs.`);

        const userDel = await User.deleteMany({});
        console.log(`🧹 Deleted ${userDel.deletedCount} Users.`);

        const msgDel = await Message.deleteMany({});
        console.log(`🧹 Deleted ${msgDel.deletedCount} Messages.`);

        const aboDel = await Abonnement.deleteMany({});
        console.log(`🧹 Deleted ${aboDel.deletedCount} Abonnements.`);

        console.log('✅ Database cleanup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup error:', error);
        process.exit(1);
    }
};

cleanup();
