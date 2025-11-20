import React from 'react';
// On utilisera 'useAuthStore' plus tard pour récupérer le rôle (Admin)

const AdminDashboardView = () => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-zinc-800 mb-8">
        Espace Administrateur : Vue d'ensemble
      </h1>
      <p className="text-zinc-600">
        (Ici, nous ajouterons les graphiques et le calcul du Chiffre d'Affaires [cite: 236-238].)
      </p>

      <section className="my-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Bloc Chiffre d'Affaires */}
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-700">
          <h2 className="text-xl font-semibold mb-3">Chiffre d'Affaires Total</h2>
          <p className="text-4xl font-bold text-zinc-900">12 450 €</p>
          <p className="text-sm text-zinc-500 mt-2">Détails et filtres par menu/durée (à venir)</p>
        </div>

        {/* 2. Bloc Graphique Commandes */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Commandes par Menu</h2>
          <div className="h-64 flex justify-center items-center bg-zinc-50 rounded-md">
            (Graphique NoSQL ici)
          </div>
        </div>
      </section>

      <section className="my-10 p-6 bg-red-100 border-l-4 border-red-500 rounded-lg">
        <h2 className="text-2xl font-semibold text-red-800 mb-3">Gestion des Comptes Employés</h2>
        <p className="text-red-700">
          (C'est ici qu'on utilisera nos Cloud Functions pour créer ou désactiver un compte.)
        </p>
      </section>

    </div>
  );
};

export default AdminDashboardView;