import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser } from '../utils/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';

// --- Le Schéma de Validation ---
const loginSchema = z.object({
  email: z.string().email("Format d'email invalide."),
  password: z.string().min(1, "Veuillez entrer votre mot de passe."),
});

const LoginView = () => {
  // --- Initialisation des Outils ---
  const [firebaseError, setFirebaseError] = useState(null);
  const navigate = useNavigate();
  
  // on garde l'appel au store
  useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // --- La Fonction de Soumission ---
  const onSubmit = async (data) => {
    setFirebaseError(null);
    try {
      await signInUser(data.email, data.password);
      navigate('/profil');
    } catch (error) {
      console.error("Erreur de connexion Firebase :", error.message);
      if (error.code === 'auth/invalid-credential') {
        setFirebaseError("Email ou mot de passe incorrect.");
      } else {
        setFirebaseError("Une erreur est survenue. Réessayez plus tard.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-12 relative overflow-hidden">

      {/* Décoration de fond (Lueur) */}
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">

        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-2xl">Espace Client</h1>
          <p className="text-zinc-400 text-sm">Connectez-vous pour gérer vos commandes</p>
        </div>

        {/* --- Le Formulaire (Carte) --- */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-8">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                Adresse Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  {...register("email")}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* --- Erreurs Firebase --- */}
            {firebaseError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {firebaseError}
              </div>
            )}

            {/* --- Le Bouton --- */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-black font-montserrat font-bold uppercase tracking-widest py-2 px-3 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Connexion..."
              ) : (
                <>
                  Se connecter <LogIn className="w-5 h-5" />
                </>
              )}
            </button>

          </form>
        </div>

        {/* --- Lien Inscription --- */}
        <p className="text-center text-zinc-500 mt-8 text-sm">
          Vous n'avez pas encore de compte ?
          <Link to="/register" className="font-bold text-white hover:text-amber-500 transition-colors ml-2 inline-flex items-center gap-1 group">
            Créer un compte <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginView;