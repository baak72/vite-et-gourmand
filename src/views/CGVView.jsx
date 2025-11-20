import React from 'react';

const CGVView = () => {
  return (
    <div className="container mx-auto p-8 max-w-4xl text-zinc-800">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Conditions Générales de Vente (CGV)</h1>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">Article 1 : Réservation et Commande</h2>
      <p>Toute commande est ferme et définitive après validation du paiement à la livraison ou sur facture. Les conditions spécifiques de délai de commande (ex: 1 mois à l'avance pour le menu Noël) sont indiquées sur la fiche produit et sont contractuelles.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Article 2 : Frais de Livraison</h2>
      <p>La livraison dans la ville de Bordeaux est gratuite. Pour toute autre destination, des frais forfaitaires de 5,00€ sont appliqués (hors suppléments kilométriques éventuels non gérés par l'application).</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Article 3 : Prêt de Matériel et Pénalités</h2>
      <p>En cas de prêt de matériel (vaisselle, contenants), le client s'engage à restituer l'intégralité du matériel dans un délai de 10 jours ouvrés suivant la livraison. Si le statut de la commande reste "en attente du retour de matériel" au-delà de ce délai, une pénalité forfaitaire de <span className="font-bold text-red-600">600 €</span> sera appliquée par facture pour non-restitution du matériel.</p>
    </div>
  );
};

export default CGVView;