import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendContactForm } from '../utils/firebase';

const contactSchema = z.object({
  email: z.string().email("Votre email n'est pas valide."),
  titre: z.string().min(5, "Le titre est trop court."),
  description: z.string().min(10, "Veuillez détailler votre demande."),
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
      // On appelle notre fonction d'envoi d'email
      await sendContactForm(data);
      setSuccessMessage("Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.");
      reset(); // Réinitialise le formulaire après succès
    } catch (error) {
      setErrorMessage("Échec de l'envoi. Veuillez réessayer.");
      console.error("Contact form failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Contactez-Nous</h1>
      <p className="text-center text-zinc-600 mb-8">Nous vous répondrons dans les plus brefs délais.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 space-y-4">
        
        {successMessage && <p className="text-sm text-green-600 text-center font-semibold">{successMessage}</p>}
        {errorMessage && <p className="text-sm text-red-600 text-center font-semibold">{errorMessage}</p>}

        {/* Champ Titre */}
        <div>
          <label htmlFor="titre" className="block text-sm font-medium text-zinc-700">Objet de la demande</label>
          <input id="titre" type="text" {...register("titre")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
          {errors.titre && <p className="mt-1 text-sm text-red-600">{errors.titre.message}</p>}
        </div>

        {/* Champ Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Votre Adresse Email</label>
          <input id="email" type="email" {...register("email")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Champ Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700">Description</label>
          <textarea id="description" rows="5" {...register("description")} className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md" />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-colors disabled:bg-zinc-400"
        >
          {isSubmitting ? "Envoi..." : "Envoyer la Demande"}
        </button>

      </form>
    </div>
  );
};

export default ContactView;