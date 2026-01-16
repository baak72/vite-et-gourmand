import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const MenuCard = ({ menu }) => {
  return (
    <div className="group flex flex-col bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-500 relative">

      {/* --- Zone Image --- */}
      <div className="h-48 bg-zinc-800/50 flex items-center justify-center relative overflow-hidden">

        {/* Image ou Icône par défaut */}
        {menu.image ? (
          <img
            src={menu.image}
            alt={menu.nom_menu}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <Utensils className="text-zinc-700 w-12 h-12 group-hover:text-amber-500/50 transition-colors duration-500 relative z-10" />
        )}

        {/* --- Effets de superposition --- */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>

        {/* Lueur ambrée au survol */}
        <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
      </div>

      {/* --- Corps de la carte --- */}
      <div className="p-6 flex flex-col grow relative z-10">

        {/* Titre */}
        <h3 className="font-montserrat text-xl font-bold text-white mb-2 uppercase tracking-wide group-hover:text-amber-400 transition-colors">
          {menu.nom_menu}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {menu.description}
        </p>

        {/* --- Footer (Prix & Bouton) --- */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Par convive</span>
            <span className="text-xl font-montserrat font-bold text-white">
              {menu.prix_par_personne} <span>€</span>
            </span>
          </div>

          <Link
            to={`/menu/${menu.id}`}
            className="px-5 py-2 rounded-full bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-lg shadow-white/5"
          >
            Détails
          </Link>

        </div>
      </div>
    </div>
  );
};

export default MenuCard;