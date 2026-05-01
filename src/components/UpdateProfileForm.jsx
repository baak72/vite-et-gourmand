import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../utils/api'; 
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Schéma de validation Zod
const profileSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court."),
  prenom: z.string().min(2, "Le prénom est trop court."),
  telephone: z.string().min(10, "Numéro invalide (10 chiffres min)."),
});

const UpdateProfileForm = ({ user }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Récupération dela fonction du store pour mettre à jour l'affichage sans recharger la page
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      telephone: user?.telephone || "",
    },
  });

  const onSubmit = async (data) => {
    setSuccessMessage(null);
    setApiError(null);
    
    try {
      // Mise à jour dans Laravel
      const response = await api.put('/profil', data);
      console.log("Réponse de Laravel :", response.data);

      // Mise à jour locale (Zustand) pour reflet immédiat
      if (setUser) {
        // On fusionne les anciennes données avec les nouvelles
        setUser({ ...user, ...data });
      }

      setSuccessMessage("Profil mis à jour avec succès !");

      // On efface le message après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      setApiError("Impossible de mettre à jour le profil pour le moment.");
    }
  };

  // Reset du formulaire si l'user change
  useEffect(() => {
    reset({
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      telephone: user?.telephone || "",
    });
  }, [user, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Champ Nom */}
      <div>
        <label htmlFor="nom" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 ml-1">
          Nom
        </label>
        <input
          id="nom"
          type="text"
          {...register("nom")}
          className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
          placeholder="Votre nom"
        />
        {errors.nom && (
          <p className="mt-1 text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.nom.message}
          </p>
        )}
      </div>

      {/* Champ Prénom */}
      <div>
        <label htmlFor="prenom" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 ml-1">
          Prénom
        </label>
        <input
          id="prenom"
          type="text"
          {...register("prenom")}
          className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
          placeholder="Votre prénom"
        />
        {errors.prenom && (
          <p className="mt-1 text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.prenom.message}
          </p>
        )}
      </div>

      {/* Champ Téléphone */}
      <div>
        <label htmlFor="telephone" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 ml-1">
          Téléphone
        </label>
        <input
          id="telephone"
          type="tel"
          {...register("telephone")}
          className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
          placeholder="06 12 34 56 78"
        />
        {errors.telephone && (
          <p className="mt-1 text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.telephone.message}
          </p>
        )}
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Message d'erreur API */}
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold animate-pulse">
          <AlertCircle className="w-4 h-4" />
          {apiError}
        </div>
      )}

      {/* Bouton d'action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 text-black font-montserrat font-bold uppercase tracking-widest py-2 px-3 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Sauvegarde..."
          ) : (
            <>
              <Save className="w-4 h-4" /> Enregistrer les modifications
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default UpdateProfileForm;