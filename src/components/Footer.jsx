import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white mt-12">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* --- 1. Titre --- */}
        <div>
          <h3 className="text-2xl font-bold mb-2">Vite & Gourmand</h3>
          <p className="text-zinc-200">Votre traiteur à Bordeaux depuis 25 ans.</p>
        </div>

        {/* --- 2. Horaires --- */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Nos Horaires</h4>
          <ul className="text-zinc-200 space-y-1">
            <li>Lundi - Vendredi : 9h00 - 18h00</li>
            <li>Samedi : 10h00 - 16h00</li>
            <li>Dimanche : Fermé</li>
          </ul>
        </div>

        {/* --- 3. Liens Légaux --- */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Informations</h4>
          <ul className="text-zinc-200 space-y-1">
            <li>
              <a href="/mentions-legales" className="hover:text-white underline">
                Mentions Légales
              </a>
            </li>
            <li>
              <a href="/cgv" className="hover:text-white underline">
                Conditions Générales de Vente
              </a>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Barre de copyright en bas */}
      <div className="bg-green-800 text-center py-2">
        <p className="text-zinc-300 text-sm">
          &copy; {new Date().getFullYear()} Vite & Gourmand. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;