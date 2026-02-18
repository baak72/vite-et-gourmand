🍽️ Vite & Gourmand - Application Web Traiteur

📖 Présentation du Projet

Vite & Gourmand est une application web complète développée pour un traiteur bordelais (Julie et José) souhaitant digitaliser son offre. Ce projet a été réalisé par l'agence fictive FastDev dans le cadre de l'Évaluation en Cours de Formation (ECF) pour le titre professionnel Développeur Web et Web Mobile.

L'application permet aux visiteurs de consulter les menus, aux clients de passer et suivre leurs commandes, et aux employés/administrateurs de gérer l'activité de l'entreprise.

🔗 Liens Importants & Livrables

Ce dépôt GitHub fait partie d'un ensemble de livrables d'examen.

🌐 **Application en production (Déploiement) :** [https://vite-et-gourmand.web.app](https://vite-et-gourmand.web.app)

📋 Gestion de projet (Kanban) : [Insérer le lien Jira/Trello/Notion ici]

📄 Documents annexes fournis séparément :

Copie à rendre avec identifiants Administrateur.

Modèle Conceptuel de Données (MCD) & Diagrammes (Séquence, Cas d'utilisation).

Manuel d'utilisation, Charte Graphique et Maquettes (Figma).

🛠️ Architecture & Choix Techniques

Conformément au cahier des charges exigeant une base de données relationnelle (SQL) ET non relationnelle (NoSQL), ce projet adopte une architecture hybride :

Front-End (React + Vite) : Choisi pour la réactivité de l'interface, facilitant la mise en place de filtres dynamiques sans rechargement de page.

Back-End & NoSQL (Firebase) : * Firestore (NoSQL) est utilisé en production pour sa flexibilité (gestion dynamique des menus, allergènes, plats) et ses requêtes en temps réel (suivi des commandes).

Cloud Functions / Firebase Auth assurent la sécurité des accès et la logique métier côté serveur (attribution des rôles, protection des routes Admin).

Schéma Relationnel (SQL) : Pour répondre aux exigences académiques de modélisation relationnelle, la structure complète de la base de données a été modélisée.

👉 Les fichiers ddl.sql (création) et dml.sql (données de test) sont disponibles à la racine du projet dans le dossier /sql.

🚀 Guide de Déploiement Local

Pour tester l'application sur votre environnement de développement local, veuillez suivre les étapes ci-dessous :

1. Prérequis

Node.js (version 18 ou supérieure recommandée).

Git installé sur votre machine.

2. Installation

Clonez le dépôt sur votre machine locale :

git clone [https://github.com/baak72/vite-et-gourmand.git](https://github.com/baak72/vite-et-gourmand.git)
cd votre-repo-vite-et-gourmand


Installez les dépendances du projet :

npm install


3. Variables d'environnement

Créez un fichier .env à la racine du projet et ajoutez vos clés de configuration Firebase (ces clés peuvent vous être fournies sur demande ou via le document d'architecture) :

VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id


4. Lancement du serveur de développement

Démarrez l'application localement :

npm run dev


L'application sera accessible depuis votre navigateur à l'adresse indiquée dans le terminal (généralement http://localhost:5173).

🌿 Stratégie de Versioning (Git Flow)

Afin de garantir un code stable et un travail collaboratif simulé de qualité, la méthodologie Git Flow a été strictement appliquée :

main : Branche de production contenant uniquement le code validé, testé et déployé.

development : Branche de pré-production regroupant l'intégration des nouvelles fonctionnalités.

feature/... : Branches éphémères créées depuis development pour chaque tâche ou fonctionnalité spécifique.

🔒 Sécurité & Accessibilité (RGAA)

Accessibilité : L'interface a été conçue pour respecter les normes RGAA (contrastes validés en mode sombre, attributs alt sur les images, navigation au clavier, balisage sémantique HTML5).

Sécurité Front-end : Protection des routes via des composants de type ProtectedRoute vérifiant le rôle (Client, Employé, Admin).

Sécurité Back-end : * Validation stricte des mots de passe à l'inscription (10 caractères, Maj, Min, Chiffres, Spécial).

Les données sensibles sont protégées par les Security Rules de Firestore (un client ne peut lire que ses propres commandes, seul l'admin peut créer un compte employé).

✨ Fonctionnalités Implémentées

✅ Catalogue dynamique : Filtres par prix, thèmes, régimes et nombre de personnes sans rechargement.

✅ Tunnel de commande complet : Calcul des frais kilométriques de livraison (hors Bordeaux) et de la remise automatique (-10%).

✅ Espace Client : Suivi des statuts de commande, annulation possible (si non-acceptée), et dépôt d'avis (si commande terminée).

✅ Espace Employé : Modération des avis, mise à jour des statuts de commande, gestion des pénalités de matériel (600€).

✅ Espace Administrateur : Création sécurisée de comptes employés, tableau de bord des commandes.

Réalisé par Barakat Mohamed Kassim - Session Juin/Juillet 2026 - STUDI