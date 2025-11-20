import React from 'react';

const MentionsLegalesView = () => {
  return (
    <div className="container mx-auto p-8 max-w-4xl text-zinc-800">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Mentions Légales</h1>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Informations Légales</h2>
      <p>Raison sociale : Vite & Gourmand SARL</p>
      <p>Siège social : 123 Rue des Saveurs, 33000 Bordeaux</p>
      <p>Numéro de téléphone : 05 56 XX XX XX</p>
      <p>Adresse e-mail : contact@viteetgourmand.fr</p>
      <p>Numéro d’immatriculation : 421 214 742 RCS Bordeaux</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Directeur de la publication</h2>
      <p>José et Julie Gourmand (Co-gérants)</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Hébergement</h2>
      <p>Le Site est hébergé par Firebase (Google Cloud Platform), situé à Dublin, Irlande.</p>
    </div>
  );
};

export default MentionsLegalesView;