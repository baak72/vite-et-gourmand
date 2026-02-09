import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getOrdersByUserId, cancelOrder, addReview } from '../utils/firebase';
import OrderSummaryCard from '../components/OrderSummaryCard';
import UpdateProfileForm from '../components/UpdateProfileForm';
import ReviewFormModal from '../components/ReviewFormModal';
import { User, ShoppingBag, Loader2, Search, ListFilter } from 'lucide-react';

const ProfilView = () => {
  const user = useAuthStore((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // --- ÉTATS POUR LA MODALE D'AVIS ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- ÉTAT UX MOBILE (Onglets) ---
  // Par défaut sur mobile, on montre les commandes (plus important)
  const [activeTab, setActiveTab] = useState('orders'); 

  const fetchOrders = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      const userOrders = await getOrdersByUserId(user.uid);
      // Tri par date décroissante (les plus récentes en premier)
      userOrders.sort((a, b) => b.date_commande.seconds - a.date_commande.seconds);
      setOrders(userOrders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) return;

    try {
      await cancelOrder(orderId);
      await fetchOrders();
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Impossible d'annuler la commande.");
    }
  };

  // --- GESTION DES AVIS ---
  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    if (!user || !selectedOrder) return;

    try {
      await addReview({
        ...reviewData,
        uid: user.uid,
        nom: user.nom || "Anonyme",
        prenom: user.prenom || "Client",
        commande_id: selectedOrder.id,
        menu_concerne: selectedOrder.nom_menu
      });
      alert("Merci ! Votre avis a été envoyé et sera visible après validation.");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error);
      alert("Erreur lors de l'envoi de l'avis.");
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.statut === statusFilter);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-28 pb-24 md:pt-36 md:pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <style>{`
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="h-[1px] w-8 bg-amber-500"></div>
                <h2 className="text-amber-500 font-bold tracking-widest uppercase text-xs">Espace Client</h2>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold">
              Bonjour, <span className="text-amber-500 font-medium italic">{user.prenom || "Gourmet"}</span>.
            </h1>
          </div>
        </div>

        {/* --- NAVIGATION ONGLETS (MOBILE UNIQUEMENT) --- */}
        <div className="flex lg:hidden bg-white/5 p-1 rounded-xl mb-8">
            <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
                <ShoppingBag size={16} /> Mes Commandes
            </button>
            <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'profile' ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
                <User size={16} /> Mon Profil
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* === COLONNE GAUCHE : PROFIL === */}
          <div className={`${activeTab === 'profile' ? 'block' : 'hidden'} lg:block lg:col-span-1 space-y-6 lg:sticky lg:top-32`}>
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold font-montserrat uppercase tracking-wide">Mes Infos</h2>
              </div>

              <div className="relative z-10">
                <UpdateProfileForm user={user} />
              </div>
            </div>
          </div>

          {/* === COLONNE DROITE : COMMANDES === */}
          <div className={`${activeTab === 'orders' ? 'block' : 'hidden'} lg:block lg:col-span-2`}>
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 md:p-8">

              {/* Header de section + Filtres */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold font-montserrat uppercase tracking-wide">Historique</h2>
                </div>

                {/* Sélecteur de filtre stylisé */}
                <div className="relative">
                    <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-zinc-950 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl pl-9 pr-8 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full md:w-auto cursor-pointer appearance-none transition-all hover:bg-zinc-900"
                    >
                    <option value="all">Tout afficher</option>
                    <option value="en attente">En attente</option>
                    <option value="validé">Validée</option>
                    <option value="en préparation">En préparation</option>
                    <option value="en cours de livraison">En livraison</option>
                    <option value="terminée">Terminée</option>
                    <option value="annulé">Annulée</option>
                    </select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 opacity-50">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
                  <p className="text-xs uppercase tracking-widest">Recherche de vos festins...</p>
                </div>
              ) : orders.length > 0 ? (
                // Desktop: Hauteur fixe avec scroll | Mobile: Hauteur auto (scroll page entier)
                <div
                  data-lenis-prevent
                  className="lg:h-[600px] lg:overflow-y-auto lg:pr-2 space-y-4 scroll-smooth custom-scrollbar"
                >
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <OrderSummaryCard
                        key={order.id}
                        order={order}
                        onCancel={() => handleCancelOrder(order.id)}
                        onReview={handleOpenReviewModal}
                      />
                    ))
                  ) : (
                    <div className="text-center py-16 text-zinc-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Aucune commande "{statusFilter}".</p>
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="text-amber-500 text-xs font-bold mt-4 uppercase tracking-wider border-b border-amber-500/30 hover:border-amber-500 pb-0.5 transition-all"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <div className="bg-zinc-800 p-4 rounded-full mb-4">
                    <ShoppingBag className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-montserrat">C'est bien vide ici</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-6">
                    Découvrez nos menus et commencez à planifier votre prochain événement.
                  </p>
                  <a href="/menus" className="bg-amber-500 text-black px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                    Voir la carte
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* MODALE D'AVIS */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        order={selectedOrder}
      />

    </div>
  );
};

export default ProfilView;