import React from 'react';
import { Link } from 'react-router-dom';

const PrefooterSection = () => {
  return (
    // Mobile: py-32 | Desktop: py-64
    <section className="relative py-32 md:py-56 bg-white overflow-hidden">

      {/* --- FOND VIVANT (Halo) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-amber-100/60 rounded-full blur-[100px] md:blur-[150px] pointer-events-none opacity-80 mix-blend-multiply"></div>

      {/* Texture granuleuse */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-100 brightness-100"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">

          {/* Phrase principale */}
          <h2 className="text-5xl md:text-8xl font-serif text-zinc-900 mb-8 md:mb-12 tracking-tight leading-[1.1]">
            Créons <span className="italic font-light text-amber-600">l'inoubliable.</span>
          </h2>

          {/* Texte courant */}
          <p className="text-zinc-600 text-lg md:text-2xl font-light max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed">
            Votre événement mérite une signature culinaire unique. <br className="hidden md:block" />
            Parlons de vos envies, sans engagement.
          </p>

          {/* --- LES ACTIONS --- */}
          <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12">

            {/* Bouton Principal */}
            <Link
              to="/contact"
              className="group relative py-3 md:py-4 text-zinc-900 text-xl md:text-2xl tracking-widest uppercase font-semibold"
            >
              Demander un devis
              {/* Soulignement animé plus épais */}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 scale-x-100 group-hover:scale-x-0 transition-transform duration-500 origin-right"></span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </Link>

            {/* Séparateur visuel */}
            <span className="hidden sm:block w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>

            {/* Lien Secondaire */}
            <Link
              to="/menus"
              className="text-zinc-500 hover:text-zinc-900 transition-colors text-sm md:text-base uppercase tracking-widest font-medium"
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