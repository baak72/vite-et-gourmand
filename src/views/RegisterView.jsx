import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus, ArrowRight, AlertCircle } from 'lucide-react';
import { registerUser } from '../utils/firebase';
import { useAuthStore } from '../store/useAuthStore';

// --- Le Schéma de Validation ---
const registerSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court."),
  prenom: z.string().min(2, "Le prénom est trop court."),
  telephone: z.string().min(10, "Numéro de téléphone invalide."),
  email: z.string().email("Format d'email invalide."),
  password: z.string()
    .min(10, "10 caractères minimum.")
    .regex(new RegExp(".*[A-Z].*"), "Au moins une majuscule.")
    .regex(new RegExp(".*[a-z].*"), "Au moins une minuscule.")
    .regex(new RegExp(".*[0-9].*"), "Au moins un chiffre.")
    .regex(new RegExp(".*[!@#$%^&*].*"), "Au moins un caractère spécial (!@#$...)."),
  confirmPassword: z.string(),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

const RegisterView = () => {
  // --- Initialisation des outils ---
  const [firebaseError, setFirebaseError] = useState(null);
  const navigate = useNavigate();
  useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // --- La fonction de soumission ---
  const onSubmit = async (data) => {
    setFirebaseError(null);
    try {
      const additionalData = {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
      };

      await registerUser(data.email, data.password, additionalData);
      navigate('/profil');

    } catch (error) {
      console.error("Erreur d'inscription Firebase :", error.message);
      if (error.code === 'auth/email-already-in-use') {
        setFirebaseError("Cet email est déjà associé à un compte.");
      } else {
        setFirebaseError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-35 relative overflow-hidden py-12">

      {/* Décoration de fond (Lueur) */}
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">

        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-2xl">Nouveau Client</h1>
          <p className="text-zinc-400 text-sm">Créez votre compte pour commander vos menus d'exception</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Ligne Nom / Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="space-y-2">
                <label htmlFor="nom" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Nom</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    id="nom"
                    type="text"
                    placeholder="Dupont"
                    {...register("nom")}
                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                  />
                </div>
                {errors.nom && <p className="text-xs text-red-400 font-medium ml-1">{errors.nom.message}</p>}
              </div>
              {/* Prénom */}
              <div className="space-y-2">
                <label htmlFor="prenom" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Prénom</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    id="prenom"
                    type="text"
                    placeholder="Jean"
                    {...register("prenom")}
                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                  />
                </div>
                {errors.prenom && <p className="text-xs text-red-400 font-medium ml-1">{errors.prenom.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  {...register("email")}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 font-medium ml-1">{errors.email.message}</p>}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="telephone" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Téléphone</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  id="telephone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  {...register("telephone")}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                />
              </div>
              {errors.telephone && <p className="text-xs text-red-400 font-medium ml-1">{errors.telephone.message}</p>}
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                />
              </div>
              {errors.password && <p className="text-xs text-red-400 font-medium ml-1">{errors.password.message}</p>}
            </div>

            {/* Confirmation MDP */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirmation</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 font-medium ml-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Erreur Globale Firebase */}
            {firebaseError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {firebaseError}
              </div>
            )}

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-black font-montserrat font-bold uppercase tracking-widest py-2 px-3 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                "Création en cours..."
              ) : (
                <>
                  Créer mon compte <UserPlus className="w-5 h-5" />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Lien vers Login */}
        <p className="text-center text-zinc-500 mt-8 text-sm">
          Déjà un compte ?
          <Link to="/login" className="font-bold text-white hover:text-amber-500 transition-colors ml-2 inline-flex items-center gap-1 group">
            Se connecter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterView;