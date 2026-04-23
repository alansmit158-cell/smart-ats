import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 font-medium anim-pulse">Chargement intelligent...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirige par défaut selon le rôle pour éviter les blocages
        const redirectPath = user.role === 'recruiter' 
            ? '/recruiter/dashboard' 
            : (user.role === 'admin' ? '/admin/stats' : '/candidate/portal');
            
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
