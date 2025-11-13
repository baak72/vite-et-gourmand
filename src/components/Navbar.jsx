import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* --- 1. Le Logo --- */}
        <a href="/" className="text-2xl font-bold text-green-700">
          Vite & Gourmand
        </a>

        {/* --- 2. Les Liens de Navigation --- */}
        <ul className="flex space-x-6 items-center">
          <li>
            <a href="/" className="text-zinc-800 font-medium hover:text-green-700">
              Accueil
            </a>
          </li>
          <li>
            <a href="/menus" className="text-zinc-800 font-medium hover:text-green-700">
              Menus
            </a>
          </li>
          <li>
            <a href="/contact" className="text-zinc-800 font-medium hover:text-green-700">
              Contact
            </a>
          </li>
          <li>
            <a href="/login" className="bg-amber-500 text-white font-bold px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">
              Connexion
            </a>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;