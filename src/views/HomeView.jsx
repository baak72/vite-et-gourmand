import React from 'react';

// --- COMPOSANTS SECTIONS ---
import HeroSection from '../components/HeroSection';
import PartnersCarousel from '../components/PartnersCarousel';
import IntroSection from '../components/IntroSection';
import UniversSection from '../components/UniversSection';
import SavoirFaireCinematic from '../components/SavoirFaireCinematic';
import ReviewsSection from '../components/ReviewsSection';
import PrefooterSection from '../components/PrefooterSection';

const HomeView = () => {
  return (
    <div className="bg-white"> 
      
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Logos Partenaires */}
      <PartnersCarousel />

      {/* 3. Intro & Histoire */}
      <IntroSection />
      
      {/* 4. Nos Univers */}
      <UniversSection />

      {/* 5. Savoir-faire */}
      <SavoirFaireCinematic />

      {/* 6. Avis Clients */}
      <ReviewsSection />

      {/* 7. Appel à l'action final */}
      <PrefooterSection />

    </div>
  );
};

export default HomeView;