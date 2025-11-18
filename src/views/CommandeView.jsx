import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { getMenuById, createOrder } from '../utils/firebase';

// --- 1. Fonction utilitaire pour la date ---
const getMinDateFromCondition = (condition) => {
  const today = new Date();
  const cond = condition ? condition.toLowerCase() : "";
  let daysToAdd = 1;
  if (cond.includes("1 mois") || cond.includes("un mois")) daysToAdd = 30;
  else if (cond.includes("2 semaines") || cond.includes("15 jours")) daysToAdd = 15;
  else if (cond.includes("1 semaine") || cond.includes("une semaine")) daysToAdd = 7;
  else if (cond.includes("48h") || cond.includes("48 heures")) daysToAdd = 2;
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + daysToAdd);
  return minDate.toISOString().split('T')[0];
};

// --- Schéma de Validation ---
const orderSchema = z.object({
  // Infos Perso
  nom: z.string(),
  prenom: z.string(),
  email: z.string().email(),
  gsm: z.string().min(10, "Numéro invalide"),
  nom_entreprise: z.string().optional(),
  
  // Prestation
  date_prestation: z.string().min(1, "Date requise"),
  heure_livraison: z.string().min(1, "Heure requise"),
  
  // Adresse Livraison
  livraison_rue: z.string().min(3, "Rue et numéro requis"),
  livraison_complement: z.string().optional(),
  livraison_cp: z.string().min(5, "Code postal invalide"),
  livraison_ville: z.string().min(2, "Ville requise"),

  // Adresse Facturation
  facturation_rue: z.string().optional(),
  facturation_complement: z.string().optional(),
  facturation_cp: z.string().optional(),
  facturation_ville: z.string().optional(),
  
  // Menu
  nombre_personne: z.coerce.number().min(1),
  instructions: z.string().optional(),
});

const CommandeView = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [sameBillingAddress, setSameBillingAddress] = useState(true);

  const { register, handleSubmit, reset, watch, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuById(menuId);
        setMenu(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur menu:", error);
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [menuId]);

  useEffect(() => {
    if (user) {
      reset({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        gsm: user.telephone || "",
      });
    }
  }, [user, reset]);

  // --- 3. Calcul du Prix ---
  const watchedNbPersonne = watch("nombre_personne");
  const watchedVille = watch("livraison_ville");

  const prixTotal = useMemo(() => {
    if (!menu || !watchedNbPersonne) return 0;
    const nbP = parseInt(watchedNbPersonne, 10);
    const minP = menu.nombre_personne_minimum;

    if (nbP < minP) return `Min. ${minP} pers.`;

    let basePrice = menu.prix_par_personne * nbP;
    if (nbP >= minP + 5) {
      basePrice = basePrice * 0.90;
    }

    // Frais si la ville n'est pas Bordeaux
    let frais = 0;
    if (watchedVille && !watchedVille.toLowerCase().trim().includes("bordeaux")) {
      frais = 5.00;
    }

    return (basePrice + frais).toFixed(2) + " €";
  }, [menu, watchedNbPersonne, watchedVille]);


  // --- Soumission ---
  const onSubmit = async (data) => {
    setOrderError(null);
    if (!menu) return;

    // Validation Date
    const minDateStr = getMinDateFromCondition(menu.conditions);
    if (data.date_prestation < minDateStr) {
      setError("date_prestation", { 
        type: "manual", 
        message: `Pour ce menu, la date doit être après le ${new Date(minDateStr).toLocaleDateString('fr-FR')}` 
      });
      return;
    }

    // Validation Min Personnes
    if (data.nombre_personne < menu.nombre_personne_minimum) {
      setOrderError(`Minimum de ${menu.nombre_personne_minimum} personnes requis.`);
      return;
    }

    // Construction des adresses complètes pour Firebase
    const fullDeliveryAddr = `${data.livraison_rue}, ${data.livraison_complement ? data.livraison_complement + ', ' : ''}${data.livraison_cp} ${data.livraison_ville}`;
    
    let fullBillingAddr = fullDeliveryAddr;

    if (!sameBillingAddress) {
      // Si adresses différentes, on valide que les champs facturation sont remplis
      if (!data.facturation_rue || !data.facturation_cp || !data.facturation_ville) {
        setOrderError("Veuillez remplir l'adresse de facturation complète.");
        return;
      }
      fullBillingAddr = `${data.facturation_rue}, ${data.facturation_complement ? data.facturation_complement + ', ' : ''}${data.facturation_cp} ${data.facturation_ville}`;
    }

    try {
      const orderData = {
        uid: user.uid,
        menu_id: menu.id,
        nom_menu: menu.nom_menu,
        ...data,
        adresse_livraison: fullDeliveryAddr,
        adresse_facturation: fullBillingAddr,
        
        prix_total: prixTotal,
        date_commande: new Date(),
        statut: "en attente"
      };

      await createOrder(orderData);
      navigate('/profil');

    } catch (error) {
      console.error("Erreur commande:", error);
      setOrderError("Une erreur est survenue.");
    }
  };

  if (isLoading) return <p className="text-center p-8">Chargement...</p>;
  if (!menu) return <p className="text-center p-8">Menu introuvable.</p>;

  const minDateInput = getMinDateFromCondition(menu.conditions);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl text-center font-bold text-green-700 mb-2">Finaliser ma Commande</h1>
      <p className="text-xl text-center text-zinc-800 mb-6">Menu : <span className="font-semibold">{menu.nom_menu}</span></p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* BLOC 1 : Identité */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-zinc-800 mb-4">1. Vos Coordonnées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700">Nom de l'entreprise (Optionnel)</label>
              <input type="text" {...register("nom_entreprise")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" placeholder="Ex: FastDev SAS" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Nom</label>
              <input {...register("nom")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Prénom</label>
              <input {...register("prenom")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Email</label>
              <input {...register("email")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Téléphone</label>
              <input {...register("gsm")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100" readOnly />
            </div>
          </div>
        </div>

        {/* BLOC 2 : Livraison & Facturation */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-zinc-800 mb-4">2. Livraison & Facturation</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700">Date de livraison souhaitée</label>
                <input type="date" min={minDateInput} {...register("date_prestation")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
                <p className="mt-1 text-xs text-amber-600 font-medium">Condition : {menu.conditions}</p>
                {errors.date_prestation && <p className="text-sm text-red-600">{errors.date_prestation.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Heure de livraison</label>
                <input type="time" {...register("heure_livraison")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
                {errors.heure_livraison && <p className="mt-1 text-sm text-red-600">{errors.heure_livraison.message}</p>}
              </div>
            </div>

            <hr className="border-zinc-200 my-4" />
            <p className="font-medium text-zinc-700 mb-2">Adresse de Livraison</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700">Numéro et Rue</label>
                <input type="text" {...register("livraison_rue")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" placeholder="Ex: 12 Avenue de la République" />
                {errors.livraison_rue && <p className="text-sm text-red-600">{errors.livraison_rue.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700">Complément d'adresse (Optionnel)</label>
                <input type="text" {...register("livraison_complement")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" placeholder="Ex: Bâtiment B, 2ème étage" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Code Postal</label>
                <input type="text" {...register("livraison_cp")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" placeholder="Ex: 33000" />
                {errors.livraison_cp && <p className="text-sm text-red-600">{errors.livraison_cp.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Ville</label>
                <input type="text" {...register("livraison_ville")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" placeholder="Ex: Bordeaux" />
                {errors.livraison_ville && <p className="text-sm text-red-600">{errors.livraison_ville.message}</p>}
              </div>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Note: 5€ de frais de livraison sont ajoutés si la ville n'est pas "Bordeaux".</p>

            {/* Checkbox Facturation */}
            <div className="flex items-center mt-6">
              <input 
                id="sameAddress" 
                type="checkbox" 
                checked={sameBillingAddress}
                onChange={(e) => setSameBillingAddress(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="sameAddress" className="ml-2 block text-sm text-zinc-900">
                Adresse de facturation identique à la livraison
              </label>
            </div>

            {/* Adresse Facturation (Si différente) */}
            {!sameBillingAddress && (
              <div className="mt-4 p-4 bg-zinc-50 rounded-md border border-zinc-200">
                <p className="font-medium text-zinc-700 mb-3">Adresse de Facturation</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700">Numéro et Rue</label>
                    <input type="text" {...register("facturation_rue")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700">Complément (Optionnel)</label>
                    <input type="text" {...register("facturation_complement")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Code Postal</label>
                    <input type="text" {...register("facturation_cp")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Ville</label>
                    <input type="text" {...register("facturation_ville")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700">Instructions spéciales (code porte, allergie...)</label>
              <textarea {...register("instructions")} rows="3" className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" placeholder="Note pour la commande…"></textarea>
            </div>
          </div>
        </div>

        {/* BLOC 3 : Le Menu */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-zinc-800 mb-4">3. Votre Commande</h2>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Nombre de personnes</label>
            <input 
              type="number" 
              min={menu.nombre_personne_minimum} 
              {...register("nombre_personne")} 
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" 
            />
            <p className="mt-2 text-sm text-zinc-600 italic">
              Ce menu est disponible à partir de {menu.nombre_personne_minimum} convives. 
              <span className="text-green-700 font-medium ml-1">
                Profitez d'une remise exceptionnelle de 10% pour les groupes de {menu.nombre_personne_minimum + 5} personnes ou plus.
              </span>
            </p>
            {errors.nombre_personne && <p className="mt-1 text-sm text-red-600">{errors.nombre_personne.message}</p>}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-200 flex justify-between items-center">
            <span className="text-zinc-600">Total estimé (TTC)</span>
            <h3 className="text-3xl font-bold text-green-700">{prixTotal}</h3>
          </div>
        </div>

        {orderError && <p className="text-sm text-red-600 text-center">{orderError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 text-white font-bold py-4 px-6 rounded-md text-xl hover:bg-amber-600 transition-colors disabled:bg-zinc-400 shadow-md"
        >
          {isSubmitting ? "Validation en cours..." : "Valider et Payer à la livraison"}
        </button>

      </form>
    </div>
  );
};

export default CommandeView;