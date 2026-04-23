const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    nom: 'Administrateur Système',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  },
  {
    nom: 'Recruteur Talent',
    email: 'recruiter@test.com',
    password: 'password123',
    role: 'recruiter'
  },
  {
    nom: 'Candidat Démonstration',
    email: 'candidate@test.com',
    password: 'password123',
    role: 'candidate'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connexion à MongoDB réussie pour le seeding...');

    // Supprimer les utilisateurs de test existants pour éviter les doublons
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });

    // Insérer les nouveaux utilisateurs (Boucle pour activer les hooks pre-save)
    for (let u of users) {
      await User.create(u);
    }
    
    console.log('✅ Trois utilisateurs de test ajoutés avec succès :');
    console.log('- Admin: admin@test.com');
    console.log('- Recruiter: recruiter@test.com');
    console.log('- Candidate: candidate@test.com');
    
    process.exit();
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error.message);
    process.exit(1);
  }
};

seedUsers();
