import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../utils/firebase';
import { Package, Truck, CheckCircle2, AlertCircle, Clock, ChefHat, RotateCcw, Search, MessageSquare } from 'lucide-react';

const EmployeeDashboardView = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Chargement des commandes
  const fetchAllOrders = async (filter) => {
    setIsLoading(true);
    try {
      const data = await getAllOrders(filter);
      setOrders(data);
    } catch (error) {
      console.error("Erreur récupération globale commandes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders(statusFilter);
  }, [statusFilter]);

  // Fonction pour changer le statut
  const handleStatusChange = async (orderId, newStatus) => {
    setSubmitError(null);
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchAllOrders(statusFilter);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setSubmitError("Erreur : Impossible de mettre à jour le statut. Vérifiez les droits.");
    }
  };

  // Fonction utilitaire pour le style des BADGES
  const getStatusStyle = (status) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 w-fit";
    switch (status) {
      case 'en attente':
        return `${baseStyle} bg-yellow-500/10 text-yellow-500 border-yellow-500/20`;
      case 'validé':
        return `${baseStyle} bg-blue-500/10 text-blue-400 border-blue-500/20`;
      case 'en préparation':
        return `${baseStyle} bg-amber-500/10 text-amber-500 border-amber-500/20`;
      case 'en cours de livraison':
        return `${baseStyle} bg-indigo-500/10 text-indigo-400 border-indigo-500/20`;
      case 'en attente du retour de matériel':
        return `${baseStyle} bg-rose-500/10 text-rose-400 border-rose-500/20`;
      case 'terminée':
        return `${baseStyle} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      default:
        return `${baseStyle} bg-zinc-500/10 text-zinc-400 border-zinc-500/20`;
    }
  };

  // Fonction pour l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente': return <Clock className="w-3 h-3" />;
      case 'validé': return <CheckCircle2 className="w-3 h-3" />;
      case 'en préparation': return <ChefHat className="w-3 h-3" />;
      case 'en cours de livraison': return <Truck className="w-3 h-3" />;
      case 'en attente du retour de matériel': return <RotateCcw className="w-3 h-3" />;
      case 'terminée': return <Package className="w-3 h-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-sm">Administration</h2>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white">Suivi des Commandes</h1>
          </div>
        </div>

        {/* Affichage des erreurs de soumission */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Erreur de mise à jour</p>
              <p className="text-sm">{submitError}</p>
            </div>
          </div>
        )}

        {/* --- Le filtre --- */}
        <div className="mb-8 bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-full text-amber-500">
            <Search className="w-5 h-5" />
          </div>
          <div className="flex w-full">
            <label htmlFor="statusFilter" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Filtrer par statut</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
            >
              <option value="all">Toutes les commandes</option>
              <option value="en attente">En attente de validation</option>
              <option value="validé">Validé</option>
              <option value="en préparation">En préparation</option>
              <option value="en cours de livraison">En cours de livraison</option>
              <option value="livré">Livré</option>
              <option value="en attente du retour de matériel">Attente du retour de matériel</option>
              <option value="terminée">Terminée</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        {/* --- La Table --- */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          {orders.length === 0 && statusFilter === 'all' && !isLoading ? (
            <div className="p-12 text-center flex flex-col items-center text-zinc-500">
              <Package className="w-16 h-16 mb-4 opacity-20" />
              <p>Aucune commande enregistrée pour le moment.</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-amber-500">
              <p>Aucune commande trouvée pour ce statut.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-white/5">
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Détails Menu & Instructions</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Planning</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Statut Actuel</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions requises</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">

                      {/* Client */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm">{order.nom} {order.prenom}</span>
                          <span className="text-zinc-500 text-xs">{order.email}</span>
                          {order.gsm && <span className="text-zinc-500 text-xs">{order.gsm}</span>}
                          {order.nom_entreprise && <span className="text-amber-500/70 text-[10px] uppercase font-bold mt-1">{order.nom_entreprise}</span>}
                        </div>
                      </td>

                      {/* Menu & INSTRUCTIONS */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-amber-500 font-medium text-sm">{order.nom_menu}</span>
                          <span className="text-zinc-400 text-xs">{order.nombre_personne} pers. • <span className="text-white font-bold">{order.prix_total}</span></span>

                          {/* --- BLOC INSTRUCTIONS --- */}
                          {order.instructions && (
                            <div className="mt-3 flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-lg max-w-xs">
                              <MessageSquare className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-zinc-300 italic leading-relaxed">
                                "{order.instructions}"
                              </p>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">{order.date_prestation}</span>
                          <span className="text-zinc-500 text-xs">{order.heure_livraison}</span>
                        </div>
                      </td>

                      {/* Statut (Badge) */}
                      <td className="px-6 py-4 align-top">
                        <span className={getStatusStyle(order.statut)}>
                          {getStatusIcon(order.statut)}
                          {order.statut}
                        </span>
                      </td>

                      {/* --- ACTIONS --- */}
                      <td className="px-6 py-4 align-top flex flex-col gap-2 min-w-[200px]">

                        {/* 1. EN ATTENTE -> VALIDER */}
                        {order.statut === 'en attente' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'validé')}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Valider
                          </button>
                        )}

                        {/* 2. VALIDÉ -> PRÉPARATION */}
                        {order.statut === 'validé' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'en préparation')}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                          >
                            <ChefHat className="w-3 h-3" /> Lancer Préparation
                          </button>
                        )}

                        {/* 3. PRÉPARATION -> LIVRAISON */}
                        {order.statut === 'en préparation' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'en cours de livraison')}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                          >
                            <Truck className="w-3 h-3" /> Partir en livraison
                          </button>
                        )}

                        {/* 4. LIVRAISON -> FIN ou MATÉRIEL */}
                        {order.statut === 'en cours de livraison' && (
                          <>
                            {order.pret_materiel ? (
                              <button
                                onClick={() => handleStatusChange(order.id, 'en attente du retour de matériel')}
                                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <RotateCcw className="w-3 h-3" /> Livré & Attente Matériel
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(order.id, 'terminée')}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Livré & Terminé
                              </button>
                            )}
                          </>
                        )}

                        {/* 5. RETOUR MATÉRIEL -> TERMINE */}
                        {order.statut === 'en attente du retour de matériel' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'terminée')}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Matériel Reçu
                          </button>
                        )}

                        {/* 6. TERMINE */}
                        {(order.statut === 'terminée' || order.statut === 'annulé') && (
                          <span className="text-xs text-zinc-600 font-medium italic text-center">Aucune action requise</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardView;