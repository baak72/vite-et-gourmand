import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScroll, useTransform, motion } from 'framer-motion'; // eslint-disable-line
import ImgIntro from '../assets/img.intro.webp';

const IntroSection = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden">

      {/* --- FOND TEXTURÉ --- */}
      {/* Optimisation GPU active via transform-gpu */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-100 brightness-100 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* 1. CÔTÉ IMAGE */}
          <div className="w-full lg:w-1/2 relative">
            <ParallaxImage src={ImgIntro} />
          </div>

          {/* 2. CÔTÉ TEXTE */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-amber-500"></span>
                <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-sm">
                  Notre Histoire
                </span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold text-zinc-900 mb-8 font-Josefin leading-[1.1]">
                L'Art de Recevoir <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-amber-700">
                  à la Bordelaise
                </span>
              </h2>

              <p className="text-zinc-600 text-lg leading-relaxed mb-6 font-light">
                Derrière Vite & Gourmand, il y a avant tout la complicité de Julie et José et une envie intacte <span className="font-semibold text-zinc-900">depuis 25 ans</span> : vous faire plaisir.
              </p>

              <p className="text-zinc-600 text-lg leading-relaxed mb-6 font-light">
                Nous croyons que les meilleurs moments de la vie se passent autour d'une bonne table. C'est pourquoi nous mettons toute notre énergie à créer une gastronomie créative mais accessible.
              </p>

              <Link to="/contact" className="group inline-flex items-center gap-3 text-zinc-900 font-semibold text-lg transition-all">
                <span className="border-b-2 border-amber-400 group-hover:border-amber-600 pb-1">En savoir plus sur nous</span>
                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;

// --- SOUS-COMPOSANT PARALLAX IMAGE ---
const ParallaxImage = ({ src }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Animation Parallaxe douce
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <div ref={ref} className="relative z-10 mx-auto max-w-[600px]">

      {/* Container Image */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-[2rem] shadow-2xl transform-gpu ring-1 ring-black/5">

        <motion.div
          style={{ y, scale }}
          className="absolute inset-0 h-[120%] w-full will-change-transform"
        >
          <img
            src={src}
            alt="Notre atelier"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent pointer-events-none"></div>
      </div>

      {/* Badge Animé */}
      <div className="absolute -bottom-10 -right-4 z-20 hidden md:-bottom-12 md:-right-12 md:block pointer-events-none">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white p-2 shadow-xl md:h-40 md:w-40">

          {/* Cercle rotatif */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex h-full w-full items-center justify-center will-change-transform transform-gpu"
          >
            <svg viewBox="0 0 100 100" className="h-full w-full p-2">
              <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="transparent" />
              <text className="fill-zinc-900 text-[9.5px] font-bold uppercase tracking-widest">
                <textPath href="#circlePath" startOffset="50%" textAnchor="middle">• Maison Fondée en 1999 • Excellence</textPath>
              </text>
            </svg>
          </motion.div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500">
            <span className="font-Josefin text-3xl font-bold">25</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ans</span>
          </div>
        </div>
      </div>

      {/* Bordure décorative arrière-plan */}
      <div className="absolute -left-6 top-10 -z-10 hidden h-full w-full rounded-[2rem] border border-amber-500/20 lg:block md:-left-10"></div>
    </div>
  );
};