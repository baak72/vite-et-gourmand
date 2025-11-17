import React, { useState, useEffect } from 'react';
import { getMenus } from '../utils/firebase';
import MenuCard from '../components/MenuCard';

const MenusView = () => {
  // --- États pour les données ---
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- États pour les filtres ---
  const [prixMax, setPrixMax] = useState('');
  const [theme, setTheme] = useState('all'); 
  const [regime, setRegime] = useState('all');

  useEffect(() => {
    
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        
        const filters = {
          prixMax: prixMax,
          theme: theme,
          regime: regime
        };

        const data = await getMenus(filters); 
        setMenus(data);
      } catch (error) {
        console.error("Erreur, impossible de charger les menus :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, [prixMax, theme, regime]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
        Découvrez Nos Menus
      </h1>

      {/* --- Section Filtres --- */}
      <div className="bg-zinc-100 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Filtre Prix Max */}
          <div>
            <label htmlFor="prixMax" className="block text-sm font-medium text-zinc-700">Prix Maximum</label>
            <input
              type="number"
              id="prixMax"
              min="0"
              max="50"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md"
              placeholder="ex: 50"
            />
          </div>

          {/* Filtre Thème */}
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-zinc-700">Thème</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md"
            >
              <option value="all">Tous les thèmes</option>
              <option value="Noel">Noël</option>
              <option value="Paques">Pâques</option>
              <option value="Classique">Classique</option>
            </select>
          </div>

          {/* Filtre Régime */}
          <div>
            <label htmlFor="regime" className="block text-sm font-medium text-zinc-700">Régime</label>
            <select
              id="regime"
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md"
            >
              <option value="all">Tous les régimes</option>
              <option value="Végétarien">Végétarien</option>
              <option value="Sans Gluten">Sans Gluten</option>
              <option value="Classique">Classique</option>
            </select>
          </div>

        </div>
      </div>

      {/* --- Section Grille des Menus --- */}
      {isLoading ? (
        <p className="text-center">Chargement des menus...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenusView;