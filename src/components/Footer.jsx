import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-black text-white py-8 font-sans border-t border-white/5 overflow-hidden">

      {/* 1. TEXTURE DE FOND (Grain) */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-100 brightness-100"></div>

      {/* 2. PROFONDEUR AJUSTÉE */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-zinc-900/30 via-neutral-950 to-neutral-950 pointer-events-none"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <div className="container relative z-10 mx-auto px-4 text-center">

        {/* --- EN-TÊTE --- */}
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" onClick={scrollToTop} className="group inline-block">
            <img
              src={logo}
              alt="Vite & Gourmand"
              className="h-14 w-auto mb-4"
            />
          </Link>

          <div className="w-12 h-0.5 bg-amber-600/80 rounded-full mb-4"></div>

          <p className="font-montserrat text-zinc-300 text-sm font-light max-w-md mx-auto leading-snug">
            L'excellence du goût, la passion du service. <br />
            Traiteur événementiel à Bordeaux depuis 25 ans.
          </p>
        </div>

        {/* --- INFORMATIONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 font-montserrat">

          {/* COLONNE CONTACT */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-3">Nous contacter</h4>
            <ul className="space-y-1.5 text-zinc-300 text-xs">
              <li className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>123 Avenue de la Gastronomie, 33000 Bordeaux</span>
                </div>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>05 56 00 00 00</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>contact@vite-gourmand.fr</span>
              </li>
            </ul>
          </div>

          {/* COLONNE HORAIRES */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-3">Nos horaires</h4>
            <ul className="space-y-1.5 text-zinc-300 text-xs">
              <li><span className="text-zinc-200 font-medium">Lun - Ven :</span> 9h00 - 18h00</li>
              <li><span className="text-zinc-200 font-medium">Samedi :</span> 10h00 - 16h00</li>
              <li><span className="text-zinc-200 font-medium">Dimanche :</span> Fermé</li>
            </ul>
          </div>

          {/* COLONNE INFORMATIONS */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-3">Informations</h4>
            <ul className="space-y-1.5 text-zinc-300 text-xs">
              <li>
                <Link to="/menus" className="hover:text-amber-500 transition-colors" onClick={scrollToTop}>
                  Nos Menus
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-500 transition-colors" onClick={scrollToTop}>
                  Demander un devis
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="hover:text-amber-500 transition-colors" onClick={scrollToTop}>
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-amber-500 transition-colors" onClick={scrollToTop}>
                  CGV
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* --- COPYRIGHT --- */}
        <div className="border-t border-white/5 pt-4">
          <p className="font-montserrat text-[10px] text-zinc-600">
            &copy; {currentYear} Vite & Gourmand. Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;