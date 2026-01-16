import React, { useState, useEffect } from 'react';
import { getMenus } from '../utils/firebase';
import MenuCard from '../components/MenuCard';
import {
  Search, Loader2, ChefHat, X, Check, Leaf, WheatOff, Utensils, Filter
} from 'lucide-react';

const MenusView = () => {
  // --- États Données ---
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- États Filtres ---
  const [prixMax, setPrixMax] = useState('');
  const [theme, setTheme] = useState('all');
  const [regime, setRegime] = useState('all');

  // État pour l'ouverture du menu (Mode Expansion)
  const [isRegimeOpen, setIsRegimeOpen] = useState(false);

  // --- Récupération des données ---
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        const filters = { prixMax, theme, regime };
        const data = await getMenus(filters);
        setMenus(data);
      } catch (error) {
        console.error("Erreur chargement menus :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, [prixMax, theme, regime]);

  // --- Composants UI internes pour le style ---
  const FilterTag = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`
        relative px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 border
        ${active
          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
          : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-500/30 selection:text-amber-200">

      <style>{`
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* --- En-tête (Hero) --- */}
      <div className="pt-36 pb-12 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <h1 className="relative z-10 font-playfair italic text-5xl md:text-7xl font-medium uppercase tracking-widest text-white mb-4">
          La Carte
        </h1>
        <p className="relative z-10 text-zinc-400 font-montserrat text-xs md:text-sm tracking-widest max-w-xl mx-auto uppercase">
          Une symphonie de saveurs pour vos moments d'exception
        </p>
      </div>

      {/* --- Barre de Filtres --- */}
      <div className="position-fixed z-50 top-6 px-4 mb-16 transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col xl:flex-row items-center justify-between gap-6 shadow-2xl ring-1 ring-white/5">

            {/* 1. Groupe Thèmes */}
            <div className="flex flex-wrap justify-center gap-2">
              <FilterTag label="Tous" active={theme === 'all'} onClick={() => setTheme('all')} />
              <FilterTag label="Noël" active={theme === 'Noel'} onClick={() => setTheme('Noel')} />
              <FilterTag label="Pâques" active={theme === 'Paques'} onClick={() => setTheme('Paques')} />
              <FilterTag label="Classique" active={theme === 'Classique'} onClick={() => setTheme('Classique')} />
            </div>

            {/* Séparateur (Desktop) */}
            <div className="hidden xl:block w-px h-8 bg-white/10"></div>

            {/* 2. Groupe Inputs (Régime & Prix) */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto justify-center font-montserrat">

              {/* --- Sélecteur Régime Extensible --- */}
              <div className={`
                flex items-center bg-white/5 border border-white/10 rounded-full p-1 transition-all duration-500 ease-out
                ${isRegimeOpen ? 'bg-zinc-900/80 border-amber-400/30' : ''}
              `}>

                {/* Bouton Toggle (Ouvrir/Fermer) */}
                <button
                  onClick={() => setIsRegimeOpen(!isRegimeOpen)}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shrink-0
                    ${isRegimeOpen
                      ? 'bg-amber-400 text-black rotate-90'
                      : regime !== 'all' ? 'bg-amber-400/20 text-amber-400' : 'bg-white/5 text-zinc-400 hover:text-white'}
                  `}
                >
                  {isRegimeOpen ? <X size={18} /> : (regime !== 'all' ? <Filter size={16} /> : <Utensils size={16} />)}
                </button>

                {/* Zone Extensible Horizontale */}
                <div className={`
                  flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${isRegimeOpen ? 'max-w-[400px] opacity-100 ml-2 gap-2 pr-2' : 'max-w-0 opacity-0'}
                `}>
                  {[
                    { val: 'all', label: 'Tout', icon: Utensils },
                    { val: 'Végétarien', label: 'Végé', icon: Leaf },
                    { val: 'Sans Gluten', label: 'No Gluten', icon: WheatOff },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => { setRegime(opt.val); setIsRegimeOpen(false); }}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors
                        ${regime === opt.val
                          ? 'bg-amber-400 text-black'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}
                      `}
                    >
                      <opt.icon size={12} />
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Label du régime actif (visible quand fermé) */}
                <div className={`
                  text-[10px] font-bold uppercase tracking-widest text-amber-400 transition-all duration-300 overflow-hidden whitespace-nowrap
                  ${!isRegimeOpen && regime !== 'all' ? 'max-w-[100px] ml-3 mr-3 opacity-100' : 'max-w-0 opacity-0'}
                `}>
                  {regime}
                </div>
              </div>


              {/* Input Prix */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search
                    size={14}
                    className="text-zinc-500 group-focus-within:text-amber-400 transition-colors duration-300"
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  value={prixMax}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || Number(val) >= 0) setPrixMax(val);
                  }}
                  placeholder="Budget max"
                  className="
                    bg-white/5 border border-white/5 rounded-full 
                    pl-9 pr-8 py-2.5 
                    text-xs font-bold text-white 
                    w-40 focus:w-48 
                    focus:ring-1 focus:ring-amber-400 focus:bg-white/10 
                    transition-all duration-300 
                    placeholder:text-zinc-600 outline-none 
                    focus:outline-none
                    
                    /* --- Suppression des flèches (Spin Buttons) --- */
                    [appearance:textfield] 
                    [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none
                  "
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-[10px] text-zinc-600 font-bold pointer-events-none transition-colors group-focus-within:text-zinc-400">
                  €
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- Grille des Contenus --- */}
      <div className="container mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-12 h-12 animate-spin text-amber-400 mb-4" />
            <p className="font-montserrat text-xs tracking-widest uppercase">Chargement...</p>
          </div>
        ) : menus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menus.map((menu) => (
              <div key={menu.id} className="transform hover:-translate-y-2 transition-transform duration-500">
                <MenuCard menu={menu} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <ChefHat className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-xl font-montserrat font-bold text-white mb-2">Aucun Résultat</h3>
            <p className="text-zinc-500 text-sm mb-6">Essayez de modifier vos filtres de recherche.</p>
            <button
              onClick={() => { setTheme('all'); setRegime('all'); setPrixMax(''); }}
              className="px-6 py-2 rounded-full border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all"
            >
              Tout Effacer
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default MenusView;