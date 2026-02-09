import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendContactForm } from '../utils/firebase';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

// Schéma de validation
const contactSchema = z.object({
  email: z.string().email("Votre email n'est pas valide."),
  titre: z.string().min(5, "L'objet est trop court."),
  description: z.string().min(10, "Veuillez détailler un peu plus votre demande."),
});

const ContactView = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await sendContactForm(data);
      setSuccessMessage("Message envoyé ! Nous revenons vers vous très vite.");
      reset();
    } catch (error) {
      setErrorMessage("Oups, une erreur est survenue. Veuillez réessayer.");
      console.error("Contact form failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-32 md:pt-36 md:pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Styles globaux pour la police */}
      <style>{`
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* === COLONNE GAUCHE : INFOS & INTRO === */}
        <div className="flex flex-col justify-center h-full space-y-8">

          <div>
            <div className="w-12 h-[1px] bg-amber-500 mb-6"></div>
            <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-3 text-xs md:text-sm">
              Parlons de votre projet
            </h2>
            <h1 className="font-playfair text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
              Contactez-nous
            </h1>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light font-montserrat">
              Une question sur nos menus ? Une demande spécifique pour un événement ?
              Remplissez le formulaire et notre équipe vous répondra sous 24h.
            </p>
          </div>

          {/* Cartes d'infos CLIQUABLES (Actions rapides Mobile) */}
          <div className="space-y-4">
            
            {/* Téléphone */}
            <a href="tel:0556000000" className="group flex items-center space-x-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/50 hover:bg-zinc-900 transition-all active:scale-[0.98]">
              <div className="bg-amber-500/10 p-3 rounded-full text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Appelez-nous</p>
                <p className="text-white font-montserrat font-bold text-lg">05 56 00 00 00</p>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:contact@vite-et-gourmand.fr" className="group flex items-center space-x-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/50 hover:bg-zinc-900 transition-all active:scale-[0.98]">
              <div className="bg-amber-500/10 p-3 rounded-full text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Écrivez-nous</p>
                <p className="text-white font-montserrat font-bold text-sm md:text-base break-all">contact@vite-et-gourmand.fr</p>
              </div>
            </a>

            {/* Adresse */}
            <a href="https://maps.google.com/?q=123+Avenue+de+la+Gastronomie+33000+Bordeaux" target="_blank" rel="noreferrer" className="group flex items-center space-x-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/50 hover:bg-zinc-900 transition-all active:scale-[0.98]">
              <div className="bg-amber-500/10 p-3 rounded-full text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Venez nous voir</p>
                <p className="text-white font-montserrat font-semibold text-sm">123 Avenue de la Gastronomie, Bordeaux</p>
              </div>
            </a>

          </div>
        </div>

        {/* === COLONNE DROITE : FORMULAIRE === */}
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden mt-8 lg:mt-0">

          {/* Petit effet de lumière */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">

            {/* Messages Succès / Erreur */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-semibold">{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-semibold">{errorMessage}</p>
              </div>
            )}

            {/* Champ Titre */}
            <div className="space-y-2">
              <label htmlFor="titre" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Objet</label>
              <input
                id="titre"
                type="text"
                placeholder="Ex: Réservation de groupe..."
                {...register("titre")}
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-5 py-4 text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
              />
              {errors.titre && <p className="text-xs text-red-500 font-medium ml-1">{errors.titre.message}</p>}
            </div>

            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                {...register("email")}
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-5 py-4 text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700"
              />
              {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
            </div>

            {/* Champ Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Message</label>
              <textarea
                id="description"
                rows="5"
                placeholder="Dites-nous en plus sur vos besoins..."
                {...register("description")}
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-5 py-4 text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-700 resize-none"
              />
              {errors.description && <p className="text-xs text-red-500 font-medium ml-1">{errors.description.message}</p>}
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-black text-sm font-montserrat font-bold uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  Envoyer le message <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactView;