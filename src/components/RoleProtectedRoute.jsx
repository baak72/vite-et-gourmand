import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const RoleProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const token = localStorage.getItem('auth_token');
  const location = useLocation();

  // Si la personne n'est pas connectée du tout -> page Login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // Si la personne est connectée, on attend d'avoir ses infos pour vérifier son rôle
  if (user) {
    // Si c'est un client (role_id = 3) -> Retour à l'accueil
    if (user.role_id === 3) {
      return <Navigate to="/" replace />;
    }

    // Sécurité stricte : Si un employé (2) essaie d'aller sur la page Admin (/admin)
    if (location.pathname.startsWith('/admin') && user.role_id !== 1) {
      return <Navigate to="/employe/dashboard" replace />; // On le renvoie dans sa propre zone
    }
  }

  return <Outlet />;
};

export default RoleProtectedRoute;