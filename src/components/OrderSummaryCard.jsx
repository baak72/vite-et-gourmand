import React from 'react';
import { Calendar, Clock, Users, Utensils, XCircle, MessageSquarePlus } from 'lucide-react';

const OrderSummaryCard = ({ order, onCancel, onReview }) => {

  // 1. Gestion de la date de commande
  let orderDate = "À l'instant";
  if (order.date_commande) {
    const parsedDate = new Date(order.date_commande);
    if (!isNaN(parsedDate)) {
      orderDate = parsedDate.toLocaleDateString("fr-FR");
    }
  }

  // 2. Gestion de l'ID
  const orderNumber = order.numero_commande 
    ? String(order.numero_commande).padStart(4, '0') 
    : "N/A";

  // 3. Calcul du prix total (prix_menu + prix_livraison)
  const totalPrix = (order.prix_menu !== undefined && order.prix_livraison !== undefined)
    ? (Number(order.prix_menu) + Number(order.prix_livraison)).toFixed(2) + " €"
    : "En cours...";

  // Fonction de style pour les badges
  const getStatusStyle = (status) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (status?.toLowerCase()) { 
      case 'validé': return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      case 'en préparation': return `${base} bg-amber-500/10 text-amber-500 border-amber-500/20`;
      case 'en cours de livraison': return `${base} bg-indigo-500/10 text-indigo-400 border-indigo-500/20`;
      case 'livré':
      case 'terminée': return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      case 'annulé': return `${base} bg-red-500/10 text-red-400 border-red-500/20`;
      case 'en attente':
      default: return `${base} bg-yellow-500/10 text-yellow-500 border-yellow-500/20`;
    }
  };

  return (
    <div className="group bg-zinc-900 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden">

      {/* Effet de survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>

      {/* --- EN-TÊTE --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 p-2 rounded-lg">
            <Utensils className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
              Commande #{orderNumber}
            </p>
            <div className="flex items-center gap-1 text-zinc-400 text-xs mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>Passée le {orderDate}</span>
            </div>
          </div>
        </div>
        <span className={getStatusStyle(order.statut)}>
          {order.statut}
        </span>
      </div>

      {/* --- CORPS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

        {/* Détails Menu */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-white font-montserrat mb-2 group-hover:text-amber-500 transition-colors">
            {order.nom_menu || "Menu Commandé"}
          </h3>

          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-950/50 px-3 py-1.5 rounded-md border border-white/5">
              <Users className="w-4 h-4 text-amber-500" />
              <span><span className="font-bold text-white">{order.nombre_personne}</span> convives</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-950/50 px-3 py-1.5 rounded-md border border-white/5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pour le <span className="text-white">{order.date_prestation}</span> à <span className="text-white">{order.heure_livraison}</span></span>
            </div>
          </div>
        </div>

        {/* Prix & Total */}
        <div className="flex flex-col md:items-end justify-center">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Total TTC</p>
          <p className="text-3xl font-bold font-playfair text-amber-500">
            {totalPrix}
          </p>
        </div>
      </div>

      {/* --- ACTIONS (Annuler OU Laisser un avis) --- */}
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-3">

        {/* Bouton Annuler */}
        {order.statut === 'en attente' && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <XCircle className="w-4 h-4" />
            Annuler la commande
          </button>
        )}

        {/* Bouton Laisser un avis */}
        {order.statut === 'terminée' && (
          <button
            onClick={() => onReview && onReview(order)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-700 hover:border-white bg-zinc-800/50 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Laisser un avis
          </button>
        )}

      </div>

    </div>
  );
};

export default OrderSummaryCard;