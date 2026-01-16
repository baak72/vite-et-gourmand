import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const ReviewFormModal = ({ isOpen, onClose, onSubmit, order }) => {
  const [rating, setRating] = useState(5); // La note validée
  const [hoverRating, setHoverRating] = useState(0); // La note au survol
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ note: rating, description: comment });
    setIsSubmitting(false);
    setComment("");
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      {/* Animation d'entrée */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up transform transition-all">

        {/* En-tête */}
        <div className="bg-zinc-900 p-6 flex justify-between items-start relative overflow-hidden">
          {/* Déco de fond */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="z-10">
            <h3 className="text-white text-xl font-bold font-Josefin">Votre avis compte</h3>
            <p className="text-zinc-400 text-xs mt-1 uppercase tracking-wide">
              Commande du {order?.date_prestation}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">

          {/* Étoiles Interactives */}
          <div className="flex flex-col items-center mb-6">
            <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Notez votre expérience
            </label>
            <div
              className="flex justify-center gap-2"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    // Remplissage : Si survol actif, on utilise hoverRating, sinon rating
                    fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"}
                    // Couleur du contour
                    className={`w-8 h-8 transition-colors duration-200 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400'
                        : 'text-zinc-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {/* Petit texte dynamique selon la note */}
            <p className="text-center text-sm font-medium text-amber-600 mt-2 h-5">
              {(hoverRating || rating) === 5 && "Excellent !"}
              {(hoverRating || rating) === 4 && "Très bon"}
              {(hoverRating || rating) === 3 && "Bien"}
              {(hoverRating || rating) === 2 && "Moyen"}
              {(hoverRating || rating) === 1 && "Déçu"}
            </p>
          </div>

          {/* Commentaire */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">
              Votre commentaire
            </label>
            <textarea
              required
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Racontez-nous votre expérience culinaire..."
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none placeholder-zinc-400 transition-all"
            ></textarea>
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-zinc-200 text-zinc-600 font-semibold rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Envoi..." : "Envoyer l'avis"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;