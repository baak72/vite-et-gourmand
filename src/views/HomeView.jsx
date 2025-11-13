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
      <section className="text-center my-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Bienvenue chez Vite & Gourmand
        </h1>
        <p className="text-lg text-zinc-800 max-w-2xl mx-auto">
          Votre traiteur passionné à Bordeaux. Nous combinons 25 ans de savoir-faire 
          traditionnel avec un service moderne et efficace.
        </p>
      </section>

      {/* --- Section Avis --- */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-zinc-900 mb-6 text-center">
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