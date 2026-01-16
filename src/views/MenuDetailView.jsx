import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuById } from '../utils/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { Utensils, Users, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';

const MenuDetailView = () => {
  // Outil pour récupérer le paramètre de l'URL
  const { menuId } = useParams();

  // États pour les données et le chargement
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On initialise les outils
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // On va chercher le menu au chargement
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const data = await getMenuById(menuId);
        setMenu(data);
      } catch (error) {
        console.error("Erreur, impossible de charger le menu :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  const handleOrderClick = () => {
    if (user) {
      navigate(`/commande/${menuId}`);
    } else {
      navigate('/login');
    }
  };

  // --- Gestion du chargement ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // --- Gestion si le menu n'existe pas ---
  if (!menu) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center pt-20 text-white">
        <h2 className="text-2xl font-bold mb-4">Menu introuvable</h2>
        <button
          onClick={() => navigate('/menus')}
          className="text-amber-500 hover:text-amber-400 underline"
        >
          Retourner à la carte
        </button>
      </div>
    );
  }

  // --- Layout Principal ---
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">

      {/* Bouton retour */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-zinc-400 hover:text-amber-500 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour aux menus
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* === COLONNE GAUCHE : VISUEL === */}
          <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-zinc-900 aspect-4/3 lg:aspect-auto lg:h-[600px]">
            {menu.image ? (
              <img
                src={menu.image}
                alt={menu.nom_menu}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                <Utensils className="w-24 h-24 text-zinc-700" />
              </div>
            )}

            {/* Overlay décoratif */}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* === COLONNE DROITE : CONTENU === */}
          <div className="flex flex-col h-full justify-center space-y-8">

            {/* Titre et Intro */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat uppercase tracking-wide text-white mb-6">
                {menu.nom_menu}
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed border-l-2 border-amber-500 pl-6">
                {menu.description}
              </p>
            </div>

            {/* Grille d'infos (Prix & Min) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center hover:border-amber-500/30 transition-colors">
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Prix par convive</span>
                <span className="text-3xl font-bold text-white">{menu.prix_par_personne} <span className="text-white">€</span></span>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center hover:border-amber-500/30 transition-colors">
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Minimum requis</span>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-zinc-600" />
                  <span className="text-3xl font-bold text-white">{menu.nombre_personne_minimum}</span>
                </div>
              </div>
            </div>

            {/* Section Conditions */}
            {menu.conditions && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-amber-500 font-bold uppercase text-xs tracking-wider mb-2">Conditions spécifiques</h3>
                    <p className="text-zinc-300 text-sm">{menu.conditions}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton d'action */}
            <div className="pt-4">
              <button
                onClick={handleOrderClick}
                className="w-full group relative overflow-hidden bg-amber-500 text-black font-montserrat font-bold text-lg py-5 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Commencer la commande
                  <CheckCircle2 className="w-5 h-5 text-black" />
                </span>
                {/* Effet hover background */}
                <div className="absolute inset-0 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
              </button>

              {!user && (
                <p className="text-center text-zinc-500 text-xs mt-3">
                  Vous devrez vous connecter pour finaliser la commande.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailView;