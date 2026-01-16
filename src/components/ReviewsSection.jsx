import React, { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import { getValidatedReviews } from '../utils/firebase';
import ReviewCard from './ReviewCard';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getValidatedReviews();
        setReviews(data);
      } catch (error) {
        console.error("Erreur chargement avis :", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="relative py-28 bg-[#050505] overflow-hidden">

      {/* --- ÉCLAIRAGE D'AMBIANCE --- */}
      {/* Spot central diffus pour éviter l'effet "trou noir" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Grille technique très fine */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 mb-16">

        {/* --- EN-TÊTE --- */}
        <div className="flex flex-col items-center text-center space-y-4">

          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-px bg-amber-500/50"></span>
            <span className="text-amber-500 text-xs font-semibold tracking-[0.4em] uppercase py-3">Excellence</span>
            <span className="w-8 h-px bg-amber-500/50"></span>
          </div>

          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">
            Ils nous font confiance
          </h2>

          <p className="text-zinc-400 font-light max-w-lg mx-auto">
            Découvrez les retours de nos clients les plus exigeants.
          </p>

        </div>
      </div>

      {/* --- CARROUSEL --- */}
      <div className="relative w-full">
        {reviews.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-zinc-600 text-sm animate-pulse tracking-widest uppercase">Chargement...</span>
          </div>
        ) : (
          <div className="relative">
            {/* Dégradés latéraux pour fondre le carrousel dans le noir */}
            {/* Correction : bg-gradient-to-r et bg-gradient-to-l */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>

            <Marquee
              gradient={false}
              speed={30}
              pauseOnHover={false}
              className="py-10"
            >
              {reviews.map((review) => (
                <div key={review.id} className="mx-4 md:mx-6 py-2">
                  <ReviewCard review={review} />
                </div>
              ))}
            </Marquee>
          </div>
        )}
      </div>

    </section>
  );
};

export default ReviewsSection;