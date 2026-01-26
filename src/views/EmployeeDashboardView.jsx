import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, AlertCircle, Clock, ChefHat, RotateCcw, Search, MessageSquare, Menu as MenuIcon, ClipboardList } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../utils/firebase';
import AdminMenusTab from "../components/AdminMenusTab"; // Assure-toi que le chemin est bon

const EmployeeDashboardView = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Helpers (inchangés)
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
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-sm">Administration</h2>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6">Tableau de Bord</h1>
          
          <div className="flex gap-6 border-b border-white/10">
            <button onClick={() => setActiveTab('orders')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${activeTab === 'orders' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-white'}`}>
              <ClipboardList className="w-4 h-4" /> Suivi Commandes
            </button>
            <button onClick={() => setActiveTab('menus')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${activeTab === 'menus' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-white'}`}>
              <MenuIcon className="w-4 h-4" /> Gestion Carte
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
                            {/* Actions dynamiques (inchangées) */}
                            {order.statut === 'en attente' && <button onClick={() => handleStatusChange(order.id, 'validé')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2">Valider</button>}
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

        {/* 2. ONGLET MENUS */}
        {activeTab === 'menus' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminMenusTab />
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeDashboardView;