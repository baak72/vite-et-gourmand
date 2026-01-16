import React from 'react';

const ReviewCard = ({ review }) => {

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700 fill-zinc-700'}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ));
  };

  const date = review.date_creation
    ? new Date(review.date_creation.seconds * 1000).toLocaleDateString("fr-FR", { month: 'long', year: 'numeric' })
    : "";

  return (
    <div className="w-[350px] group cursor-default">

      <div className="relative bg-[#0A0A0A] border border-white/5 rounded-xl p-8 h-full transition-all duration-300 ease-out hover:border-white/10 hover:bg-[#0F0F0F] hover:-translate-y-1">

        {/* Glow effect au survol */}
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-medium text-sm group-hover:text-white group-hover:border-zinc-700 transition-colors">
              {review.prenom ? review.prenom.charAt(0) : "C"}
            </div>

            <div>
              <h3 className="text-white font-medium text-sm leading-none mb-1.5">
                {review.prenom} {review.nom}
              </h3>
              <div className="flex gap-0.5">
                {renderStars(review.note)}
              </div>
            </div>
          </div>

          <span className="text-[10px] text-zinc-600 font-mono pt-1">
            {date}
          </span>
        </div>

        {/* Corps du texte */}
        <p className="text-zinc-400 text-[14px] leading-relaxed font-light relative z-10 group-hover:text-zinc-300 transition-colors">
          "{review.description}"
        </p>

        {/* Badge de confiance footer */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 relative z-10 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Avis vérifié Google</span>
        </div>

      </div>
    </div>
  );
};

export default ReviewCard;