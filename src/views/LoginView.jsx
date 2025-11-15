import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

// On importe nos "machines"
import { signInUser } from '../utils/firebase'; // Firebase
import { useAuthStore } from '../store/useAuthStore'; // Zustand

// --- 1. Le Schéma de Validation ---
const loginSchema = z.object({
  email: z.string().email("Votre email n'est pas valide."),
  password: z.string().min(1, "Le mot de passe ne peut pas être vide."),
});

const LoginView = () => {
  // --- 2. Initialisation des Outils ---
  const [firebaseError, setFirebaseError] = useState(null);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // On initialise React Hook Form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema), // On connecte RHF à Zod
  });

  // --- 3. La Fonction de Soumission ---
  const onSubmit = async (data) => {
    setFirebaseError(null); // On réinitialise les erreurs
    try {
      // Étape A: On appelle la Firebase
      const userCredential = await signInUser(data.email, data.password);
      
      // Étape B: On met l'utilisateur dans le Zustand
      setUser(userCredential.user);

      // Étape C: On redirige l'utilisateur vers sa page de profil
      navigate('/profil'); // (On créera cette page plus tard)

    } catch (error) {
      console.error("Erreur de connexion Firebase :", error.message);
      setFirebaseError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Connexion</h1>
      
      {/* --- 4. Le Formulaire --- */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Adresse Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* --- 5. Le Bouton --- */}
        <button
          type="submit"
          disabled={isSubmitting} // Désactive le bouton pendant le chargement
          className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-colors disabled:bg-zinc-400"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>

        {/* --- 6. Affichage des Erreurs Firebase --- */}
        {firebaseError && (
          <p className="text-sm text-red-600 text-center">{firebaseError}</p>
        )}

      </form>
    </div>
  );
};

export default LoginView;