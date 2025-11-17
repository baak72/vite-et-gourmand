import React from 'react';

// On s'attend à recevoir un objet "order" en "prop"
const OrderSummaryCard = ({ order }) => {
  
  // On formate la date
  const orderDate = new Date(order.date_commande.seconds * 1000).toLocaleDateString("fr-FR");

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-zinc-500">Commande du {orderDate}</p>
        <p className="text-lg font-semibold text-zinc-800">
          (Nom du Menu à récupérer)
        </p>
        <p className="text-lg font-bold text-green-700">
          {order.prix_menu} €
        </p>
      </div>
      <div>
        <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
          {order.statut}
        </span>
      </div>
    </div>
  );
};

export default OrderSummaryCard;