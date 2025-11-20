import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../utils/firebase';

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

  // Le useEffect se lance au chargement ET à chaque fois que le filtre change
  useEffect(() => {
    fetchAllOrders(statusFilter);
  }, [statusFilter]);

  // Fonction pour changer le statut
  const handleStatusChange = async (orderId, newStatus) => {
    setSubmitError(null);
    try {
      await updateOrderStatus(orderId, newStatus);
      // On recharge la liste avec le filtre actuel
      fetchAllOrders(statusFilter); 
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setSubmitError("Erreur : Impossible de mettre à jour le statut. Vérifiez les droits.");
    }
  };

  // Fonction utilitaire pour la couleur du statut
  const getStatusStyle = (status) => {
    switch(status) {
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'validé': return 'bg-blue-100 text-blue-800';
      case 'en préparation': return 'bg-amber-100 text-amber-800';
      case 'en cours de livraison': return 'bg-indigo-100 text-indigo-800';
      case 'en attente du retour de matériel': return 'bg-red-100 text-red-800';
      case 'terminée': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

      {/* --- Le filtre --- */}
      <div className="mb-6 bg-zinc-50 p-4 rounded-lg shadow-sm flex items-center">
        <label htmlFor="statusFilter" className="font-semibold text-zinc-700 mr-3">Filtrer par statut:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-zinc-300 rounded-md shadow-sm"
        >
          <option value="all">Toutes les commandes</option>
          <option value="en attente">En attente de validation</option>
          <option value="validé">Validé</option>
          <option value="en préparation">En préparation</option>
          <option value="en cours de livraison">En cours de livraison</option>
          <option value="livré">Livré</option>
          <option value="en attente du retour de matériel">Attente du retour de matériel</option>
          <option value="terminée">Terminée</option>
        </select>
        {orders.length === 0 && statusFilter !== 'all' && (
          <p className="ml-4 text-amber-600">Aucune commande trouvée pour ce statut.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {orders.length === 0 && statusFilter === 'all' && !isLoading ? (
          <p className="p-8 text-center text-zinc-600">Aucune commande enregistrée.</p>
        ) : (
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
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${getStatusStyle(order.statut)} rounded-full`}>
                      <span className="relative">{order.statut}</span>
                    </span>
                  </td>
                  
                  {/* --- COLONNE D'ACTIONS --- */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex flex-col gap-2">
                    
                    {/* 1. EN ATTENTE -> VALIDER */}
                    {order.statut === 'en attente' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'validé')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Valider la Commande
                      </button>
                    )}
                    
                    {/* 2. VALIDÉ -> EN PRÉPARATION */}
                    {order.statut === 'validé' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'en préparation')}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Préparer la Commande
                      </button>
                    )}

                    {/* 3. EN PRÉPARATION -> EN COURS DE LIVRAISON */}
                    {order.statut === 'en préparation' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'en cours de livraison')}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Passer à la livraison
                      </button>
                    )}

                    {/* 4. EN COURS DE LIVRAISON -> (CONFIRMATION DE LA LIVRAISON + CLOTURE DE LA COMMANDE ou ATTENTE MATÉRIEL) */}
                    {order.statut === 'en cours de livraison' && (
                      <>
                        {/* CAS A : AVEC MATÉRIEL -> On passe direct à 'en attente du retour' */}
                        {order.pret_materiel ? (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'en attente du retour de matériel')}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            Confirmer la livraison
                          </button>
                        ) : (
                          /* CAS B : SANS MATÉRIEL -> On passe à 'terminée' */
                          <button 
                            onClick={() => handleStatusChange(order.id, 'terminée')}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            Confirmer la livraison (Clôture de la Commande)
                          </button>
                        )}
                      </>
                    )}

                    {/* 5. MATÉRIEL REÇU -> terminé */}
                    {order.statut === 'en attente du retour de matériel' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'terminée')}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Matériel Reçu (Clôture de la Commande)
                      </button>
                    )}

                    {/* 6. Affichage Statut Final */}
                    {(order.statut === 'terminée' || order.statut === 'annulé') && (
                      <span className="text-sm text-gray-500 font-medium">Commande cloturée.</span>
                    )}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboardView;