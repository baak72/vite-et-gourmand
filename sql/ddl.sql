-- -----------------------------------------------------
-- Table `Role`
-- Stocke les rôles : Administrateur, Employé, Utilisateur
-- -----------------------------------------------------
CREATE TABLE Role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table `Theme`
-- Stocke les thèmes des menus (ex: Noel, Pâques, Classique)
-- -----------------------------------------------------
CREATE TABLE Theme (
    theme_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table `Regime`
-- Stocke les régimes alimentaires (ex: Végétarien, Vegan, Sans Gluten)
-- -----------------------------------------------------
CREATE TABLE Regime (
    regime_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table `Allergene`
-- Stocke les allergènes possibles (ex: Gluten, Noix, Lait et Soja)
-- -----------------------------------------------------
CREATE TABLE Allergene (
    allergene_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table `Horaire`
-- Stocke les heures d'ouverture (ex: Lundi, 09:00, 18:00)
-- -----------------------------------------------------
CREATE TABLE Horaire (
    horaire_id INT AUTO_INCREMENT PRIMARY KEY,
    jour VARCHAR(20) NOT NULL UNIQUE,
    heure_ouverture VARCHAR(50) NOT NULL,
    heure_fermeture VARCHAR(50) NOT NULL
);

-- -----------------------------------------------------
-- Table `Plat`
-- Stocke les plats individuels (ex: Soupe, Boeuf Bourguignon)
-- -----------------------------------------------------
CREATE TABLE Plat (
    plat_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    photo_url VARCHAR(255)
);

-- -----------------------------------------------------
-- Table `Utilisateur`
-- Stocke les infos de connexion et personnelles
-- -----------------------------------------------------
CREATE TABLE Utilisateur (
utilisateur_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Mot de passe haché ici
    telephone VARCHAR(20) NOT NULL,
    adresse_postale VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    pays VARCHAR(100) NOT NULL,
    est_actif BOOLEAN NOT NULL DEFAULT TRUE,
    -- Déclaration de la clé étrangère
    role_id INT NOT NULL,
    -- Déclaration de la contrainte de clé étrangère
    CONSTRAINT fk_utilisateur_role
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

-- -----------------------------------------------------
-- Table `Avis`
-- Stocke les avis des clients sur les commandes
-- -----------------------------------------------------
CREATE TABLE Avis (
    avis_id INT AUTO_INCREMENT PRIMARY KEY,
    note INT NOT NULL,
    description VARCHAR(500),
    statut VARCHAR(50) NOT NULL DEFAULT 'en attente', -- ex: en attente, valide, refuse
    
    -- Déclaration des clés étrangères
    utilisateur_id INT NOT NULL,
    numero_commande INT NOT NULL,
    -- Déclaration de la contrainte de clé étrangère utilisateur_id
    CONSTRAINT fk_avis_utilisateur
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(utilisateur_id),
    -- Déclaration de la contrainte de clé étrangère numero_commande
    CONSTRAINT fk_avis_commande
    FOREIGN KEY (numero_commande) REFERENCES Commande(numero_commande)
);

-- -----------------------------------------------------
-- Table `Menu`
-- Stocke les menus complets proposés par l'entreprise
-- -----------------------------------------------------
CREATE TABLE Menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    nom_menu VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    prix_par_personne DECIMAL(10, 2) NOT NULL,
    nombre_personne_minimum INT NOT NULL,
    quantite_restante INT DEFAULT 0,
    conditions VARCHAR(255) DEFAULT NULL,

    -- Déclaration des clés étrangères
    regime_id INT NOT NULL,
    theme_id INT NOT NULL,
    -- Déclaration de la contrainte de clé étrangère regime_id
    CONSTRAINT fk_menu_regime
    FOREIGN KEY (regime_id) REFERENCES Regime(regime_id),
    -- Déclaration de la contrainte de clé étrangère theme_id
    CONSTRAINT fk_menu_theme
    FOREIGN KEY (theme_id) REFERENCES Theme(theme_id)
);

-- -----------------------------------------------------
-- Table `Commande`
-- Stocke les commandes passées par les utilisateurs
-- -----------------------------------------------------
CREATE TABLE Commande (
    numero_commande INT AUTO_INCREMENT PRIMARY KEY,
    date_commande DATE NOT NULL,
    date_prestation DATE NOT NULL,
    heure_livraison VARCHAR(50) NOT NULL,
    lieu_livraison VARCHAR(255) NOT NULL,
    prix_menu DECIMAL(10, 2) NOT NULL,
    nombre_personne INT NOT NULL,
    prix_livraison DECIMAL(10, 2) DEFAULT 0.00,
    statut VARCHAR(50) NOT NULL DEFAULT 'en attente',
    pret_materiel BOOLEAN DEFAULT FALSE,
    restitution_materiel BOOLEAN DEFAULT FALSE,

    -- Déclaration des clés étrangères
    utilisateur_id INT NOT NULL,
    menu_id INT NOT NULL,
    -- Déclaration de la contrainte de clé étrangère utilisateur_id
    CONSTRAINT fk_commande_utilisateur
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(utilisateur_id),
    -- Déclaration de la contrainte de clé étrangère menu_id
    CONSTRAINT fk_commande_menu
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

-- -----------------------------------------------------
-- Table `Historique_Statut_Commande`
-- Stocke l'historique des statuts (en texte)
-- -----------------------------------------------------
CREATE TABLE Historique_Statut_Commande (
    historique_id INT AUTO_INCREMENT PRIMARY KEY,
    statut VARCHAR(50) NOT NULL, -- (ex: "en préparation")
    date_modification DATETIME NOT NULL,
    motif_modification VARCHAR(500), 
    mode_contact_employe VARCHAR(100),
    
    -- Déclaration de la clé étrangère
    numero_commande_id INT NOT NULL,
    -- Déclaration de la contrainte de clé étrangère numero_commande_id
    CONSTRAINT fk_hist_commande
    FOREIGN KEY (numero_commande_id) REFERENCES Commande(numero_commande)
);

-- -----------------------------------------------------
-- Table `Propose` (ou `Compose` sur le MLD)
-- Table de jointure: quels plats composent quel menu
-- -----------------------------------------------------
CREATE TABLE Propose (
    -- Déclaration des clés étrangères
    menu_id INT NOT NULL,
    plat_id INT NOT NULL,
    
    -- Déclaration de la contrainte de clé étrangère menu_id
    CONSTRAINT fk_propose_menu
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id),
    -- Déclaration de la contrainte de clé étrangère plat_id
    CONSTRAINT fk_propose_plat
    FOREIGN KEY (plat_id) REFERENCES Plat(plat_id),
    
    -- Déclaration de la clé primaire composite
    PRIMARY KEY (menu_id, plat_id)
);

-- -----------------------------------------------------
-- Table `Contient`
-- Table de jointure: quels allergènes contient quel plat
-- -----------------------------------------------------
CREATE TABLE Contient (
    -- Déclaration des clés étrangères
    plat_id INT NOT NULL,
    allergene_id INT NOT NULL,
    
    -- Déclaration de la contrainte de clé étrangère plat_id
    CONSTRAINT fk_contient_plat
    FOREIGN KEY (plat_id) REFERENCES Plat(plat_id),
    -- Déclaration de la contrainte de clé étrangère allergene_id
    CONSTRAINT fk_contient_allergene
    FOREIGN KEY (allergene_id) REFERENCES Allergene(allergene_id),
    
    -- Déclaration de la clé primaire composite
    PRIMARY KEY (plat_id, allergene_id)
);