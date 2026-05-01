import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Check, X, Star, MessageSquare, AlertCircle } from 'lucide-react';

const AdminReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupération des avis "en attente"
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/avis/pending');
      
      const formattedReviews = response.data.map(review => ({
        ...review,
        id: review.id || review.avis_id 
      }));
      
      setReviews(formattedReviews);
    } catch (error) {
      console.error("Erreur chargement avis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Passer le statut en "validé"
  const handleValidate = async (id) => {
    if(!window.confirm("Valider cet avis et le rendre public ?")) return;
    try {
      await api.patch(`/admin/avis/${id}/validate`);
      fetchReviews();
    } catch (error) {
      console.error("Erreur validation :", error);
      alert("Erreur lors de la validation");
    }
  };

  // Suppression de l'avis
  const handleRefuse = async (id) => {
    if(!window.confirm("Refuser et supprimer définitivement cet avis ?")) return;
    try {
      await api.delete(`/admin/avis/${id}`);
      fetchReviews();
    } catch (error) {
      console.error("Erreur refus :", error);
      alert("Erreur lors de la suppression");
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 font-montserrat">
          <MessageSquare className="text-amber-500" /> Modération des Avis
        </h3>
        <div className="text-xs text-zinc-500 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          <span>{reviews.length} avis en attente</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-zinc-900 border border-white/10 rounded-xl text-zinc-500 flex flex-col items-center">
            <Check className="w-10 h-10 text-green-500 mb-2 opacity-50" />
            Tout est propre ! Aucun avis à modérer.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-zinc-900 border border-white/10 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:border-white/20 transition-colors">
              
              <div>
                {/* En-tête Carte */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-white">
                      {review.prenom && review.nom 
                        ? `${review.prenom} ${review.nom}` 
                        : (review.user_name || "Client Inconnu")
                      }
                    </h4>
                    
                    <span className="text-[10px] text-zinc-500 break-all font-mono">
                      CMD #{review.commande_id || review.order_id || "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex text-amber-500 shrink-0 ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.note ? "currentColor" : "none"} className={i < review.note ? "" : "text-zinc-700"} />
                    ))}
                  </div>
                </div>

                {/* Commentaire */}
                <div className="bg-black/20 p-4 rounded-lg border border-white/5 mb-6 min-h-[80px]">
                  <p className="text-sm text-zinc-300 italic leading-relaxed">"{review.description}"</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleRefuse(review.id)}
                  className="flex-1 py-3 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-800 hover:text-white transition-colors font-bold text-xs uppercase flex items-center justify-center gap-2"
                >
                  <X size={14} /> Refuser
                </button>
                <button 
                  onClick={() => handleValidate(review.id)}
                  className="flex-1 py-3 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-800 hover:text-white transition-colors font-bold text-xs uppercase flex items-center justify-center gap-2"
                >
                  <Check size={14} /> Valider
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviewsTab;