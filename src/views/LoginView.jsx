import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser, sendPasswordReset } from '../utils/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

// --- Schéma de Validation LOGIN ---
const loginSchema = z.object({
  email: z.string().email("Format d'email invalide."),
  password: z.string().min(1, "Veuillez entrer votre mot de passe."),
});

// --- Schéma de Validation RESET (Email seul) ---
const resetSchema = z.object({
  email: z.string().email("Format d'email invalide."),
});

const LoginView = () => {
  // --- États ---
  const [isResetMode, setIsResetMode] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);
  
  const navigate = useNavigate();
  useAuthStore((state) => state.setUser);

  // --- Formulaire de CONNEXION ---
  const { 
    register: registerLogin, 
    handleSubmit: handleSubmitLogin, 
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin } 
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // --- Formulaire de RÉINITIALISATION ---
  const { 
    register: registerReset, 
    handleSubmit: handleSubmitReset, 
    formState: { errors: errorsReset, isSubmitting: isSubmittingReset } 
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  // --- Action : Se Connecter ---
  const onLogin = async (data) => {
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

  // --- Action : Réinitialiser le mot de passe ---
  const onReset = async (data) => {
    setFirebaseError(null);
    setResetSuccess(null);
    try {
      await sendPasswordReset(data.email);
      setResetSuccess("Un e-mail de réinitialisation vous a été envoyé. Vérifiez vos spams !");
    } catch (error) {
      console.error("Erreur reset :", error.message);
      setFirebaseError("Impossible d'envoyer l'email. Vérifiez l'adresse saisie.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-12 relative overflow-hidden px-4">

      {/* Décoration de fond (Lueur) */}
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">

        {/* En-tête Dynamique */}
        <div className="text-center mb-8">
          <h1 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-2xl">
            {isResetMode ? "Mot de passe oublié" : "Espace Client"}
          </h1>
          <p className="text-zinc-400 text-sm">
            {isResetMode 
              ? "Entrez votre email pour recevoir un lien de réinitialisation." 
              : "Connectez-vous pour gérer vos commandes"
            }
          </p>
        </div>

        {/* --- La Carte --- */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-300">
          
          {/* Si on est en mode RESET */}
          {isResetMode ? (
            <form onSubmit={handleSubmitReset(onReset)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Champ Email (Reset) */}
              <div className="space-y-2">
                <label htmlFor="reset-email" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                  Adresse Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="exemple@email.com"
                    {...registerReset("email")}
                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                  />
                </div>
                {errorsReset.email && (
                  <p className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errorsReset.email.message}
                  </p>
                )}
              </div>

              {/* Message de succès ou erreur */}
              {resetSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {resetSuccess}
                </div>
              )}
              {firebaseError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {firebaseError}
                </div>
              )}

              {/* Boutons Actions Reset */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingReset}
                  className="w-full bg-amber-500 text-black font-montserrat font-bold uppercase tracking-widest py-2 px-3 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  {isSubmittingReset ? "Envoi..." : <>Envoyer le lien <Send className="w-4 h-4" /></>}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setFirebaseError(null);
                    setResetSuccess(null);
                  }}
                  className="w-full text-zinc-400 text-xs font-bold uppercase tracking-widest py-2 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour à la connexion
                </button>
              </div>
            </form>

          ) : (
            // Si on est en mode LOGIN
            <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">

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
                    {...registerLogin("email")}
                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                  />
                </div>
                {errorsLogin.email && (
                  <p className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errorsLogin.email.message}
                  </p>
                )}
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                    Mot de passe
                  </label>
                  {/* LIEN MOT DE PASSE OUBLIÉ */}
                  <button 
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setFirebaseError(null);
                    }}
                    className="text-xs text-amber-500 hover:text-amber-400 hover:underline transition-all"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...registerLogin("password")}
                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
                  />
                </div>
                {errorsLogin.password && (
                  <p className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errorsLogin.password.message}
                  </p>
                )}
              </div>

              {/* Erreurs Firebase Login */}
              {firebaseError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {firebaseError}
                </div>
              )}

              {/* Bouton Connexion */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full bg-amber-500 text-black font-montserrat font-bold uppercase tracking-widest py-2 px-3 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
              >
                {isSubmittingLogin ? (
                  "Connexion..."
                ) : (
                  <>
                    Se connecter <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>
          )}
        </div>

        {/* --- Lien Inscription --- */}
        {!isResetMode && (
          <p className="text-center text-zinc-500 mt-8 text-sm">
            Vous n'avez pas encore de compte ?
            <Link to="/register" className="font-bold text-white hover:text-amber-500 transition-colors ml-2 inline-flex items-center gap-1 group">
              Créer un compte <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        )}

      </div>
    </div>
  );
};

export default LoginView;