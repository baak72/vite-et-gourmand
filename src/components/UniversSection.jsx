import React from 'react';
import { Link } from 'react-router-dom';
import imgMariage from '../assets/img.mariage.avif';
import imgEntreprise from '../assets/img.entreprise.avif';
import imgCocktail from '../assets/img.cocktails.avif';

const UniversSection = () => {
  return (
    // Mobile: py-16 | Desktop: py-32
    <section className="relative py-16 lg:py-32 bg-black overflow-hidden">
      <div className="container relative z-10 mx-auto px-6">
        
        {/* HEADER SECTION */}
        {/* Mobile: mb-12 | Desktop: mb-24 */}
        <div className="text-center mb-12 lg:mb-24">
          {/* Mobile: text-3xl | Desktop: text-5xl */}
          <h2 className="text-3xl md:text-5xl font-bold text-white font-Josefin mb-6 drop-shadow-lg">Nos Univers Culinaires</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-6 lg:mb-8"></div>
          {/* Mobile: text-base | Desktop: text-lg */}
          <p className="text-zinc-300 mt-6 max-w-3xl mx-auto text-base lg:text-lg leading-relaxed drop-shadow-md">
            Chaque événement raconte une histoire unique. Nous avons imaginé trois univers distincts pour répondre avec précision à vos exigences, sublimés par une mise en lumière gastronomique.
          </p>
        </div>

        {/* Mobile: gap-16 | Desktop: gap-24 */}
        <div className="flex flex-col gap-16 lg:gap-24">

          {/* UNIVERS 1 : MARIAGES */}
          {/* Mobile: gap-8 | Desktop: gap-20 */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20 group/card">
            <div className="w-full lg:w-5/12">
              {/* Mobile: h-64 | Desktop: h-[450px] */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 h-64 lg:h-[450px]">
                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={imgMariage}
                  alt="Traiteur Mariage Bordeaux"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transform-gpu group-hover/card:scale-105 transition-transform duration-700 ease-out will-change-transform"
                />
              </div>
            </div>
            <div className="w-full lg:w-7/12 text-left">
              <span className="text-amber-400 font-bold tracking-widest uppercase text-xs lg:text-sm mb-2 lg:mb-3 block drop-shadow-md">Le Grand Jour</span>
              {/* Mobile: text-2xl | Desktop: text-4xl */}
              <h3 className="text-2xl md:text-4xl font-bold text-white font-Josefin mb-4 lg:mb-6 drop-shadow-lg">Mariages d'Exception</h3>

              {/* Mobile: text-base | Desktop: text-lg */}
              <div className="space-y-4 lg:space-y-6 text-zinc-300 text-base lg:text-lg leading-relaxed border-l-2 border-amber-500/30 pl-4 lg:pl-6 bg-black/40 rounded-r-lg p-2">
                <p>Votre mariage est bien plus qu'une simple réception, c'est l'aboutissement d'une histoire d'amour. Notre équipe dédiée aux mariages vous accompagne pas à pas, de la première dégustation jusqu'à la découpe de la pièce montée.</p>
                <p>Du vin d'honneur pétillant en plein air au dîner assis gastronomique servi à l'assiette, nous orchestrons le ballet du service avec discrétion et élégance.</p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 pt-6 lg:pt-8">
                <li className="flex items-center gap-3 text-white bg-zinc-900/50 p-3 rounded-lg border border-white/5 text-sm lg:text-base"><span className="text-amber-400 text-lg lg:text-xl">✨</span> Menu sur-mesure</li>
                <li className="flex items-center gap-3 text-white bg-zinc-900/50 p-3 rounded-lg border border-white/5 text-sm lg:text-base"><span className="text-amber-400 text-lg lg:text-xl">🍷</span> Vin d'honneur Signature</li>
              </ul>
            </div>
          </div>

          {/* SÉPARATEUR */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

          {/* UNIVERS 2 : ENTREPRISES */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-20 group/card">
            <div className="w-full lg:w-5/12">
              {/* Mobile: h-64 | Desktop: h-[450px] */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 h-64 lg:h-[450px]">
                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={imgEntreprise}
                  alt="Traiteur Entreprise Bordeaux"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transform-gpu group-hover/card:scale-105 transition-transform duration-700 ease-out will-change-transform"
                />
              </div>
            </div>
            <div className="w-full lg:w-7/12 text-left">
              <span className="text-amber-400 font-bold tracking-widest uppercase text-xs lg:text-sm mb-2 lg:mb-3 block drop-shadow-md">Professionnels</span>
              <h3 className="text-2xl md:text-4xl font-bold text-white font-Josefin mb-4 lg:mb-6 drop-shadow-lg">Événements Corporate</h3>
              <div className="space-y-4 lg:space-y-6 text-zinc-300 text-base lg:text-lg leading-relaxed border-l-2 border-amber-500/30 pl-4 lg:pl-6 bg-black/40 rounded-r-lg p-2">
                <p>Dans le monde des affaires, chaque détail compte. Que vous organisiez un séminaire stratégique, un gala de fin d'année ou un lancement de produit, notre cuisine s'adapte à votre image de marque : moderne, efficace et raffinée.</p>
                <p>Nous avons développé une gamme spécifique, allant des plateaux repas premium pour vos réunions exécutives aux buffets dinatoires grandioses pour réunir l'ensemble de vos collaborateurs.</p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 pt-6 lg:pt-8">
                <li className="flex items-center gap-3 text-white bg-zinc-900/50 p-3 rounded-lg border border-white/5 text-sm lg:text-base"><span className="text-amber-400 text-lg lg:text-xl">⚡</span> Réactivité</li>
                <li className="flex items-center gap-3 text-white bg-zinc-900/50 p-3 rounded-lg border border-white/5 text-sm lg:text-base"><span className="text-amber-400 text-lg lg:text-xl">🌱</span> Options végétariennes</li>
              </ul>
            </div>
          </div>

          {/* SÉPARATEUR */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

          {/* UNIVERS 3 : COCKTAILS */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20 group/card">
            <div className="w-full lg:w-5/12">
              {/* Mobile: h-64 | Desktop: h-[450px] */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 h-64 lg:h-[450px]">
                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={imgCocktail}
                  alt="Traiteur Cocktail Bordeaux"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transform-gpu group-hover/card:scale-105 transition-transform duration-700 ease-out will-change-transform"
                />
              </div>
            </div>
            <div className="w-full lg:w-7/12 text-left">
              <span className="text-amber-400 font-bold tracking-widest uppercase text-xs lg:text-sm mb-2 lg:mb-3 block drop-shadow-md">Convivialité</span>
              <h3 className="text-2xl md:text-4xl font-bold text-white font-Josefin mb-4 lg:mb-6 drop-shadow-lg">Cocktails & Réceptions</h3>
              <div className="space-y-4 lg:space-y-6 text-zinc-300 text-base lg:text-lg leading-relaxed border-l-2 border-amber-500/30 pl-4 lg:pl-6 bg-black/40 rounded-r-lg p-2">
                <p>L'art du cocktail dînatoire réside dans la variété et la surprise. C'est le format idéal pour favoriser les échanges. Nos chefs redoublent de créativité pour transformer des classiques de la gastronomie française en bouchées élégantes.</p>
                <p>Jeux de textures, couleurs vibrantes, saveurs explosives : nous créons de véritables paysages culinaires sur vos buffets.</p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 pt-6 lg:pt-8">
                <li className="flex items-center gap-3 text-white bg-zinc-900/50 p-3 rounded-lg border border-white/5 text-sm lg:text-base"><span className="text-amber-400 text-lg lg:text-xl">🎨</span> Pièces créatives</li>
                <li className="flex items-center gap-3 text-white bg-zinc-900/50 p-3 rounded-lg border border-white/5 text-sm lg:text-base"><span className="text-amber-400 text-lg lg:text-xl">🍸</span> Bar à cocktails</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UniversSection;