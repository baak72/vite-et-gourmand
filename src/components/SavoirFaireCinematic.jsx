import React, { useState } from 'react';
import { Leaf, ChefHat, Truck } from 'lucide-react';
import LaSource from '../assets/imgLaSource.avif';
import Latelier from '../assets/imgLatelier.avif';
import LaScene from '../assets/imgLaScene.avif';

const SavoirFaireCinematic = () => {
  const [activeId, setActiveId] = useState(1);

  const items = [
    {
      id: 0,
      title: "La Source",
      description: "Nous choisissons nos partenaires avec la même exigence que nos produits. Une qualité intransigeante qui passe par une rémunération juste et valorisante pour nos agriculteurs, garants de cette excellence.",
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
    <section className="bg-white py-24 md:py-36 overflow-hidden relative">

      {/* --- FOND VIVANT --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/60 rounded-full blur-[120px] pointer-events-none opacity-80 mix-blend-multiply will-change-transform"></div>
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-100 brightness-100"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* --- EN-TÊTE --- */}
        <div className="mb-28 text-center max-w-3xl mx-auto">
          <h4 className="text-xs font-semibold tracking-[0.4em] text-amber-700 uppercase mb-6">
            Chaque détail compte.
          </h4>
          <h2 className="text-6xl md:text-8xl font-serif text-zinc-950 leading-tight">
            <span className="block font-light text-zinc-400 italic text-5xl md:text-6xl mb-2">L'Art de</span>
            L'EXCEPTION
          </h2>
        </div>

        {/* --- ACCORDÉON OPTIMISÉ --- */}
        <div className="flex flex-col md:flex-row gap-4 h-[600px] md:h-[600px]">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className={`
                  relative overflow-hidden rounded-3xl cursor-pointer group h-full
                  /* Optimisation Performance Layout : */
                  will-change-[flex-grow] transform-gpu
                  transition-[flex-grow] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                  ${isActive ? 'grow-3 shadow-2xl shadow-zinc-200' : 'grow-[0.5] md:grow-[0.8]'}
                  bg-zinc-100
                `}
              >
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <div
                    className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-700 ${isActive ? 'opacity-90' : 'opacity-60'}`}
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="eager"
                    className={`
                      w-full h-full object-cover 
                      transform-gpu will-change-transform
                      transition-transform duration-1000 ease-out
                      ${isActive ? 'scale-110' : 'scale-100'}
                    `}
                  />
                </div>

                <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-end">

                  {/* État Inactif (Label vertical) */}
                  <div className={`
                      absolute top-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0
                      transition-all duration-500 ease-out
                      ${isActive ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 delay-100'}
                  `}>
                    <span className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 border border-white/30 shadow-lg">
                      {React.cloneElement(item.icon, { size: 24 })}
                    </span>
                    <h3 className="hidden md:block mt-6 text-xl font-serif text-white [writing-mode:vertical-rl] rotate-180 tracking-[0.2em] uppercase opacity-90 drop-shadow-md">
                      {item.title}
                    </h3>
                  </div>

                  {/* État Actif (Détail) */}
                  <div className={`
                    transition-all duration-500 ease-out
                    ${isActive ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-8 pointer-events-none absolute bottom-6'}
                  `}>
                    <h3 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
                      {item.title}
                    </h3>

                    <p className="text-zinc-100 text-lg leading-relaxed max-w-lg mb-8 drop-shadow-md line-clamp-3 md:line-clamp-none">
                      {item.description}
                    </p>
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