import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import { User, LogOut, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  
  // Récupération des fonctions pour vider la mémoire de Zustand
  const logout = useAuthStore((state) => state.logout); 
  const setUser = useAuthStore((state) => state.setUser); 
  
  const navigate = useNavigate();
  const location = useLocation();

  {/* --- États --- */}
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  {/* --- Logique scroll --- */}
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Style de fond
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Visibilité
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isStaff = user && user.role_id <= 2;
  const isAdmin = user && user.role_id === 1;

  // --- Fonction pour se déconnecter ---
  const handleLogout = async () => {
    try {
      // Détruire le jeton de sécurité Sanctum
      await api.post('/logout');
    } catch (error) {
      console.error("Erreur côté serveur lors de la déconnexion :", error);
    } finally {
      if (logout) {
        logout();
      } else if (setUser) {
        setUser(null);
      }
      
      // Destruction du token
      localStorage.removeItem('auth_token');

      // On redirige vers l'accueil
      navigate('/');
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
    <>
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-full border transition-all duration-700 ease-in-out ${bgClasses} ${visibilityClasses}`}
      >
        <style>{`
            .font-montserrat { font-family: 'Montserrat', sans-serif; }
        `}</style>

        <div className="px-6 md:px-8 flex justify-between items-center relative">

          {/* --- LOGO --- */}
          <Link to="/" className="relative z-10 flex items-center gap-2 group shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* --- MENU CENTRAL (DESKTOP) --- */}
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
          <div className="flex items-center gap-3 md:gap-5 font-montserrat">

            {/* Badges Staff/Admin (Desktop uniquement) */}
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

            {/* Boutons Utilisateur */}
            <div>
              {user ? (
                <div className="flex items-center gap-2 md:gap-4">
                  <Link
                    to="/profil"
                    className="text-white hover:text-amber-400 transition-colors duration-300 bg-white/15 p-2 rounded-full hover:bg-white/10"
                    title="Mon Compte"
                  >
                    <User className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-white/60 hover:text-red-400 transition-colors duration-300 p-2 hidden sm:block"
                    title="Déconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-amber-500 text-zinc-900 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-white/5 whitespace-nowrap"
                >
                  Connexion
                </Link>
              )}
            </div>

            {/* --- BOUTON BURGER (MOBILE UNIQUEMENT) --- */}
            <button 
              className="md:hidden text-white p-1 ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </nav>

      {/* --- MENU MOBILE DÉROULANT --- */}
      <div 
        className={`fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-40 md:hidden transition-all duration-300 ease-out origin-top ${
          isMobileMenuOpen && isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col gap-4 text-center font-montserrat font-bold uppercase text-sm tracking-widest text-white">
            {['Accueil', 'Menus', 'Contact'].map((item) => (
                <li key={item}>
                    <Link 
                      to={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`}
                      className="block py-3 hover:text-amber-400 transition-colors border-b border-white/5 last:border-0"
                    >
                        {item}
                    </Link>
                </li>
            ))}
            
            {/* Liens Staff/Admin dans le menu mobile */}
            {(isStaff || isAdmin) && (
              <li className="pt-2 flex flex-col gap-3 justify-center">
                  {isStaff && <Link to="/employe/dashboard" className="text-green-400 text-xs py-2 border border-green-500/30 rounded-lg bg-green-500/5">Espace Staff</Link>}
                  {isAdmin && <Link to="/admin/dashboard" className="text-red-400 text-xs py-2 border border-red-500/30 rounded-lg bg-red-500/5">Espace Admin</Link>}
              </li>
            )}

            {/* Déconnexion Mobile (si connecté) */}
            {user && (
               <li className="pt-2">
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full text-zinc-500 text-xs py-2 hover:text-red-400">
                    <LogOut className="w-4 h-4" /> Se déconnecter
                  </button>
               </li>
            )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;