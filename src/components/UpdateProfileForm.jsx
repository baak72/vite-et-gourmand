import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserProfile } from '../utils/firebase';

// 1. Schéma de validation Zod
const profileSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court."),
  prenom: z.string().min(2, "Le prénom est trop court."),
  telephone: z.string().min(10, "Numéro invalide."),
});

// 2. Le composant reçoit l'utilisateur actuel en "prop"
const UpdateProfileForm = ({ user }) => {
  const [successMessage, setSuccessMessage] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    // 3. On pré-remplit le formulaire avec les données actuelles
    defaultValues: {
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      telephone: user?.telephone || "",
    },
  });

  // 4. Fonction de soumission
  const onSubmit = async (data) => {
    setSuccessMessage(null);
    try {
      await updateUserProfile(user.uid, data);
      setSuccessMessage("Profil mis à jour avec succès !");
      // (Idéalement, mettre aussi à jour le "coffre-fort" Zustand ici)
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
    }
  };
  
  // 5. Permet de réinitialiser le formulaire si l'utilisateur (du store) change
  useEffect(() => {
    reset({
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      telephone: user?.telephone || "",
    });
  }, [user, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Champ Nom */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-zinc-700">Nom</label>
        <input id="nom" type="text" {...register("nom")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
        {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
      </div>
      {/* Champ Prénom */}
      <div>
        <label htmlFor="prenom" className="block text-sm font-medium text-zinc-700">Prénom</label>
        <input id="prenom" type="text" {...register("prenom")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
        {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>}
      </div>
      {/* Champ Téléphone */}
      <div>
        <label htmlFor="telephone" className="block text-sm font-medium text-zinc-700">Téléphone</label>
        <input id="telephone" type="tel" {...register("telephone")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
        {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-md hover:bg-green-800 transition-colors disabled:bg-zinc-400"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
      
      {successMessage && (
        <p className="text-sm text-green-600 text-center">{successMessage}</p>
      )}
    </form>
  );
};

export default UpdateProfileForm;