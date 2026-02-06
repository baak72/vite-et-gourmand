import React, { useState } from 'react';
import { Leaf, ChefHat, Truck } from 'lucide-react';
import Silk from '../components/Silk';
import LaSource from '../assets/imgLaSource.avif';
import Latelier from '../assets/imgLatelier.avif';
import LaScene from '../assets/imgLaScene.avif';

const SavoirFaireCinematic = () => {
  const [activeId, setActiveId] = useState(1);

  const items = [
    {
      id: 0,
      title: "La Source",
      description: "Nous choisissons nos partenaires avec la même exigence que nos produits. Une qualité intransigeante qui passe par une rémunération juste et valorisante pour nos agriculteurs.",
      icon: <Leaf />,
      image: LaSource
    },
    {
      id: 1,
      title: "L'Atelier",
      description: "Nous cuisinons avec humilité pour révéler la nature sans la brusquer. Une approche patiente, faite de justesse et de délicatesse, pour offrir des assiettes qui ont le goût de la sincérité.",
      icon: <ChefHat />,
      image: Latelier
    },
    {
      id: 2,
      title: "La Scène",
      description: "Nous assurons une présence attentionnée plutôt qu'un service guindé. Nous sommes là pour veiller au bien-être de chacun, avec simplicité et fluidité, pour vous laisser savourer l'instant.",
      icon: <Truck />,
      image: LaScene
    }
  ];

  return (
    <section className="relative py-16 md:py-36 overflow-hidden bg-white">

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
        `}
      </style>

      {/* --- SILK 3D BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-50 md:opacity-100">
        <Silk
          speed={1.5}
          scale={0.6}
          color="#d4d4d8"
          noiseIntensity={1}
          rotation={3.80}
        />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* --- EN-TÊTE --- */}
        <div className="mb-12 md:mb-28 text-center max-w-3xl mx-auto">
          <h4 className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-amber-700 uppercase mb-4 md:mb-6">
            Chaque détail compte.
          </h4>
          <h2 className="text-4xl md:text-8xl font-serif text-black leading-tight">
            <span className="block text-zinc-400 italic text-3xl md:text-6xl mb-2 font-playfair">L'Art de</span>
            L'EXCEPTION
          </h2>
        </div>

        {/* --- ACCORDÉON --- */}
        <div className="flex flex-col md:flex-row gap-4 h-[700px] md:h-[600px]">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => window.innerWidth >= 768 && setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className={`
                  relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer group h-full
                  will-change-[flex-grow] transform-gpu
                  transition-[flex-grow] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                  ${isActive ? 'grow-[3] shadow-2xl' : 'grow-[0.4] md:grow-[0.8]'}
                  bg-zinc-900
                `}
              >
                {/* --- IMAGE & OMBRES --- */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  
                  {/* Overlay Mobile Sombre (actif uniquement sur mobile et quand la carte est active) */}
                  <div className={`
                    absolute inset-0 z-10 
                    bg-black/60 md:bg-transparent 
                    transition-opacity duration-1000 
                    ${isActive ? 'opacity-100' : 'opacity-0'}
                  `} />

                  {/* Ombres existantes */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-1000 ${isActive ? 'opacity-80' : 'opacity-60'}`} />
                  <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                  {/* Masque Inactif (Flou) */}
                  <div 
                    className={`
                      absolute bottom-0 left-0 w-full h-1/2 z-10 bg-black/10
                      transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
                      ${isActive 
                        ? 'opacity-0 backdrop-blur-none' 
                        : 'opacity-100 backdrop-blur-[2px] md:backdrop-blur-md'}
                    `}
                    style={{ maskImage: 'linear-gradient(to top, black 20%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)' }}
                  />

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`
                      w-full h-full object-cover transform-gpu will-change-transform
                      transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]
                      ${isActive ? 'scale-110' : 'scale-100 grayscale-[20%]'}
                    `}
                  />
                </div>

                {/* --- CONTENU --- */}
                <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-end overflow-hidden">
                  
                  {/* === ÉTAT INACTIF === */}
                  <div className={`
                    absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-full
                    flex flex-col items-center justify-end gap-4
                    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                    ${isActive ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0 delay-200'}
                  `}>
                    
                    {/* Icone masquée sur mobile (hidden), visible sur desktop (md:flex) */}
                    <span className="hidden md:flex w-12 h-12 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white border border-white/20 shadow-lg">
                      {React.cloneElement(item.icon, { size: 18 })}
                    </span>

                    <h3 className="text-xs md:text-sm font-montserrat font-semibold text-white/90 tracking-[0.2em] uppercase text-center whitespace-nowrap">
                      {item.title}
                    </h3>
                  </div>

                  {/* === ÉTAT ACTIF === */}
                  <div className={`relative z-30 ${isActive ? 'block' : 'pointer-events-none'}`}>
                    <h3 className={`
                      text-3xl md:text-6xl font-serif text-white mb-2 md:mb-4 leading-none drop-shadow-lg origin-left
                      transform-gpu transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                      ${isActive ? 'opacity-100 translate-y-0 blur-0 delay-100' : 'opacity-0 translate-y-8 blur-md duration-200'}
                    `}>
                      {item.title}
                    </h3>

                    <div className={`
                      transform-gpu transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                      ${isActive ? 'opacity-100 translate-y-0 blur-0 delay-200' : 'opacity-0 translate-y-4 blur-sm duration-150'}
                    `}>
                      <p className="text-zinc-200 text-sm md:text-lg font-light leading-relaxed max-w-lg mb-4 md:mb-8 drop-shadow-md border-l-2 border-white/30 pl-4">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SavoirFaireCinematic;