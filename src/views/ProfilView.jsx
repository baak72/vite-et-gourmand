import React from 'react';
import { useAuthStore } from '../store/useAuthStore'; // On importe Zustand

const ProfilView = () => {
  // On lit les infos de l'utilisateur depuis Zustand
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Mon Compte
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <p className="text-lg">
          <span className="font-semibold">Bonjour !</span>
        </p>
        <p className="text-zinc-700">
          (On affichera les infos de {user?.email} ici)
        </p>
      </div>
    </div>
  );
};

export default ProfilView;