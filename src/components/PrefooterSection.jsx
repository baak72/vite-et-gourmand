import React from 'react';
import { Link } from 'react-router-dom';

const PrefooterSection = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden">

      {/* --- FOND VIVANT --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/60 rounded-full blur-[120px] pointer-events-none opacity-80 mix-blend-multiply"></div>

      {/* Texture granuleuse */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-100 brightness-100"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">

          {/* Le Message */}
          <h2 className="text-5xl md:text-7xl font-serif text-zinc-900 mb-8 tracking-tight">
            Créons <span className="italic font-light text-amber-600">l'inoubliable.</span>
          </h2>

          <p className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Votre événement mérite une signature culinaire unique.
            Parlons de vos envies, sans engagement.
          </p>

          {/* --- LES ACTIONS --- */}
          <div className="flex flex-col sm:flex-row items-center gap-8">

            <Link
              to="/contact"
              className="group relative py-2 text-zinc-900 text-lg tracking-widest uppercase font-medium"
            >
              Demander un devis
              <span className="absolute bottom-0 left-0 w-full h-px bg-zinc-900 scale-x-100 group-hover:scale-x-0 transition-transform duration-500 origin-right"></span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </Link>

            {/* Séparateur visuel */}
            <span className="hidden sm:block w-1 h-1 bg-zinc-300 rounded-full"></span>

            <Link
              to="/menus"
              className="text-zinc-400 hover:text-zinc-600 transition-colors text-sm uppercase tracking-widest font-medium"
            >
              Voir les menus
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default PrefooterSection;