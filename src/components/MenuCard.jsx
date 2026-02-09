import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const MenuCard = ({ menu }) => {
  return (
    <div className="group flex flex-col bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-500 relative h-full">

      {/* --- Zone Image --- */}
      {/* Mobile: h-64 | Desktop: h-56 */}
      <div className="h-64 md:h-56 bg-zinc-800/50 flex items-center justify-center relative overflow-hidden">

        {/* Image ou Icône par défaut */}
        {menu.image ? (
          <img
            src={menu.image}
            alt={menu.nom_menu}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <Utensils className="text-zinc-700 w-12 h-12 group-hover:text-amber-500/50 transition-colors duration-500 relative z-10" />
        )}

        {/* --- Effets de superposition --- */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>

        {/* Lueur ambrée au survol */}
        <div className="hidden md:block absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>

      </div>

      {/* --- Corps de la carte --- */}
      <div className="p-5 md:p-6 flex flex-col grow relative z-10">

        {/* --- En-tête : Titre + Bulle Prix --- */}
        <div className="flex justify-between items-start gap-3 mb-2">
            {/* Titre */}
            <h3 className="font-montserrat text-lg md:text-xl font-bold text-white uppercase tracking-wide group-hover:text-amber-400 transition-colors leading-tight">
            {menu.nom_menu}
            </h3>

            {/* Bulle Prix */}
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full flex flex-col items-end shrink-0">
                <span className="text-[8px] text-zinc-400 uppercase tracking-widest">Dès</span>
                <span className="text-sm font-bold text-amber-400">{menu.prix_par_personne}€</span>
            </div>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {menu.description}
        </p>

        {/* --- Footer (Bouton Action) --- */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-end">
          <Link
            to={`/menu/${menu.id}`}
            className="w-full md:w-auto text-center px-6 py-3 md:py-2 rounded-full bg-amber-400 text-black text-s font-playfair italic uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-400/10"
          >
            Voir le menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;