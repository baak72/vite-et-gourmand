import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getOrdersByUserId, cancelOrder, addReview } from '../utils/firebase';
import OrderSummaryCard from '../components/OrderSummaryCard';
import UpdateProfileForm from '../components/UpdateProfileForm';
import ReviewFormModal from '../components/ReviewFormModal';
import { User, ShoppingBag, Loader2, Search } from 'lucide-react';

const ProfilView = () => {
  const user = useAuthStore((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // --- ÉTATS POUR LA MODALE D'AVIS ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      const userOrders = await getOrdersByUserId(user.uid);
      // Tri par date décroissante (plus récent en haut)
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
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-sm">Espace Client</h2>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold">
              Bonjour, <span className="text-amber-500 font-medium italic">{user.prenom || "Gourmet"}</span> !
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Colonne Gauche : Profil */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-32">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-montserrat">Mon Profil</h2>
              </div>

              <div className="relative z-10">
                <UpdateProfileForm user={user} />
              </div>
            </div>
          </div>

          {/* Colonne Droite : Commandes */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-montserrat">Historique</h2>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 w-full sm:w-auto cursor-pointer"
                >
                  <option value="all">Toutes mes commandes</option>
                  <option value="en attente">En attente</option>
                  <option value="validé">Validée</option>
                  <option value="en préparation">En préparation</option>
                  <option value="en cours de livraison">En livraison</option>
                  <option value="terminée">Terminée</option>
                  <option value="annulé">Annulée</option>
                </select>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
                  <p>Recherche de vos festins...</p>
                </div>
              ) : orders.length > 0 ? (
                <div
                  data-lenis-prevent
                  className="h-[500px] overflow-y-auto pr-2 space-y-4 overscroll-contain scroll-smooth custom-scrollbar"
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
                    <div className="text-center py-12 text-zinc-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune commande "{statusFilter}".</p>
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="text-amber-500 text-sm font-bold mt-2 hover:underline"
                      >
                        Réinitialiser le filtre
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                  <div className="bg-zinc-800 p-4 rounded-full mb-4">
                    <ShoppingBag className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Aucune commande pour le moment</h3>
                  <p className="text-zinc-500 max-w-xs mx-auto mb-6">
                    Découvrez nos menus et commencez à planifier votre prochain événement.
                  </p>
                  <a href="/menus" className="text-amber-500 hover:text-amber-400 font-bold uppercase text-sm tracking-wide hover:underline">
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