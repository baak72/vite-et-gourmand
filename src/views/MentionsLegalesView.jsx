import React from 'react';
import { Scale, Building2, Server, ShieldCheck, Code2 } from 'lucide-react';

const MentionsLegalesView = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">

      {/* Décoration de fond */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-white/10 rounded-full mb-4 shadow-lg">
            <Scale className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            Mentions Légales
          </h1>
          <p className="text-zinc-400 text-lg">
            Transparence et conformité réglementaire.
          </p>
        </div>

        <div className="space-y-6">

          {/* BLOC 1 : L'ÉDITEUR */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl">
            <div className="flex items-start gap-4">
              <Building2 className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
              <div>
                <h2 className="text-xl font-bold font-montserrat text-white mb-4">1. Éditeur du Site</h2>
                <div className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                  <p><strong className="text-white">Raison sociale :</strong> Vite & Gourmand</p>
                  <p><strong className="text-white">Forme juridique :</strong> Société (Julie et José) </p>
                  <p><strong className="text-white">Siège social :</strong> Bordeaux, France (Entreprise établie depuis 25 ans)</p>
                  <p><strong className="text-white">Responsables de la publication :</strong> Julie & José (Co-gérants)</p>
                  <p><strong className="text-white">Contact :</strong> contact@viteetgourmand.fr</p>
                </div>
              </div>
            </div>
          </div>

          {/* BLOC 2 : DÉVELOPPEMENT */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl">
            <div className="flex items-start gap-4">
              <Code2 className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
              <div>
                <h2 className="text-xl font-bold font-montserrat text-white mb-4">2. Conception & Développement</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Ce site a été réalisé par l'agence <strong>FastDev</strong>.<br />
                  Réputée pour ses développements de qualité et rapides, FastDev accompagne Vite & Gourmand dans sa transformation numérique.
                </p>
              </div>
            </div>
          </div>

          {/* BLOC 3 : HÉBERGEMENT */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl">
            <div className="flex items-start gap-4">
              <Server className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
              <div>
                <h2 className="text-xl font-bold font-montserrat text-white mb-4">3. Hébergement</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  L'application est hébergée sur une infrastructure Cloud sécurisée (ex: Fly.io / Vercel / Azure).<br />
                  Les données utilisateurs sont stockées via Google Firebase (Base de données et Authentification).
                </p>
              </div>
            </div>
          </div>

          {/* BLOC 4 : RGPD */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
              <div>
                <h2 className="text-xl font-bold font-montserrat text-white mb-4">4. Protection des Données (RGPD)</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Conformément aux réglementations en vigueur, Vite & Gourmand s'engage à protéger vos données personnelles.
                </p>
                <ul className="list-disc list-inside text-zinc-400 text-sm space-y-2">
                  <li><strong>Données collectées :</strong> Nom, prénom, email, téléphone, adresses postales.</li>
                  <li><strong>Finalité :</strong> Gestion des commandes, livraison, facturation et contact client.</li>
                  <li><strong>Droits :</strong> Vous disposez d'un droit d'accès, de modification et de suppression de vos données depuis votre espace utilisateur.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MentionsLegalesView;