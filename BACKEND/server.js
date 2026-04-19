const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. Hedhi lezem t-koun awel wa7da!
dotenv.config();

const connectDB = require('./config/db');

// 2. Connect to Database ba3d ma 9rina el .env
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Global Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// Routes du module 1 : Parsing des CVs
app.use('/api/candidates', require('./routes/candidateRoutes'));
// Routes du module 2 : Matching Sémantique IA
app.use('/api/matching', require('./routes/matchingRoutes'));
// Routes du nouveau module : Entretiens
app.use('/api/interviews', require('./routes/interviewRoutes'));
// Routes du module IA Kit d'entretien
app.use('/api/kits', require('./routes/kitRoutes'));

app.get('/', (req, res) => {
    res.send('Smart-ATS API is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));