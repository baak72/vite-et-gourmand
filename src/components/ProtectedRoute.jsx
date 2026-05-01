import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = () => {
  // On regarde dans Zustand si on a un utilisateur
  const user = useAuthStore((state) => state.user);
  
  // On regarde dans le navigateur si on a le Token Laravel
  const token = localStorage.getItem('auth_token');

  // Si on a le token OU l'utilisateur, c'est qu'on est connecté : on ouvre la porte
  if (user || token) {
    return <Outlet />; 
  }
  
  // Sinon, on renvoie à la page de connexion
  return <Navigate to="/login" replace />; 
};

export default ProtectedRoute;