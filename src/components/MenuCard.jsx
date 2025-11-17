import React from 'react';

const MenuCard = ({ menu }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      {/* On pourrait mettre une image ici plus tard */}
      
      <div className="p-6 grow">
        <h3 className="text-2xl font-bold text-green-700 mb-2">{menu.nom_menu}</h3>
        <p className="text-zinc-600 mb-4">{menu.description}</p>
      </div>
      
      <div className="bg-zinc-50 p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-zinc-500">À partir de</p>
          <p className="text-2xl font-bold text-zinc-900">{menu.prix_par_personne} €</p>
        </div>
        {/* On utilisera <Link> ici plus tard */}
        <a 
          href={`/menu/${menu.id}`} 
          className="bg-amber-500 text-white font-bold px-4 py-2 rounded-md hover:bg-amber-600 transition-colors"
        >
          Voir le détail
        </a>
      </div>
    </div>
  );
};

export default MenuCard;