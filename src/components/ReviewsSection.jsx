import React, { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import { getValidatedReviews, getReviewsCount } from '../utils/firebase';
import ReviewCard from './ReviewCard';
import { Quote } from 'lucide-react';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getValidatedReviews();
        setTotalCount(await getReviewsCount());
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selectedReviews = shuffled.slice(0, 8);
        setReviews(selectedReviews);
      } catch (error) {
        console.error("Erreur chargement avis :", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    // Mobile: py-16 | Desktop: py-28
    <section className="relative py-16 md:py-28 bg-[#050505] overflow-hidden">

      {/* --- ÉCLAIRAGE D'AMBIANCE --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Grille technique */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* --- COMPTEUR TOTAL --- */}
      {/* Mobile: top-4 right-4 | Desktop: top-10 right-10 */}
      <div className="absolute top-4 right-4 md:top-10 md:right-10 z-20 animate-in fade-in duration-1000">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
          <Quote className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-[10px] md:text-xs font-bold text-zinc-300">
            <span className="text-white">{totalCount}</span> avis vérifiés
          </span>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 mb-10 md:mb-16">

        {/* --- EN-TÊTE --- */}
        <div className="flex flex-col items-center text-center space-y-4">

          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-px bg-amber-500/50"></span>
            <span className="text-amber-500 text-[10px] md:text-xs font-semibold tracking-[0.4em] uppercase py-3">Excellence</span>
            <span className="w-8 h-px bg-amber-500/50"></span>
          </div>

          {/* Mobile: text-3xl | Desktop: text-5xl */}
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">
            Ils nous font confiance
          </h2>

          <p className="text-zinc-400 font-light max-w-lg mx-auto text-sm md:text-base">
            Découvez les retours de nos clients les plus exigeants.
          </p>

        </div>
      </div>

      {/* --- CARROUSEL --- */}
      <div className="relative w-full">
        {reviews.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-zinc-600 text-sm tracking-widest uppercase">Aucun avis pour le moment</span>
          </div>
        ) : (
          <div className="relative">
            {/* Mobile: w-8 | Desktop: w-32 */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>

            <Marquee
              gradient={false}
              speed={30}
              pauseOnHover={false}
              className="py-4 md:py-10"
            >
              {reviews.map((review) => (
                // Mobile: mx-3 | Desktop: mx-6
                <div key={review.id} className="mx-3 md:mx-6 py-2">
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