const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected.');

        const collections = Object.keys(mongoose.connection.collections);
        
        for (const collectionName of collections) {
            const collection = mongoose.connection.collections[collectionName];
            try {
                await collection.drop();
                console.log(`Dropped collection: ${collectionName}`);
            } catch (error) {
                if (error.message === 'ns not found') {
                    console.log(`Collection ${collectionName} does not exist, skipping...`);
                } else {
                    console.log(`Error dropping collection ${collectionName}: ${error.message}`);
                }
            }
        }
        
        console.log('Toutes les données ont été supprimées avec succès !');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors du reset DB :', err);
        process.exit(1);
    }
};

resetDB();
