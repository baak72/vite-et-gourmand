import React, { useState, useEffect } from 'react';
// J'ai ajouté l'icône 'X' dans les imports
import { Package, Truck, CheckCircle2, AlertCircle, Clock, ChefHat, RotateCcw, Search, MessageSquare, Menu as MenuIcon, ClipboardList, Star, X } from 'lucide-react';
// J'ai ajouté 'refuseOrder' dans les imports
import { getAllOrders, updateOrderStatus, refuseOrder } from '../utils/firebase';
import AdminMenusTab from "../components/AdminMenusTab";
import AdminReviewsTab from "../components/AdminReviewsTab";

const EmployeeDashboardView = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // --- ÉTATS POUR LA MODALE DE REFUS ---
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  const [orderToRefuse, setOrderToRefuse] = useState(null);
  const [refusalReason, setRefusalReason] = useState("");
  const [isRefusing, setIsRefusing] = useState(false);

  const fetchAllOrders = async (filter) => {
    setIsLoading(true);
    try {
      const data = await getAllOrders(filter);
      setOrders(data);
    } catch (error) {
      console.error("Erreur commandes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchAllOrders(statusFilter);
  }, [statusFilter, activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    setSubmitError(null);
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchAllOrders(statusFilter);
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      setSubmitError("Impossible de mettre à jour. Vérifiez les droits.");
    }
  };

  // --- GESTION DU REFUS ---
  const openRefuseModal = (order) => {
    setOrderToRefuse(order);
    setRefusalReason(""); // Reset du texte
    setIsRefuseModalOpen(true);
  };

  const handleConfirmRefuse = async () => {
    if (!refusalReason.trim()) return alert("Veuillez indiquer un motif.");
    
    setIsRefusing(true);
    try {
      await refuseOrder(orderToRefuse.id, refusalReason);
      
      // Fermer et rafraîchir
      setIsRefuseModalOpen(false);
      setOrderToRefuse(null);
      fetchAllOrders(statusFilter);
      
    } catch (error) {
      alert("Erreur lors du refus : " + error.message);
    } finally {
      setIsRefusing(false);
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 w-fit";
    switch (status) {
      case 'en attente': return `${baseStyle} bg-yellow-500/10 text-yellow-500 border-yellow-500/20`;
      case 'validé': return `${baseStyle} bg-blue-500/10 text-blue-400 border-blue-500/20`;
      case 'en préparation': return `${baseStyle} bg-amber-500/10 text-amber-500 border-amber-500/20`;
      case 'en cours de livraison': return `${baseStyle} bg-indigo-500/10 text-indigo-400 border-indigo-500/20`;
      case 'en attente du retour de matériel': return `${baseStyle} bg-rose-500/10 text-rose-400 border-rose-500/20`;
      case 'terminée': return `${baseStyle} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      default: return `${baseStyle} bg-zinc-500/10 text-zinc-400 border-zinc-500/20`;
    }
  };

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-sm">Administration</h2>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6">Tableau de Bord</h1>
          
          <div className="flex gap-6 border-b border-white/10 overflow-x-auto">
            <button onClick={() => setActiveTab('orders')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'orders' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-white'}`}>
              <ClipboardList className="w-4 h-4" /> Suivi Commandes
            </button>
            <button onClick={() => setActiveTab('menus')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'menus' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-white'}`}>
              <MenuIcon className="w-4 h-4" /> Gestion Carte
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-white'}`}>
              <Star className="w-4 h-4" /> Avis Clients
            </button>
          </div>
        </div>

        {/* CONTENU */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {submitError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" /><p>{submitError}</p></div>}
            
            <div className="mb-8 bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full text-amber-500"><Search className="w-5 h-5" /></div>
              <div className="flex w-full">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 cursor-pointer">
                  <option value="all">Toutes les commandes</option>
                  <option value="en attente">En attente</option>
                  <option value="validé">Validé</option>
                  <option value="en préparation">En préparation</option>
                  <option value="en cours de livraison">En livraison</option>
                  <option value="livré">Livré</option>
                  <option value="en attente du retour de matériel">Retour Matériel</option>
                  <option value="terminée">Terminée</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>
            </div>

            {isLoading ? (
               <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div></div>
            ) : (
              <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr className="bg-zinc-950/50 border-b border-white/5">
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Détails Menu</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-sm">{order.nom} {order.prenom}</span>
                              <span className="text-zinc-500 text-xs">{order.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <span className="text-amber-500 font-medium text-sm">{order.nom_menu}</span>
                              <span className="text-zinc-400 text-xs">{order.nombre_personne} pers. • {order.prix_total}</span>
                              {order.instructions && <div className="mt-2 text-xs text-zinc-400 italic bg-white/5 p-2 rounded">"{order.instructions}"</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className={getStatusStyle(order.statut)}>{getStatusIcon(order.statut)} {order.statut}</span>
                          </td>
                          <td className="px-6 py-4 align-top flex flex-col gap-2 min-w-[200px]">
                            
                            {/* BOUTONS D'ACTION */}
                            {order.statut === 'en attente' && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleStatusChange(order.id, 'validé')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2">
                                        Valider
                                    </button>
                                    <button onClick={() => openRefuseModal(order)} className="flex-1 bg-red-600/20 border border-red-600/50 hover:bg-red-600 text-red-500 hover:text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors">
                                        Refuser
                                    </button>
                                </div>
                            )}

                            {order.statut === 'validé' && <button onClick={() => handleStatusChange(order.id, 'en préparation')} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2">Préparer</button>}
                            {order.statut === 'en préparation' && <button onClick={() => handleStatusChange(order.id, 'en cours de livraison')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2">Livrer</button>}
                            {order.statut === 'en cours de livraison' && (order.pret_materiel ? 
                              <button onClick={() => handleStatusChange(order.id, 'en attente du retour de matériel')} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2">Attente Matériel</button> : 
                              <button onClick={() => handleStatusChange(order.id, 'terminée')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2">Terminer</button>
                            )}
                            {order.statut === 'en attente du retour de matériel' && <button onClick={() => handleStatusChange(order.id, 'terminée')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2">Matériel Reçu</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ONGLET MENUS */}
        {activeTab === 'menus' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminMenusTab />
          </div>
        )}

        {/* ONGLET AVIS */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminReviewsTab />
          </div>
        )}

      </div>

      {/* --- MODALE DE REFUS --- */}
      {isRefuseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Refuser la commande</h3>
                    <button onClick={() => setIsRefuseModalOpen(false)} className="text-zinc-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-zinc-400 text-sm mb-4">
                    Attention, cette action est <strong>irréversible</strong>. La commande sera supprimée et un email sera envoyé au client.
                </p>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        Motif du refus (Envoyé au client)
                    </label>
                    <textarea 
                        value={refusalReason}
                        onChange={(e) => setRefusalReason(e.target.value)}
                        placeholder="Ex: Malheureusement, nous sommes complets pour ce créneau horaire..."
                        className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl p-4 h-32 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
                    />
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsRefuseModalOpen(false)}
                        className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-800 transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleConfirmRefuse}
                        disabled={isRefusing || !refusalReason.trim()}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isRefusing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Confirmer le refus"
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboardView;