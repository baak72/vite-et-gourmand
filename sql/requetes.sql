-- ==============================================================================
-- DOSSIER DE COMPÉTENCES SQL - PROJET VITE ET GOURMAND
-- Ce fichier contient les traductions en SQL pur des requêtes générées par 
-- l'ORM Eloquent de Laravel dans les différents contrôleurs de l'application.
-- ==============================================================================


-- ==============================================================================
-- 1. CONTRÔLEUR : AdminController.php
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- REQUÊTE N°1 : Récupération de toutes les commandes pour le tableau de bord Admin
-- Fonction d'origine : getAllCommandes()
-- Description : Cette requête permet à l'administrateur de voir toutes les 
-- commandes en cours. Elle utilise des jointures internes (INNER JOIN) pour 
-- lier la table `commandes` aux tables `menus` et `utilisateurs`. Cela permet 
-- d'afficher directement le nom du menu et les coordonnées du client plutôt 
-- que de simples identifiants numériques. La requête peut aussi être filtrée 
-- par statut (ex: uniquement les commandes "en attente").
-- ------------------------------------------------------------------------------
SELECT 
    commandes.*, 
    menus.nom_menu, 
    utilisateurs.nom, 
    utilisateurs.prenom, 
    utilisateurs.email, 
    utilisateurs.telephone
FROM commandes
INNER JOIN menus ON commandes.menu_id = menus.id
INNER JOIN utilisateurs ON commandes.utilisateur_id = utilisateurs.utilisateur_id
-- La ligne suivante est dynamique en fonction du filtre choisi par l'admin :
-- WHERE commandes.statut = 'en attente'
ORDER BY commandes.date_commande DESC;


-- ------------------------------------------------------------------------------
-- REQUÊTE N°2 : Récupération de la liste des employés
-- Fonction d'origine : getEmployes()
-- Description : L'administrateur a besoin de voir la liste de son staff. 
-- Cette requête utilise l'opérateur "IN" pour filtrer la table des utilisateurs 
-- et ne renvoyer que ceux qui ont le rôle Administrateur (role_id = 1) ou 
-- Employé (role_id = 2), en excluant les clients classiques.
-- ------------------------------------------------------------------------------
SELECT * 
FROM utilisateurs 
WHERE role_id IN (1, 2);



-- ==============================================================================
-- 2. CONTRÔLEUR : AvisController.php
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- REQUÊTE N°3 : Récupération des avis validés pour la page d'accueil
-- Fonction d'origine : getValidated()
-- Description : Cette requête est cruciale pour l'image de marque de l'entreprise. 
-- Elle va chercher dans la table `avis` uniquement ceux qui ont été validés 
-- par l'équipe (statut = 'validé'). Elle utilise une jointure avec la table 
-- `utilisateurs` pour afficher le prénom et le nom du client qui a laissé l'avis.
-- ------------------------------------------------------------------------------
SELECT 
    avis.*, 
    utilisateurs.nom, 
    utilisateurs.prenom
FROM avis
INNER JOIN utilisateurs ON avis.utilisateur_id = utilisateurs.utilisateur_id
WHERE avis.statut = 'validé';


-- ------------------------------------------------------------------------------
-- REQUÊTE N°4 : Récupération des avis en attente de modération (Vue Admin)
-- Fonction d'origine : getPending()
-- Description : Semblable à la requête précédente, mais destinée à l'interface 
-- d'administration. Elle filtre les avis ayant le statut 'en attente' et 
-- les trie par date de création décroissante (du plus récent au plus ancien) 
-- pour faciliter le travail de modération.
-- ------------------------------------------------------------------------------
SELECT 
    avis.*, 
    utilisateurs.nom, 
    utilisateurs.prenom
FROM avis
INNER JOIN utilisateurs ON avis.utilisateur_id = utilisateurs.utilisateur_id
WHERE avis.statut = 'en attente'
ORDER BY avis.created_at DESC;



-- ==============================================================================
-- 3. CONTRÔLEUR : CommandeController.php
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- REQUÊTE N°5 : Historique des commandes d'un client spécifique
-- Fonction d'origine : mesCommandes()
-- Description : C'est la requête exécutée lorsqu'un client consulte son 
-- espace personnel ("Mes Commandes"). Elle filtre la table `commandes` 
-- en utilisant l'ID de l'utilisateur actuellement connecté (fourni par le 
-- jeton de sécurité). Elle fait également une jointure pour récupérer le 
-- nom lisible du menu commandé.
-- ------------------------------------------------------------------------------
SELECT 
    commandes.*, 
    menus.nom_menu
FROM commandes
INNER JOIN menus ON commandes.menu_id = menus.id
WHERE commandes.utilisateur_id = 1 
ORDER BY commandes.date_commande DESC;


-- ------------------------------------------------------------------------------
-- REQUÊTE N°6 : Création (Insertion) d'une nouvelle commande client
-- Fonction d'origine : store()
-- Description : Lorsqu'un client valide son panier, l'application doit 
-- enregistrer les données. Contrairement aux SELECT précédents, il s'agit 
-- ici d'une requête d'insertion (INSERT INTO). Les données calculées par le 
-- back-end (comme le prix final après d'éventuelles réductions ou frais de port) 
-- sont injectées dans les colonnes correspondantes.
-- ------------------------------------------------------------------------------
INSERT INTO commandes (
    utilisateur_id,
    menu_id,
    date_commande,
    date_prestation,
    heure_livraison,
    lieu_livraison,
    prix_menu,
    nombre_personne,
    prix_livraison,
    statut,
    pret_materiel,
    restitution_materiel
) VALUES (
    1,
    2,
    CURDATE(),
    '2024-12-25',
    '19:00',
    '10 rue de la Paix, Paris',
    150.00,
    4,
    0.00,
    'en attente',
    1,
    0
);

-- ==============================================================================
-- FIN DU FICHIER
-- ==============================================================================