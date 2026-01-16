import React from 'react';
import Marquee from "react-fast-marquee";

// --- IMPORTS LOGOS ---
import Logo1 from '../assets/logoipsum-1.svg';
import Logo2 from '../assets/logoipsum-2.svg';
import Logo3 from '../assets/logoipsum-3.svg';
import Logo4 from '../assets/logoipsum-4.svg';
import Logo5 from '../assets/logoipsum-5.svg';
import Logo6 from '../assets/logoipsum-6.svg';
import Logo7 from '../assets/logoipsum-7.svg';
import Logo8 from '../assets/logoipsum-8.svg';
import Logo9 from '../assets/logoipsum-9.svg';
import Logo10 from '../assets/logoipsum-10.svg';
import Logo11 from '../assets/logoipsum-11.svg';
import Logo12 from '../assets/logoipsum-12.svg';

const PartnersCarousel = () => {
  // --- TABLEAU DE DONNÉES ---
  const partnersLogos = [
    { id: 1, alt: "Partenaire 1", src: Logo1 },
    { id: 2, alt: "Partenaire 2", src: Logo2 },
    { id: 3, alt: "Partenaire 3", src: Logo3 },
    { id: 4, alt: "Partenaire 4", src: Logo4 },
    { id: 5, alt: "Partenaire 5", src: Logo5 },
    { id: 6, alt: "Partenaire 6", src: Logo6 },
    { id: 7, alt: "Partenaire 7", src: Logo7 },
    { id: 8, alt: "Partenaire 8", src: Logo8 },
    { id: 9, alt: "Partenaire 9", src: Logo9 },
    { id: 10, alt: "Partenaire 10", src: Logo10 },
    { id: 11, alt: "Partenaire 11", src: Logo11 },
    { id: 12, alt: "Partenaire 12", src: Logo12 },
  ];

  return (
    <section className="relative py-18 bg-white overflow-hidden">
      
      {/* --- FOND VIVANT --- */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-100 brightness-100"></div>
      <div className="relative z-10 w-[80%] mx-auto">
        <Marquee 
          gradient={true} 
          gradientColor={[255, 255, 255]} 
          speed={40} 
        >
          {partnersLogos.map((partner) => (
              <div key={partner.id} className="mx-8 md:mx-12">
                  <img 
                      src={partner.src} 
                      alt={partner.alt} 
                      className="h-10 w-auto object-contain" 
                  />
              </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default PartnersCarousel;