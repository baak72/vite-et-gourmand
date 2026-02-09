import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, AlertCircle, Clock, ChefHat, RotateCcw, Search, Menu as MenuIcon, ClipboardList, Star, X, XCircle, MapPin } from 'lucide-react';
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
      // Tri par date décroissante pour voir les nouvelles en premier
      data.sort((a, b) => b.date_commande?.seconds - a.date_commande?.seconds);
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
    setRefusalReason("");
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
    const baseStyle = "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 w-fit uppercase tracking-wider";
    switch (status) {
      case 'en attente': return `${baseStyle} bg-yellow-500/10 text-yellow-500 border-yellow-500/20`;
      case 'validé': return `${baseStyle} bg-blue-500/10 text-blue-400 border-blue-500/20`;
      case 'en préparation': return `${baseStyle} bg-amber-500/10 text-amber-500 border-amber-500/20`;
      case 'en cours de livraison': return `${baseStyle} bg-indigo-500/10 text-indigo-400 border-indigo-500/20`;
      case 'livré': return `${baseStyle} bg-cyan-500/10 text-cyan-400 border-cyan-500/20`;
      case 'en attente du retour de matériel': return `${baseStyle} bg-rose-500/10 text-rose-400 border-rose-500/20`;
      case 'terminée': return `${baseStyle} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      case 'annulé': return `${baseStyle} bg-red-500/10 text-red-500 border-red-500/20`;
      default: return `${baseStyle} bg-zinc-500/10 text-zinc-400 border-zinc-500/20`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente': return <Clock className="w-3 h-3" />;
      case 'validé': return <CheckCircle2 className="w-3 h-3" />;
      case 'en préparation': return <ChefHat className="w-3 h-3" />;
      case 'en cours de livraison': return <Truck className="w-3 h-3" />;
      case 'livré': return <MapPin className="w-3 h-3" />;
      case 'en attente du retour de matériel': return <RotateCcw className="w-3 h-3" />;
      case 'terminée': return <Package className="w-3 h-3" />;
      case 'annulé': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative font-sans">
      
      <style>{`
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-amber-500"></div>
            <h2 className="text-amber-500 font-bold tracking-widest uppercase text-xs">Administration</h2>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-8">Tableau de Bord</h1>
          
          {/* Onglets Scrollables */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-white/10">
            <button onClick={() => setActiveTab('orders')} className={`py-3 px-4 rounded-t-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-zinc-900 border-t border-x border-white/10 text-amber-500' : 'text-zinc-500 hover:text-white'}`}>
              <ClipboardList className="w-4 h-4" /> Suivi Commandes
            </button>
            <button onClick={() => setActiveTab('menus')} className={`py-3 px-4 rounded-t-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'menus' ? 'bg-zinc-900 border-t border-x border-white/10 text-amber-500' : 'text-zinc-500 hover:text-white'}`}>
              <MenuIcon className="w-4 h-4" /> Gestion Carte
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`py-3 px-4 rounded-t-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'bg-zinc-900 border-t border-x border-white/10 text-amber-500' : 'text-zinc-500 hover:text-white'}`}>
              <Star className="w-4 h-4" /> Avis Clients
            </button>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-b-2xl rounded-tr-2xl p-4 md:p-6 min-h-[500px]">
        
        {/* --- ONGLET COMMANDES --- */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {submitError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" /><p>{submitError}</p></div>}
            
            {/* Barre de Recherche et Filtres */}
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3 w-full sm:w-auto text-zinc-400">
                 <Search className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase hidden sm:block">Filtre</span>
              </div>
              <div className="flex w-full">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 cursor-pointer appearance-none font-bold uppercase tracking-wider">
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
               <div className="flex flex-col justify-center items-center py-24 gap-4">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                   <p className="text-zinc-500 text-xs uppercase tracking-widest">Chargement des commandes...</p>
               </div>
            ) : (
              <>
              {/* --- VUE MOBILE : LISTE DE CARTES --- */}
              <div className="md:hidden space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-zinc-900 border border-white/10 rounded-xl p-5 shadow-lg">
                        {/* Header Carte */}
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                            <div>
                                <h3 className="font-bold text-white text-lg">{order.nom} {order.prenom}</h3>
                                <div className="text-zinc-500 text-xs break-all">{order.email}</div>
                                <div className="text-zinc-500 text-xs mt-1">{order.telephone}</div>
                            </div>
                            <div className={getStatusStyle(order.statut)}>{getStatusIcon(order.statut)}</div>
                        </div>

                        {/* Corps Carte */}
                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400 text-sm">Menu :</span>
                                <span className="text-amber-500 font-bold">{order.nom_menu}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400 text-sm">Convives :</span>
                                <span className="text-white">{order.nombre_personne} pers.</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400 text-sm">Total :</span>
                                <span className="text-white font-bold">{order.prix_total} €</span>
                            </div>
                            {order.instructions && (
                                <div className="bg-white/5 p-3 rounded-lg text-xs text-zinc-300 italic mt-3">
                                    "{order.instructions}"
                                </div>
                            )}
                        </div>

                        {/* Actions Carte */}
                        <div className="flex flex-col gap-2">
                            {order.statut === 'en attente' && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleStatusChange(order.id, 'validé')} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg text-sm">Valider</button>
                                    <button onClick={() => openRefuseModal(order)} className="flex-1 bg-red-600/20 text-red-500 border border-red-600/50 font-bold py-3 rounded-lg text-sm">Refuser</button>
                                </div>
                            )}
                            {order.statut === 'validé' && <button onClick={() => handleStatusChange(order.id, 'en préparation')} className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg text-sm">Lancer Préparation</button>}
                            {order.statut === 'en préparation' && <button onClick={() => handleStatusChange(order.id, 'en cours de livraison')} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg text-sm">Expédier / Livrer</button>}
                            {order.statut === 'en cours de livraison' && (order.pret_materiel ? 
                                <button onClick={() => handleStatusChange(order.id, 'en attente du retour de matériel')} className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg text-sm">Attendre Retour Matériel</button> : 
                                <button onClick={() => handleStatusChange(order.id, 'terminée')} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg text-sm">Clôturer Commande</button>
                            )}
                            {order.statut === 'en attente du retour de matériel' && <button onClick={() => handleStatusChange(order.id, 'terminée')} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg text-sm">Confirmer Retour & Clôturer</button>}
                        </div>
                    </div>
                ))}
              </div>

              {/* --- VUE PC : TABLEAU CLASSIQUE --- */}
              <div className="hidden md:block bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
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
                              <span className="text-zinc-500 text-xs">{order.telephone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <span className="text-amber-500 font-medium text-sm">{order.nom_menu}</span>
                              <span className="text-zinc-400 text-xs">{order.nombre_personne} pers. • {order.prix_total} €</span>
                              {order.instructions && <div className="mt-2 text-xs text-zinc-400 italic bg-white/5 p-2 rounded max-w-xs truncate">"{order.instructions}"</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className={getStatusStyle(order.statut)}>
                                {getStatusIcon(order.statut)} 
                                <span className="hidden lg:inline">{order.statut}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top flex flex-col gap-2 min-w-[180px]">
                            {/* BOUTONS D'ACTION (PC) */}
                            {order.statut === 'en attente' && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleStatusChange(order.id, 'validé')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Valider</button>
                                    <button onClick={() => openRefuseModal(order)} className="flex-1 bg-red-600/20 border border-red-600/50 hover:bg-red-600 text-red-500 hover:text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors">Refuser</button>
                                </div>
                            )}
                            {order.statut === 'validé' && <button onClick={() => handleStatusChange(order.id, 'en préparation')} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Préparer</button>}
                            {order.statut === 'en préparation' && <button onClick={() => handleStatusChange(order.id, 'en cours de livraison')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Livrer</button>}
                            {order.statut === 'en cours de livraison' && (order.pret_materiel ? 
                              <button onClick={() => handleStatusChange(order.id, 'en attente du retour de matériel')} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Attente Matériel</button> : 
                              <button onClick={() => handleStatusChange(order.id, 'terminée')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Terminer</button>
                            )}
                            {order.statut === 'en attente du retour de matériel' && <button onClick={() => handleStatusChange(order.id, 'terminée')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Matériel Reçu</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
            )}
          </div>
        )}

        {/* --- ONGLET MENUS --- */}
        {activeTab === 'menus' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminMenusTab />
          </div>
        )}

        {/* --- ONGLET AVIS --- */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminReviewsTab />
          </div>
        )}
        
        </div>

      </div>

      {/* --- MODALE DE REFUS --- */}
      {isRefuseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                <button onClick={() => setIsRefuseModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2">
                     <X className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-bold text-white mb-2 pr-8">Refuser la commande</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Cette action est <strong>irréversible</strong>. La commande sera annulée et le client recevra un email avec le motif ci-dessous.
                </p>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">
                        Motif du refus
                    </label>
                    <textarea 
                        value={refusalReason}
                        onChange={(e) => setRefusalReason(e.target.value)}
                        placeholder="Ex: Malheureusement, nous sommes complets pour ce créneau horaire..."
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-4 h-32 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none text-sm placeholder:text-zinc-600"
                    />
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsRefuseModalOpen(false)}
                        className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-800 transition-colors uppercase text-xs tracking-wider"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleConfirmRefuse}
                        disabled={isRefusing || !refusalReason.trim()}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-xs tracking-wider shadow-lg shadow-red-900/20"
                    >
                        {isRefusing ? "Traitement..." : "Confirmer le refus"}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboardView;