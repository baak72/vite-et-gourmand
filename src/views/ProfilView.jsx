import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getOrdersByUserId } from '../utils/firebase';
import OrderSummaryCard from '../components/OrderSummaryCard';
import UpdateProfileForm from '../components/UpdateProfileForm';

const ProfilView = () => {
  // On lit les infos de l'utilisateur
  const user = useAuthStore((state) => state.user);
  
  // On crée un "état" pour stocker les commandes et le chargement
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // On va chercher les commandes au chargement de la page
  useEffect(() => {
    if (user) { // On s'assure que l'utilisateur est bien chargé
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          const userOrders = await getOrdersByUserId(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error("Erreur lors de la récupération des commandes :", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-green-700 mb-8">
        Bonjour, {user?.prenom || "Utilisateur"} !
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- Colonne de Gauche : Infos Personnelles --- */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold text-zinc-800 mb-4">Mes Informations</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            {user ? (
              <UpdateProfileForm user={user} />
            ) : (
              <p>Chargement...</p>
            )}
          </div>
        </div>

        {/* --- Colonne de Droite : Mes Commandes --- */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-zinc-800 mb-4">Mes Commandes</h2>
          
          {/* 6. On gère l'affichage des commandes */}
          {isLoading ? (
            <p>Chargement des commandes...</p>
          ) : orders.length > 0 ? (
            // Si on a des commandes, on les affiche
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderSummaryCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            // Si on n'a pas de commandes
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-zinc-600">Vous n'avez pas encore passé de commande.</p>
            </div>
          )}

        </div>
        
      </div>
    </div>
  );
};

export default ProfilView;