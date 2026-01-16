import React from 'react';
import { ScrollText, Truck, AlertTriangle, Percent, CalendarClock, Ban } from 'lucide-react';

const CGVView = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">

      {/* Fond lumineux décoratif */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-white/10 rounded-full mb-4 shadow-lg">
            <ScrollText className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-zinc-400 text-lg">
            Règles applicables aux prestations de Vite & Gourmand.
          </p>
        </div>

        <div className="space-y-8">

          {/* ARTICLE 1 : COMMANDES */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl group">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <CalendarClock className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-montserrat text-white mb-2">Article 1 : Commandes et Délais</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Toute commande s'effectue via l'application. Chaque menu dispose de conditions spécifiques (ex: commande 1 mois à l'avance pour Noël, ou 48h pour d'autres).
                  Le client s'engage à respecter le nombre minimum de convives indiqué sur la fiche du menu.
                </p>
              </div>
            </div>
          </div>

          {/* ARTICLE 2 : TARIFS ET RÉDUCTIONS */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl group">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <Percent className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-montserrat text-white mb-2">Article 2 : Tarifs et Réductions</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-2">
                  Les prix sont indiqués en euros par personne.
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
                  <strong>Avantage groupe :</strong> Une réduction de 10% est automatiquement appliquée pour toute commande dépassant de 5 personnes le nombre minimum requis pour un menu.
                </div>
              </div>
            </div>
          </div>

          {/* ARTICLE 3 : LIVRAISON */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl group">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <Truck className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-montserrat text-white mb-2">Article 3 : Conditions de Livraison</h2>
                <ul className="list-disc list-inside text-zinc-400 text-sm space-y-2">
                  <li>La livraison est <strong>gratuite</strong> dans la ville de Bordeaux.</li>
                  <li>Pour toute livraison hors Bordeaux, une facturation de <strong>5,00 €</strong> est appliquée.</li>
                  <li>Un supplément kilométrique de <strong>0,59 € par kilomètre</strong> parcouru sera ajouté pour les livraisons hors zone.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ARTICLE 4 : MATÉRIEL (IMPORTANT) */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-red-500/30 transition-colors shadow-xl group">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-red-500/10 transition-colors">
                <AlertTriangle className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-montserrat text-white mb-2">Article 4 : Prêt de Matériel et Pénalités</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                  En cas de prêt de matériel (vaisselle, étuves, etc.), le statut de la commande passera à "En attente du retour de matériel".
                  Le client doit restituer ce matériel en prenant contact avec la société.
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400 flex gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>
                    <strong>Clause de pénalité :</strong> Si le matériel n'est pas restitué sous <strong>10 jours ouvrés</strong> après la livraison, le client devra s'acquitter d'une somme forfaitaire de <strong>600 €</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ARTICLE 5 : ANNULATION */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors shadow-xl group">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <Ban className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-montserrat text-white mb-2">Article 5 : Modification et Annulation</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Le client peut modifier ses informations ou annuler sa commande tant que celle-ci n'a pas atteint le statut <strong>"Accepté"</strong>.
                  Le choix du menu ne peut pas être modifié une fois la commande passée.
                  <br /><br />
                  De son côté, Vite & Gourmand ne peut annuler une commande sans avoir préalablement contacté le client par téléphone ou email pour en expliquer le motif.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CGVView;