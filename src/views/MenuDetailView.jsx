import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuById } from '../utils/firebase';
import { useAuthStore } from '../store/useAuthStore';

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
      // Si l'utilisateur EST connecté
      // On le redirige vers la page de commande, en passant l'ID du menu
      navigate(`/commande/${menuId}`);
    } else {
      // Si l'utilisateur N'EST PAS connecté
      // On le redirige vers la page de connexion
      navigate('/login');
    }
  };

  // Gestion de l'affichage
  if (isLoading) {
    return <p className="text-center p-8">Chargement du menu...</p>;
  }

  if (!menu) {
    return <p className="text-center p-8">Ce menu n'existe pas.</p>;
  }

  // On affiche les détails du menu
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      {/* (On pourrait mettre une galerie d'images ici) */}
      
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-4">{menu.nom_menu}</h1>
        <p className="text-lg text-zinc-700 mb-6">{menu.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-100 p-4 rounded-lg">
            <span className="text-sm text-zinc-500">Prix par personne</span>
            <p className="text-3xl font-bold text-zinc-900">{menu.prix_par_personne} €</p>
          </div>
          <div className="bg-zinc-100 p-4 rounded-lg">
            <span className="text-sm text-zinc-500">Minimum</span>
            <p className="text-3xl font-bold text-zinc-900">{menu.nombre_personne_minimum} pers.</p>
          </div>
        </div>
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-6">
          <p className="font-bold">Conditions :</p>
          <p>{menu.conditions}</p>
        </div>

        <button 
          onClick={handleOrderClick}
          className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-md text-lg hover:bg-amber-600 transition-colors"
        >
          Commander ce Menu
        </button>
      </div>
    </div>
  );
};

export default MenuDetailView;