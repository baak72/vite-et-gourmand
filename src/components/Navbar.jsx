import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        <a href="/" className="text-2xl font-bold text-green-700">
          Vite & Gourmand
        </a>

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
            {user ? (
              <>
                <a href="/profil" className="text-zinc-800 font-medium hover:text-green-700 mr-4">
                  Mon Compte
                </a>
                <button className="bg-zinc-200 text-zinc-800 font-bold px-4 py-2 rounded-md hover:bg-zinc-300 transition-colors">
                  Déconnexion
                </button>
              </>
            ) : (
              <a href="/login" className="bg-amber-500 text-white font-bold px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">
                Connexion
              </a>
            )}
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;