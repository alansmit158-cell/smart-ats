# Smart-ATS — Système de Recrutement Assisté par IA

Smart-ATS est une plateforme de recrutement de nouvelle génération conçue pour automatiser et optimiser le processus d'embauche grâce à l'Intelligence Artificielle (GPT-4o). Elle permet une analyse sémantique profonde des CV, un matching prédictif entre candidats et offres, ainsi que la génération automatisée de kits d'entretien.

## 🚀 Fonctionnalités Clés

### 🧠 Intelligence Artificielle (Module Principal)
- **Parsing NLP** : Extraction structurée (JSON) des compétences, expériences et formations à partir de CV PDF.
- **Matching Sémantique** : Calcul de score de compatibilité (0-100%) entre un candidat et une fiche de poste.
- **Career Agent** : Chatbot IA fournissant des conseils personnalisés aux candidats.
- **Interview AI Kit** : Génération automatique de questions techniques et points de vigilance pour les recruteurs.

### 💼 Portails Dédiés
- **Console Recruteur** : Dashboard haute performance, gestion des offres (CRUD IA), messagerie avec suggestions de réponses.
- **Portail Candidat** : Dashboard de suivi, explorateur d'offres intelligent, profil éditable en temps réel.
- **Console Admin** : Monitoring de la télémétrie IA (OpenAI tokens), sécurité (Firewall IA) et gestion des comptes.

## 🛠️ Stack Technique

### Frontend
- **React 19** & **Vite 7**
- **Tailwind CSS 4** (Design System Luxe)
- **Framer Motion** (Animations fluides)
- **Lucide React** (Iconographie)

### Backend
- **Node.js** & **Express 5**
- **MongoDB Atlas** (Mongoose ODM)
- **OpenAI API** (GPT-4o-mini)
- **Worker Threads** (Analyse asynchrone haute performance)

## 📦 Installation et Lancement

### Pré-requis
- Node.js (v18+)
- MongoDB Atlas (URI)
- Clé API OpenAI

### Installation
1. Cloner le projet.
2. Configurer le fichier `.env` dans le dossier `BACKEND`.
3. Installer les dépendances :
   ```bash
   # Root
   npm install
   # Backend
   cd BACKEND && npm install
   # Frontend
   cd ../frontend && npm install
   ```

### Lancement
- **Serveur Backend** : `cd BACKEND && npm run dev` (Port 5000)
- **Frontend** : `cd frontend && npm run dev` (Port 5173)

---
*Projet réalisé dans le cadre d'une soutenance de PFE — 2026*
