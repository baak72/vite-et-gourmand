import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { getMenuById, createOrder } from '../utils/firebase';
import {
  Calendar, Clock, MapPin, User, Building, Mail, Phone,
  CheckCircle2, AlertCircle, Utensils, FileText, Truck, ArrowRight
} from 'lucide-react';

// --- Fonction utilitaire pour la date ---
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
  nom: z.string(),
  prenom: z.string(),
  email: z.string().email(),
  gsm: z.string().min(10, "Numéro invalide"),
  nom_entreprise: z.string().optional(),
  date_prestation: z.string().min(1, "Date requise"),
  heure_livraison: z.string().min(1, "Heure requise"),
  livraison_rue: z.string().min(3, "Rue et numéro requis"),
  livraison_complement: z.string().optional(),
  livraison_cp: z.string().min(5, "Code postal invalide"),
  livraison_ville: z.string().min(2, "Ville requise"),
  facturation_rue: z.string().optional(),
  facturation_complement: z.string().optional(),
  facturation_cp: z.string().optional(),
  facturation_ville: z.string().optional(),
  pret_materiel: z.boolean().optional(),
  nombre_personne: z.coerce.number().min(2, "Veuillez indiquer au moins 2 convives"),
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

  // --- Calcul du Prix ---
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

    const minDateStr = getMinDateFromCondition(menu.conditions);
    if (data.date_prestation < minDateStr) {
      setError("date_prestation", {
        type: "manual",
        message: `La date doit être après le ${new Date(minDateStr).toLocaleDateString('fr-FR')}`
      });
      return;
    }

    if (data.nombre_personne < menu.nombre_personne_minimum) {
      setOrderError(`Minimum de ${menu.nombre_personne_minimum} personnes requis.`);
      return;
    }

    const fullDeliveryAddr = `${data.livraison_rue}, ${data.livraison_complement ? data.livraison_complement + ', ' : ''}${data.livraison_cp} ${data.livraison_ville}`;
    let fullBillingAddr = fullDeliveryAddr;

    if (!sameBillingAddress) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!menu) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
      <p>Menu introuvable.</p>
    </div>
  );

  const minDateInput = getMinDateFromCondition(menu.conditions);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">

      {/* Fond lumineux décoratif */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-10">
          <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-xs">Finalisation</h2>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            Votre Commande
          </h1>
          <p className="text-zinc-400 text-lg">
            Vous avez choisi le menu <span className="text-white font-bold border-b border-amber-500">{menu.nom_menu}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* === COLONNE GAUCHE (IDENTITÉ & LOGISTIQUE) === */}
            <div className="lg:col-span-2 space-y-8">

              {/* BLOC 1 : Identité */}
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <User className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold font-montserrat">Vos Coordonnées</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Entreprise (Optionnel)</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input type="text" {...register("nom_entreprise")} className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:border-amber-500 focus:outline-hidden transition-colors placeholder:text-zinc-700" placeholder="Ex: FastDev SAS" />
                    </div>
                  </div>

                  {/* Champs ReadOnly (Grisés) */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nom</label>
                    <input {...register("nom")} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-3 cursor-not-allowed opacity-70" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Prénom</label>
                    <input {...register("prenom")} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-3 cursor-not-allowed opacity-70" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input {...register("email")} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-xl pl-10 pr-4 py-3 cursor-not-allowed opacity-70" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input {...register("gsm")} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-xl pl-10 pr-4 py-3 cursor-not-allowed opacity-70" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOC 2 : Livraison */}
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <Truck className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold font-montserrat">Livraison</h2>
                </div>

                <div className="space-y-6">

                  {/* --- Date & Heure --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Date souhaitée</label>
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors pointer-events-none z-10" />
                        <input
                          type="date"
                          min={minDateInput}
                          {...register("date_prestation")}
                          className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-amber-500/80 font-medium">Condition : {menu.conditions}</p>
                      {errors.date_prestation && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.date_prestation.message}</p>}
                    </div>

                    {/* Heure */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Heure souhaitée</label>
                      <div className="relative group">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors pointer-events-none z-10" />
                        <input
                          type="time"
                          {...register("heure_livraison")}
                          className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                      </div>
                      {errors.heure_livraison && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.heure_livraison.message}</p>}
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm font-bold text-zinc-300">Adresse de Livraison</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <input type="text" {...register("livraison_rue")} className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-amber-500 focus:outline-hidden transition-colors placeholder:text-zinc-700" placeholder="Numéro et rue" />
                        {errors.livraison_rue && <p className="text-xs text-red-400 mt-1">{errors.livraison_rue.message}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <input type="text" {...register("livraison_complement")} className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-amber-500 focus:outline-hidden transition-colors placeholder:text-zinc-700" placeholder="Complément (Bâtiment, étage...)" />
                      </div>
                      <div>
                        <input type="text" {...register("livraison_cp")} className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-amber-500 focus:outline-hidden transition-colors placeholder:text-zinc-700" placeholder="Code Postal" />
                        {errors.livraison_cp && <p className="text-xs text-red-400 mt-1">{errors.livraison_cp.message}</p>}
                      </div>
                      <div>
                        <input type="text" {...register("livraison_ville")} className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-amber-500 focus:outline-hidden transition-colors placeholder:text-zinc-700" placeholder="Ville" />
                        {errors.livraison_ville && <p className="text-xs text-red-400 mt-1">{errors.livraison_ville.message}</p>}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 italic">Note : 5€ de frais supplémentaires hors Bordeaux.</p>
                  </div>

                  {/* Options Facturation */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={sameBillingAddress}
                          onChange={(e) => setSameBillingAddress(e.target.checked)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-zinc-700 bg-zinc-950 transition-all checked:border-amber-500 checked:bg-amber-500"
                        />
                        <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Adresse de facturation identique</span>
                    </label>

                    {/* Bloc Adresse Facturation si différent */}
                    {!sameBillingAddress && (
                      <div className="p-4 bg-zinc-950/30 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="font-bold text-zinc-400 text-sm mb-3">Adresse de Facturation</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <input type="text" {...register("facturation_rue")} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden" placeholder="Rue" />
                          </div>
                          <div className="md:col-span-2">
                            <input type="text" {...register("facturation_complement")} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden" placeholder="Complément" />
                          </div>
                          <div>
                            <input type="text" {...register("facturation_cp")} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden" placeholder="CP" />
                          </div>
                          <div>
                            <input type="text" {...register("facturation_ville")} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden" placeholder="Ville" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Options Matériel & Instructions */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          {...register("pret_materiel")}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-zinc-700 bg-zinc-950 transition-all checked:border-amber-500 checked:bg-amber-500"
                        />
                        <Utensils className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Prêt de matériel (vaisselle, etc.)</span>
                    </label>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Instructions spéciales</label>
                      <textarea
                        {...register("instructions")}
                        rows="3"
                        className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-amber-500 focus:outline-hidden transition-colors placeholder:text-zinc-700 resize-none"
                        placeholder="Code porte, intolérances, précisions..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* COLONNE DROITE (RÉCAPITULATIF & VALIDATION) */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl sticky top-28">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold font-montserrat">Récapitulatif</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        Nombre de convives
                      </label>
                      <input
                        type="number"
                        min={menu.nombre_personne_minimum}
                        {...register("nombre_personne")}
                        className="
                              w-full bg-zinc-950 border border-zinc-800 
                              text-white font-bold text-lg rounded-xl px-4 py-3 
                              focus:border-amber-500 focus:outline-none text-center
                              
                              /* --- Suppression des flèches --- */
                              [appearance:textfield] 
                              [&::-webkit-outer-spin-button]:appearance-none 
                              [&::-webkit-inner-spin-button]:appearance-none
                            "
                      />
                      {errors.nombre_personne && (
                        <p className="text-xs text-red-400 mt-1 text-center">
                          {errors.nombre_personne.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-xs text-amber-200/80 leading-relaxed">
                    <span className="font-bold text-amber-500 block mb-1">Offre de groupe :</span>
                    Profitez de <span className="text-white font-bold">-10%</span> dès {menu.nombre_personne_minimum + 5} personnes.
                  </div>

                  <div className="py-6 border-t border-b border-white/5 text-center">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total estimé (TTC)</p>
                    <p className="text-4xl font-playfair font-bold text-amber-500">{prixTotal}</p>
                  </div>

                  {orderError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center justify-center gap-2 text-center">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {orderError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 text-black font-montserrat font-bold uppercase tracking-widest py-3 px-5 rounded-xl hover:bg-amber-400 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Validation..."
                    ) : (
                      <>
                        Valider la commande <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-zinc-600">Paiement à la livraison ou sur facture.</p>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CommandeView;