import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

// On importe nos "machines"
import { registerUser } from '../utils/firebase'; // Firebase
import { useAuthStore } from '../store/useAuthStore'; // Zustand

// --- 1. Le Schéma de Validation ---
const registerSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court."),
  prenom: z.string().min(2, "Le prénom est trop court."),
  telephone: z.string().min(10, "Numéro de téléphone invalide."),
  email: z.string().email("Votre email n'est pas valide."),
  password: z.string()
    .min(10, "10 caractères minimum.")
    .regex(new RegExp(".*[A-Z].*"), "Au moins une majuscule.")
    .regex(new RegExp(".*[a-z].*"), "Au moins une minuscule.")
    .regex(new RegExp(".*[0-9].*"), "Au moins un chiffre.")
    .regex(new RegExp(".*[!@#$%^&*].*"), "Au moins un caractère spécial (!@#$...)."),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  // On vérifie que les 2 MDP sont identiques
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

const RegisterView = () => {
  // --- 2. Initialisation des Outils ---
  const [firebaseError, setFirebaseError] = useState(null);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // --- 3. La Fonction de Soumission ---
  const onSubmit = async (data) => {
    setFirebaseError(null);
    try {
      // Étape A: On appelle Firebase
      const additionalData = {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
      };
      const userCredential = await registerUser(data.email, data.password, additionalData);
      
      // Étape B: On connecte l'utilisateur
      setUser(userCredential.user);

      // Étape C: On redirige vers la page de profil
      navigate('/profil'); // (On créera cette page plus tard)

    } catch (error) {
      console.error("Erreur d'inscription Firebase :", error.message);
      if (error.code === 'auth/email-already-in-use') {
        setFirebaseError("Cet email est déjà utilisé.");
      } else {
        setFirebaseError("Une erreur est survenue lors de l'inscription.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Créer un compte</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-zinc-700">Nom</label>
            <input id="nom" type="text" {...register("nom")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
            {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
          </div>
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-zinc-700">Prénom</label>
            <input id="prenom" type="text" {...register("prenom")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
            {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email</label>
          <input id="email" type="email" {...register("email")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-zinc-700">Téléphone</label>
          <input id="telephone" type="tel" {...register("telephone")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
          {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Mot de passe</label>
          <input id="password" type="password" {...register("password")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700">Confirmer le mot de passe</label>
          <input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-colors disabled:bg-zinc-400"
        >
          {isSubmitting ? "Création..." : "S'inscrire"}
        </button>

        {firebaseError && (
          <p className="text-sm text-red-600 text-center">{firebaseError}</p>
        )}
      </form>

      {/* --- Lien vers Connexion --- */}
      <p className="text-center text-zinc-600 mt-4">
        Déjà un compte ? 
        <Link to="/login" className="font-medium text-green-700 hover:underline ml-1">
          Se connecter
        </Link>
      </p>

    </div>
  );
};

export default RegisterView;