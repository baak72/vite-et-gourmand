import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react"; // eslint-disable-line
import heroImage from '../assets/hero-banner.webp';

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full flex items-center overflow-hidden font-sans">

      {/* 1. INJECTION DES POLICES */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
        `}
      </style>

      {/* 2. Image de fond avec effet de zoom */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Masque dégradé : Noir à gauche -> Transparent à droite */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
        </motion.div>
      </div>

      {/* 3. CONTENU (Aligné à gauche) */}
      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="max-w-3xl">

          {/* Surtitre "Badges" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-6"
          />

          {/* Titre Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-[1.1] mb-8"
          >
            L'Art de <span className="italic text-amber-400/90 font-light">sublimer</span> <br />
            vos instants.
          </motion.h1>

          {/* Paragraphe descriptif */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-montserrat text-zinc-300 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-10"
          >
            De Bordeaux aux environs, nous vous livrons une cuisine qui a du goût. Découvrez nos menus du moment et laissez nos 25 ans d'expérience faire la différence pour votre prochain événement.
          </motion.p>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            {/* Bouton Primaire */}
            <Link
              to="/menus"
              className="group relative overflow-hidden bg-amber-400/90 text-zinc-900 font-montserrat font-semibold py-4 px-8 rounded-sm"
            >
              <span className="relative z-10 tracking-widest text-sm uppercase">Découvrir la carte</span>
            </Link>

            {/* Bouton Secondaire */}
            <Link
              to="/contact"
              className="group flex items-center gap-3 text-white font-montserrat font-medium text-sm tracking-widest uppercase hover:text-amber-400 transition-colors"
            >
              <span className="border-b border-transparent group-hover:border-amber-400 pb-1 transition-all">Nous contacter</span>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* 4. SCROLL INDICATOR (Flèche animée) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }} // Animation de rebond
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-white/70 hover:text-amber-400 transition-colors duration-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default HeroSection;