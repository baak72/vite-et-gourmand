import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';

const ProtectedRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <div>Chargement...</div>;
  }

  if (loggedIn) {
    return <Outlet />; // On affiche la page ProfilView
  }
  
  // Si on a fini de vérifier ET que loggedIn est FAUX
  return <Navigate to="/login" replace />; // On renvoie à la connexion
};

export default ProtectedRoute;