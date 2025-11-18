import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../utils/firebase';

const EmployeeDashboardView = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  // Chargement des commandes
  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Erreur récupération globale commandes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Fonction pour changer le statut
  const handleStatusChange = async (orderId, newStatus) => {
    setSubmitError(null);
    try {
      await updateOrderStatus(orderId, newStatus);
      // On recharge la liste pour voir le changement
      fetchAllOrders(); 
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setSubmitError("Erreur : Impossible de mettre à jour le statut. Vérifiez les droits.");
    }
  };

  if (isLoading) return <p className="text-center p-8">Chargement du Dashboard...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-zinc-800 mb-6">Espace Employé : Suivi des Commandes</h1>
      
      {/* Affichage des erreurs de soumission */}
      {submitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Erreur de mise à jour</p>
          <p>{submitError}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Menu
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Livraison
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {/* On suppose que l'on va chercher le nom/prenom du client plus tard */}
                  <p className="text-gray-900 whitespace-no-wrap font-bold">{order.nom} {order.prenom}</p>
                  <p className="text-gray-600 text-xs">{order.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.nom_menu}</p>
                  <p className="text-gray-600 text-xs">{order.nombre_personne} pers. - {order.prix_total}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.date_prestation}</p>
                  <p className="text-gray-600 text-xs">{order.heure_livraison}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                    <span className="relative">{order.statut}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex flex-col gap-2">
                  {/* Boutons d'action rapides */}
                  {order.statut === 'en attente' && (
                    <button 
                      onClick={() => handleStatusChange(order.id, 'validé')}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                    >
                      Valider
                    </button>
                  )}
                  {order.statut === 'validé' && (
                    <button 
                      onClick={() => handleStatusChange(order.id, 'en préparation')}
                      className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-1 px-2 rounded text-xs"
                    >
                      Préparer
                    </button>
                  )}
                   {/* On ajoutera les autres statuts (livré, terminé) ici */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboardView;