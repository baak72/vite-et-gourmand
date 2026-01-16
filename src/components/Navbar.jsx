import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { signOutUser } from '../utils/firebase';
import { User, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  {/* --- États --- */}
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  {/* --- Logique scroll --- */}
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      {/* --- 1. Style de fond --- */}
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      {/* --- 2. Visibilité --- */}
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isStaff = user && user.role_id <= 2;
  const isAdmin = user && user.role_id === 1;

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  {/* --- Styles --- */}
  const bgClasses = isScrolled
    ? "bg-black/70 backdrop-blur-xl shadow-2xl border-white/10 py-3"
    : "bg-black/45 backdrop-blur-[5px] border-white/5 py-3";

  const visibilityClasses = isVisible
    ? "translate-y-0 opacity-100"
    : "-translate-y-[150%] opacity-0";

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-full border transition-all duration-700 ease-in-out ${bgClasses} ${visibilityClasses}`}
    >
      <style>{`
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <div className="px-6 md:px-8 flex justify-between items-center">

        {/* --- LOGO --- */}
        <Link to="/" className="relative z-10 flex items-center gap-2 group">
          <img
            src={logo}
            alt="Logo"
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* --- MENU CENTRAL --- */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <ul className="flex items-center gap-8 font-montserrat text-[11px] tracking-[0.2em] font-bold uppercase text-white">
            {['Accueil', 'Menus', 'Contact'].map((item) => {
              const path = item === 'Accueil' ? '/' : `/${item.toLowerCase()}`;
              return (
                <li key={item}>
                  <Link
                    to={path}
                    className="relative group py-2 px-1 hover:text-amber-400 transition-colors duration-300"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* --- ACTIONS DROITE --- */}
        <div className="flex items-center gap-5 font-montserrat">

          {(isStaff || isAdmin) && (
            <div className="hidden lg:flex items-center gap-2">
              {isStaff && (
                <Link to="/employe/dashboard" className="px-3 py-1 rounded-full border border-green-500/50 text-green-400 text-[9px] font-bold uppercase tracking-wider hover:bg-green-500/10 transition-colors">
                  Staff
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/dashboard" className="px-3 py-1 rounded-full border border-red-500/50 text-red-400 text-[9px] font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors">
                  Admin
                </Link>
              )}
            </div>
          )}

          <div className="h-3 w-px bg-white/10 hidden md:block"></div>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profil"
                  className="text-white hover:text-amber-400 transition-colors duration-300 bg-white/15 p-2 rounded-full hover:bg-white/10"
                  title="Mon Compte"
                >
                  <User className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-white/60 hover:text-red-400 transition-colors duration-300 p-2"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-full bg-amber-400 text-zinc-900 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-white/5"
              >
                Connexion
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;