import React from 'react';

const OrderSummaryCard = ({ order }) => {
  
  // Formatage de la date de commande
  let orderDate;
  if (order.date_commande?.seconds) {
    orderDate = new Date(order.date_commande.seconds * 1000).toLocaleDateString("fr-FR");
  } else {
    orderDate = "À l'instant";
  }

  // Création d'un "Numéro de Commande" (on prend les 8 premiers caractères de l'ID)
  const orderNumber = order.id.slice(0, 8).toUpperCase();

  // Gestion des couleurs de statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'validé': return 'bg-green-100 text-green-800';
      case 'en préparation': return 'bg-blue-100 text-blue-800';
      case 'refusé': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800'; // 'en attente'
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5">
      
      {/* --- En-tête : N° Commande et Date --- */}
      <div className="flex justify-between items-start mb-4 border-b border-zinc-100 pb-3">
        <div>
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
            Commande #{orderNumber}
          </p>
          <p className="text-sm text-zinc-400">Effectuée le {orderDate}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.statut)}`}>
          {order.statut}
        </span>
      </div>

      {/* --- Corps : Détails du Menu --- */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* On affiche le nom sauvegardé, ou un texte par défaut pour les vieilles commandes */}
          <h3 className="text-lg font-bold text-zinc-800">
            {order.nom_menu || "Menu (Nom indisponible)"}
          </h3>
          <p className="text-sm text-zinc-600">
            Pour <span className="font-semibold">{order.nombre_personne} personnes</span>
          </p>
          <p className="text-sm text-zinc-500 italic">
            Livraison : {order.date_prestation} à {order.heure_livraison}
          </p>
        </div>
        
        {/* --- Prix --- */}
        <div className="text-right">
          <p className="text-2xl font-bold text-green-700">
            {order.prix_total}
          </p>
        </div>
      </div>

      {/* --- Pied : Actions --- */}
      <div className="flex justify-end gap-3">
        {/* On pourrait ajouter un bouton "Voir le détail" ou "Annuler" ici plus tard */}
      </div>

    </div>
  );
};

export default OrderSummaryCard;