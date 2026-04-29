# Documentation des Pages - Smart-ATS (PFE)

Ce document récapitule les principales interfaces de la plateforme Smart-ATS, à utiliser pour les captures d'écran du rapport de PFE.

## 👥 ESPACE CANDIDAT

| Page | Fichier JSX | Route | Acteur | Description & Features IA |
| :--- | :--- | :--- | :--- | :--- |
| **Portail Offres** | `CandidatePortal.jsx` | `/candidate/portal` | Candidat | Liste des offres avec design "Luxe". Bouton "Postuler" dynamique vérifiant la présence du CV. |
| **Suivi Candidatures** | `CandidateApplications.jsx` | `/candidate/applications` | Candidat | Pipeline visuel de l'état du dossier (En attente → Entretien → Accepté). Badge de score IA affiché. |
| **Upload & Parsing** | `CandidateUpload.jsx` | `/candidate/upload` | Candidat | Zone de drop PDF. Déclenche le parsing IA (OpenAI) pour extraire compétences et expériences. |
| **Messagerie IA** | `CandidateChat.jsx` | `/candidate/messages` | Candidat | Interface de chat minimaliste pour échanger avec les recruteurs. |

## 💼 ESPACE RECRUTEUR

| Page | Fichier JSX | Route | Acteur | Description & Features IA |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard IA** | `RecruiterDashboard.jsx` | `/recruiter/dashboard` | Recruteur | Vue d'ensemble avec statistiques sur le vivier et les entretiens à venir. |
| **Scoring Sémantique** | `RecruiterScoring.jsx` | `/recruiter/scoring` | Recruteur | **Cœur de l'IA** : Classement des candidats par score de matching. Détection des anomalies CV (Slide-over). |
| **Suivi & Filtres** | `RecruiterInterviews.jsx` | `/recruiter/interviews` | Recruteur | Tracking complet avec filtres avancés (Score, Statut). Évaluation post-entretien avec étoiles. |
| **Gestion Offres** | `RecruiterJobs.jsx` | `/recruiter/jobs` | Recruteur | CRUD des offres d'emploi avec limitation basée sur l'abonnement. |
| **Plans & Tarifs** | `RecruiterSubscription.jsx` | `/recruiter/subscription` | Recruteur | Grille tarifaire "Luxe" et suivi de la consommation des quotas IA. |

## 🛡️ ESPACE ADMINISTRATEUR

| Page | Fichier JSX | Route | Acteur | Description & Features IA |
| :--- | :--- | :--- | :--- | :--- |
| **Contrôle Système** | `AdminStats.jsx` | `/admin/stats` | Admin | Monitoring des tokens OpenAI, gestion des comptes utilisateurs et des abonnements globaux. |

---

## 🎨 DESIGN SYSTEM & STACK
- **Palette** : Nacre (`#FDFCF0`), Rose Doré (`#B76E79`), Slate-900.
- **Animations** : `framer-motion` (Spring transitions, AnimatePresence).
- **IA** : OpenAI `gpt-4o-mini` pour le parsing, le matching et l'analyse d'anomalies.
- **Frontend** : React 19 + Tailwind CSS 4.
