-- -----------------------------------------------------
-- Insertion des Rôles
-- -----------------------------------------------------
INSERT INTO Role (libelle) VALUES 
('Administrateur'),
('Employe'),
('Utilisateur');

-- -----------------------------------------------------
-- Insertion des Themes
-- -----------------------------------------------------
INSERT INTO Theme (libelle) VALUES 
('Noel'),
('Paques'),
('Classique');

-- -----------------------------------------------------
-- Insertion des Regimes
-- -----------------------------------------------------
INSERT INTO Regime (libelle) VALUES 
('Vegetarien'),
('Vegan'),
('Sans Gluten');

-- -----------------------------------------------------
-- Insertion des Allergenes
-- -----------------------------------------------------
INSERT INTO Allergene (libelle) VALUES 
('Gluten'),
('Noix'),
('Lait'),
('Soja');

-- -----------------------------------------------------
-- Insertion des Horaires
-- -----------------------------------------------------
INSERT INTO Horaire (jour, heure_ouverture, heure_fermeture) VALUES
('Lundi', '09:00', '18:00'),
('Mardi', '09:00', '18:00'),
('Mercredi', '09:00', '18:00'),
('Jeudi', '09:00', '18:00'),
('Vendredi', '09:00', '18:00'),
('Samedi', '10:00', '16:00'),
('Dimanche', 'Fermé', 'Fermé');

-- -----------------------------------------------------
-- Insertion des Plats
-- -----------------------------------------------------
INSERT INTO Plat (libelle, description, photo_url) VALUES
('Soupe de saison', 'Une délicieuse soupe de légumes frais', 'url_de_la_photo'),
('Boeuf Bourguignon', 'Plat traditionnel mijoté au vin rouge', 'url_de_la_photo'),
('Tarte Tatin', 'Une tarte aux pommes renversée', 'url_de_la_photo');

-- -----------------------------------------------------
-- Insertion des Utilisateurs
-- -----------------------------------------------------
INSERT INTO Utilisateur (nom, prenom, email, password, telephone, adresse_postale, ville, pays, est_actif, role_id) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'admin1234', '0123456789', '1 rue de Paris', 'Paris', 'France', TRUE, 1),
('Martin', 'Sophie', 'sophie.martin@example.com', 'employe1234', '0123456789', '2 avenue de Lyon', 'Lyon', 'France', TRUE, 2),
('Durand', 'Pierre', 'pierre.durand@example.com', 'client1234', '0123456789', '3 boulevard de Marseille', 'Marseille', 'France', TRUE, 3);

-- -----------------------------------------------------
-- Insertion des Menus
-- -----------------------------------------------------
INSERT INTO Menu (nom_menu, description, prix_par_personne, nombre_personne_minimum, quantite_restante, conditions, regime_id, theme_id) VALUES
('Menu de Noel', 'Menu festif pour célébrer la magie de Noël', 50.00, 4, 20, 'Réservation 1 mois en avance obligatoire', 3, 1),
('Menu Classique Végétarien', 'Un délicieux repas végétarien de saison', 35.00, 2, 50, 'Disponible seulement sur demande', 1, 3);

-- -----------------------------------------------------
-- Insertion des jointures (Propose)
-- Lie les Plats aux Menus
-- -----------------------------------------------------
INSERT INTO Propose (menu_id, plat_id) VALUES
(1, 1), -- Menu 'Noel' (ID 1) contient 'Soupe' (ID 1)
(1, 2), -- Menu 'Noel' (ID 1) contient 'Boeuf' (ID 2)
(2, 1), -- Menu 'Végétarien' (ID 2) contient 'Soupe' (ID 1)
(2, 3); -- Menu 'Végétarien' (ID 2) contient 'Tarte Tatin' (ID 3)

-- -----------------------------------------------------
-- Insertion des jointures (Contient)
-- Lie les Allergenes aux Plats
-- -----------------------------------------------------
INSERT INTO Contient (plat_id, allergene_id) VALUES
(2, 1), -- 'Boeuf Bourguignon' (ID 2) contient 'Gluten' (ID 1)
(3, 1), -- 'Tarte Tatin' (ID 3) contient 'Gluten' (ID 1)
(3, 3); -- 'Tarte Tatin' (ID 3) contient 'Lait' (ID 3)
