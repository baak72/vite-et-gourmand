import React, { useState, useEffect } from 'react';
// 1. On importe nos outils
import { getValidatedReviews } from '../utils/firebase';
import ReviewCard from '../components/ReviewCard';

const HomeView = () => {
  // 2. On crée un "état" pour stocker nos avis
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 3. On crée une petite fonction pour aller chercher les données
    const fetchReviews = async () => {
      try {
        const data = await getValidatedReviews();
        setReviews(data);
      } catch (error) {
        console.error("Erreur, impossible de charger les avis :", error);
      }
    };

    fetchReviews(); // On appelle la fonction
  }, []);

  return (
    <div className="container mx-auto p-4">

      {/* --- Section Présentation --- */}
      <section className="text-center my-16">
        <h1 className="text-5xl font-bold text-green-700 mb-4">
          Bienvenue chez Vite & Gourmand
        </h1>
        <p className="text-xl text-zinc-800 max-w-3xl mx-auto">
          Votre traiteur passionné à Bordeaux. Nous combinons 25 ans de savoir-faire 
          traditionnel avec un service moderne et efficace pour tous vos événements.
        </p>
        <a 
          href="/menus" 
          className="mt-8 inline-block bg-amber-500 text-white font-bold px-8 py-3 rounded-md hover:bg-amber-600 transition-colors text-lg"
        >
          Découvrir nos menus
        </a>
      </section>

      {/* --- NOUVELLE SECTION : Professionnalisme --- */}
      {/* C'est la nouvelle section pour répondre à l'énoncé */}
      <section className="my-20 bg-zinc-100 p-12 rounded-lg">
        <h2 className="text-3xl font-bold text-zinc-900 mb-8 text-center">
          Notre Savoir-Faire
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Bloc 1 */}
          <div>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Qualité & Fraîcheur</h3>
            <p className="text-zinc-700">
              Nous sélectionnons rigoureusement nos produits pour une cuisine savoureuse et de saison.
            </p>
          </div>
          {/* Bloc 2 */}
          <div>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Savoir-faire Artisanal</h3>
            <p className="text-zinc-700">
              Forts de 25 ans d'expérience, Julie et José mettent leur passion à votre service.
            </p>
          </div>
          {/* Bloc 3 */}
          <div>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Service Efficace</h3>
            <p className="text-zinc-700">
              Commandez en ligne facilement et profitez d'un service de livraison ponctuel.
            </p>
          </div>
        </div>
      </section>


      {/* --- Section Avis --- */}
      {/* J'ai juste ajouté un peu d'espace (my-20) */}
      <section className="my-20">
        <h2 className="text-3xl font-bold text-zinc-900 mb-8 text-center">
          Ce que nos clients disent
        </h2>
        
        {/* 4. On crée une grille pour nos cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default HomeView;