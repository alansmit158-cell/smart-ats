import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import RecruiterLayout from './layouts/RecruiterLayout';
import CandidateLayout from './layouts/CandidateLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - Recruiter
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterScoring from './pages/recruiter/RecruiterScoring';
import RecruiterMessages from './pages/recruiter/RecruiterMessages';
import RecruiterInterviews from './pages/recruiter/RecruiterInterviews';
import RecruiterSubscription from './pages/recruiter/RecruiterSubscription';
import Candidates from './pages/Candidates';
import Reports from './pages/Reports';

// Pages - Candidate
import CandidatePortal from './pages/candidate/CandidatePortal';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateChat from './pages/candidate/CandidateChat';
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateUpload from './pages/candidate/CandidateUpload';

// Pages - Admin
import AdminStats from './pages/admin/AdminStats';

import './App.css';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Recruiter Routes */}
          <Route path="/recruiter" element={
            <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
              <RecruiterLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="jobs" element={<RecruiterJobs />} />
            <Route path="scoring" element={<RecruiterScoring />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="interviews" element={<RecruiterInterviews />} />
            <Route path="messages" element={<RecruiterMessages />} />
            <Route path="subscription" element={<RecruiterSubscription />} />
            <Route path="reports" element={<Reports />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Candidate Routes */}
          <Route path="/candidate" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateLayout />
            </ProtectedRoute>
          }>
            <Route path="portal" element={<CandidatePortal />} />
            <Route path="explorer" element={<CandidatePortal />} />
            <Route path="applications" element={<CandidateApplications />} />
            <Route path="messages" element={<CandidateChat />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="upload" element={<CandidateUpload />} />
            <Route index element={<Navigate to="portal" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="stats" element={<AdminStats />} />
            <Route path="users" element={<AdminStats />} /> {/* Using same for now as requested */}
            <Route path="security" element={<div className="p-8 text-white"><h1 className="text-2xl font-bold">Firewall IA (Bientôt disponible)</h1></div>} />
            <Route path="logs" element={<AdminStats />} />
            <Route path="settings" element={<div className="p-8 text-white"><h1 className="text-2xl font-bold">Configuration Système (Bientôt disponible)</h1></div>} />
            <Route index element={<Navigate to="stats" replace />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
