import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { signOutUser } from '../utils/firebase';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  // On récupère l'action "clearUser"
  useAuthStore((state) => state.clearUser);
  // On initialise l'outil de redirection
  const navigate = useNavigate();
  const isEmployeeOrAdmin = user && user.role_id <= 2;
  
  const handleLogout = async () => {
    try {
      await signOutUser(); // On appelle Firebase
      navigate('/'); // On redirige vers l'accueil
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-green-700">
          Vite & Gourmand
        </Link>

        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="text-zinc-800 font-medium hover:text-green-700">
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/menus" className="text-zinc-800 font-medium hover:text-green-700">
              Menus
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-zinc-800 font-medium hover:text-green-700">
              Contact
            </Link>
          </li>
          
          {/* --- LIEN EMPLOYE/ADMIN --- */}
          {isEmployeeOrAdmin && (
            <li>
              <Link to="/employe/dashboard" className="text-amber-600 font-bold hover:text-amber-700">
                Dashboard
              </Link>
            </li>
          )}
          
          {/* --- CONNEXION / PROFIL --- */}
          <li>
            {user ? (
              // Si l'utilisateur est connecté
              <>
                <Link to="/profil" className="text-zinc-800 font-medium hover:text-green-700 mr-4">
                  Mon Compte
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-zinc-200 text-zinc-800 font-bold px-4 py-2 rounded-md hover:bg-zinc-300 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              // Si personne n'est connecté
              <Link to="/login" className="bg-amber-500 text-white font-bold px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">
                Connexion
              </Link>
            )}
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;