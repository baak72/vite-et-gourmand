import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useAuthStore } from '../store/useAuthStore';

const RoleProtectedRoute = () => {
  // On vérifie si connecté
  const { loggedIn, checkingStatus } = useAuthStatus();
  // On récupère les infos du profil
  const user = useAuthStore((state) => state.user);

  if (checkingStatus) {
    return <div className="p-8 text-center">Vérification des accès...</div>;
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // VÉRIFICATION DU RÔLE
  // Si le rôle est strictement supérieur à 2 (donc 3 = Client), on bloque.
  // (Admin=1 et Employé=2)
  if (user && user.role_id > 2) {
    // On redirige le client vers son profil normal
    return <Navigate to="/profil" replace />;
  }

  // Si c'est un Admin (1) ou Employé (2), on laisse passer
  return <Outlet />;
};

export default RoleProtectedRoute;