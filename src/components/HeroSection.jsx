import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react"; //eslint-disable-line
import heroImage from '../assets/hero-banner.webp';

const HeroSection = () => {
  return (
    <div className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden font-sans">

      {/* 1. INJECTION DES POLICES */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
        `}
      </style>

      {/* 2. IMAGE DE FOND */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Couche sombre légère */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Dégradés esthétiques */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </motion.div>
      </div>

      {/* 3. CONTENU CENTRAL */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center pt-32 md:pt-0">

        {/* Titre Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-playfair text-5xl sm:text-6xl md:text-8xl font-medium text-white leading-[1.1] mb-28 drop-shadow-lg"
        >
          L'Art de <br className="md:hidden" />
          <span className="italic text-amber-400/90 font-light ml-2 md:ml-4">sublimer</span> <br />
          vos instants.
        </motion.h1>

        {/* Boutons d'action - Centrés */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-12"
        >
          {/* Bouton Primaire */}
          <Link
            to="/menus"
            className="group relative overflow-hidden bg-amber-400/90 text-zinc-900 font-montserrat font-semibold py-4 px-10 rounded-sm w-full sm:w-auto text-center shadow-lg shadow-black/20"
          >
            <span className="relative z-10 tracking-[0.2em] text-xs md:text-sm uppercase">Découvrir la carte</span>
          </Link>

          {/* Bouton Secondaire */}
          <Link
            to="/contact"
            className="group flex items-center justify-center gap-3 text-white font-montserrat font-medium text-xs md:text-sm tracking-[0.2em] uppercase w-full sm:w-auto py-3 md:py-0"
          >
            <span className="border-b border-white/30 group-hover:border-amber-400 pb-1 transition-all">Nous contacter</span>
          </Link>
        </motion.div>

      </div>

    </div>
  );
};

export default HeroSection;