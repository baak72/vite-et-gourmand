import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; 
import { getMenus, addMenu, updateMenu, deleteMenu } from '../utils/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Edit, Trash2, Utensils, AlertTriangle, ArrowLeft, Save, AlertCircle } from 'lucide-react';

const AdminMenusTab = () => {
  // --- ÉTATS ---
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Gestion de l'affichage
  const [view, setView] = useState('list');
  const [editingMenu, setEditingMenu] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FORMULAIRE ---
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // --- PERMISSIONS ---
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role_id === 1 || user?.email === 'admin@viteetgourmand.fr';

  // --- CHARGEMENT ---
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const data = await getMenus({});
      setMenus(data);
    } catch (error) {
      console.error("Erreur chargement menus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // --- GESTION DU FORMULAIRE ---
  useEffect(() => {
    if (view === 'form') {
      if (editingMenu) {
        Object.keys(editingMenu).forEach(key => setValue(key, editingMenu[key]));
      } else {
        reset({
          nom_menu: '',
          description: '',
          prix_par_personne: '',
          nombre_personne_minimum: '',
          image: '',
          theme_libelle: 'Classique',
          regime_libelle: 'Aucun', // Valeur par défaut
          conditions: ''
        });
      }
    }
  }, [view, editingMenu, reset, setValue]);

  // --- ACTIONS ---
  const handleCreate = () => {
    if (!isAdmin) return;
    setEditingMenu(null);
    setView('form');
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setView('form');
  };

  const handleCancel = () => {
    setView('list');
    setEditingMenu(null);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Supprimer ce menu définitivement ?")) return;
    try {
      await deleteMenu(id);
      fetchMenus();
    } catch (error) {
      console.error(error);
      alert("Erreur suppression");
    }
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingMenu) {
        await updateMenu(editingMenu.id, data);
      } else {
        if (!isAdmin) {
          alert("Seul l'admin peut ajouter un menu.");
          return;
        }
        await addMenu(data);
      }
      setView('list');
      fetchMenus();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div></div>;

  // --- VUE LISTE ---
  if (view === 'list') {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 font-montserrat">
            <Utensils className="text-amber-500" /> Carte du Restaurant
          </h3>
          
          {isAdmin ? (
            <button onClick={handleCreate} className="w-full sm:w-auto bg-amber-500 text-black px-4 py-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
              <Plus className="w-4 h-4" /> Ajouter Menu
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>Ajout réservé à l'Admin</span>
            </div>
          )}
        </div>

        {/* --- VUE MOBILE : GRILLE DE CARTES --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
            {menus.map((menu) => (
                <div key={menu.id} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex gap-4 shadow-md">
                    <img src={menu.image} alt="" className="w-20 h-20 rounded-lg object-cover bg-zinc-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-sm truncate">{menu.nom_menu}</h4>
                            <span className="font-bold text-amber-500 text-sm">{menu.prix_par_personne}€</span>
                        </div>
                        <p className="text-zinc-500 text-xs line-clamp-2 mt-1">{menu.description}</p>
                        
                        <div className="flex justify-between items-center mt-3">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-zinc-400">
                                {menu.theme_libelle || "Classique"}
                            </span>
                            
                            {isAdmin && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(menu)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(menu.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* --- VUE PC : TABLEAU --- */}
        <div className="hidden md:block bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950 text-zinc-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Détails</th>
                  <th className="px-6 py-4">Prix</th>
                  <th className="px-6 py-4">Catégorie</th>
                  {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <img src={menu.image} alt="" className="w-16 h-12 rounded-lg object-cover bg-zinc-800" />
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-bold text-white mb-1">{menu.nom_menu}</div>
                      <div className="text-xs text-zinc-500 line-clamp-1">{menu.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      <span className="font-bold text-white">{menu.prix_par_personne} €</span>
                      <span className="text-[10px] text-zinc-500 block">Min: {menu.nombre_personne_minimum} p.</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-zinc-400">
                        {menu.theme_libelle}
                      </span>
                    </td>
                    {isAdmin && (
                        <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEdit(menu)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(menu.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE FORMULAIRE (Responsive) ---
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 md:p-6 shadow-xl">
      
      {/* En-tête Formulaire */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/10">
        <h2 className="text-xl font-bold font-playfair text-white">
          {editingMenu ? "Modifier le menu" : "Ajouter un menu"}
        </h2>
        <button onClick={handleCancel} className="text-zinc-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/5 px-3 py-2 rounded-lg">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-4xl mx-auto">
        
        {/* Ligne 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-bold text-zinc-500 uppercase text-xs">Nom du Menu <span className="text-red-500">*</span></label>
            <input 
              {...register("nom_menu", { required: "Le nom est obligatoire." })} 
              className={`w-full bg-zinc-950 border rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 ${errors.nom_menu ? 'border-red-500' : 'border-zinc-800'}`}
              placeholder="Ex: Menu Prestige" 
            />
            {errors.nom_menu && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.nom_menu.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="block font-bold text-zinc-500 uppercase text-xs">Prix / Pers (€) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              step="0.01" 
              {...register("prix_par_personne", { required: "Le prix est obligatoire.", min: 0 })} 
              className={`w-full bg-zinc-950 border rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.prix_par_personne ? 'border-red-500' : 'border-zinc-800'}`}
              placeholder="0.00" 
            />
            {errors.prix_par_personne && <span className="text-red-400 text-xs">{errors.prix_par_personne.message}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block font-bold text-zinc-500 uppercase text-xs">Description <span className="text-red-500">*</span></label>
          <textarea 
            rows="4" 
            {...register("description", { required: "La description est obligatoire." })} 
            className={`w-full bg-zinc-950 border rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 ${errors.description ? 'border-red-500' : 'border-zinc-800'}`}
            placeholder="Détails du menu..." 
          />
          {errors.description && <span className="text-red-400 text-xs">{errors.description.message}</span>}
        </div>

        {/* Ligne 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block font-bold text-zinc-500 uppercase text-xs">Min. Personnes <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              {...register("nombre_personne_minimum", { required: "Requis.", min: 1 })} 
              className={`w-full bg-zinc-950 border rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.nombre_personne_minimum ? 'border-red-500' : 'border-zinc-800'}`}
            />
            {errors.nombre_personne_minimum && <span className="text-red-400 text-xs">{errors.nombre_personne_minimum.message}</span>}
          </div>
          
          <div className="space-y-2">
            <label className="block font-bold text-zinc-500 uppercase text-xs">Thème</label>
            <select {...register("theme_libelle")} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 cursor-pointer">
              <option value="Classique">Classique</option>
              <option value="Noel">Noël</option>
              <option value="Paques">Pâques</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-zinc-500 uppercase text-xs">Régime</label>
            <select {...register("regime_libelle")} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 cursor-pointer">
              <option value="Aucun">Aucun</option>
              <option value="Végétarien">Végétarien</option>
              <option value="Sans Gluten">Sans Gluten</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-2">
          <label className="block font-bold text-zinc-500 uppercase text-xs">Image URL <span className="text-red-500">*</span></label>
          <input 
            {...register("image", { required: "L'image est obligatoire." })} 
            className={`w-full bg-zinc-950 border rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 ${errors.image ? 'border-red-500' : 'border-zinc-800'}`}
            placeholder="https://..." 
          />
          {errors.image && <span className="text-red-400 text-xs">{errors.image.message}</span>}
        </div>

        {/* Conditions */}
        <div className="space-y-2">
          <label className="block font-bold text-zinc-500 uppercase text-xs">Conditions (Optionnel)</label>
          <input {...register("conditions")} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" placeholder="Ex: Commandez 48h à l'avance" />
        </div>

        {/* Boutons Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
           {/* Message Erreur Mobile */}
           {Object.keys(errors).length > 0 && (
             <div className="sm:mr-auto flex items-center justify-center gap-2 text-red-400 bg-red-500/10 px-3 py-2 rounded-lg text-xs font-bold w-full sm:w-auto">
               <AlertCircle className="w-4 h-4"/> Formulaire incomplet
             </div>
           )}
          
          <button type="button" onClick={handleCancel} className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider">
            Annuler
          </button>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 rounded-lg bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/20">
            {isSubmitting ? "Sauvegarde..." : <><Save className="w-4 h-4" /> Enregistrer</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMenusTab;