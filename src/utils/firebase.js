// 1. Importation de tout
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 2. L'objet de configuration personnel 
const firebaseConfig = {
  apiKey: "AIzaSyDftTtvyK1w9BcJS5kDvPIkfDj-gLpLkpI", // Clé API
  authDomain: "vite-et-gourmand.firebaseapp.com",
  projectId: "vite-et-gourmand",
  storageBucket: "vite-et-gourmand.firebasestorage.app",
  messagingSenderId: "708204392603",
  appId: "1:708204392603:web:5e2ec2ac9553dc591f563e",
  measurementId: "G-L4PDLYSH9J" // Clé Analytics
};

// 3. Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// 4. Activation des services Firebase
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app); // C'est pour Google Analytics
export const auth = getAuth(app); // On l'exporte pour gérer les connexions
export const db = getFirestore(app); // On l'exporte pour notre base NoSQL

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, collection, getDocs, getDoc, query, addDoc, serverTimestamp, updateDoc } from "firebase/firestore"; 

// --- FONCTIONS BACK-END ---
/**
 * Crée un nouvel utilisateur (Auth) et sauvegarde ses données (Firestore).
 * @param {string} email - L'email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @param {object} additionalData - Données supplémentaires (nom, prenom, etc.)
 * @returns {object} L'objet utilisateur créé.
 */
export const registerUser = async (email, password, additionalData) => {
  try {
    // Créer l'utilisateur dans Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Créer un document dans Firestore
    const userDocRef = doc(db, "Utilisateur", user.uid);

    // Définir les données à sauvegarder
    const userData = {
      uid: user.uid,
      email: email,
      role_id: 3, // Par défaut, 'Utilisateur' 
      est_actif: true, // Par défaut, le compte est actif
      ...additionalData, // Ajoute le nom, prenom, tel, etc.
    };

    // Écrire le document dans la base de données
    await setDoc(userDocRef, userData);

    console.log("Utilisateur créé avec succès :", user.uid);
    return user;

  } catch (error) {
    // Gérer les erreurs (ex: mot de passe trop faible, email déjà pris)
    console.error("Erreur lors de la création de l'utilisateur :", error.message);
    throw error; // Renvoie l'erreur pour que le Front-End puisse l'afficher
  }
};

/**
 * Connecte un utilisateur existant.
 * @param {string} email - L'email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {object} L'objet utilisateur connecté.
 */
export const signInUser = async (email, password) => {
  try {
    // Étape 1 : Connecter l'utilisateur avec Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    console.log("Utilisateur connecté avec succès :", userCredential.user.uid);
    return userCredential.user;

  } catch (error) {
    // Gérer les erreurs (ex: mot de passe incorrect, utilisateur inconnu)
    console.error("Erreur lors de la connexion :", error.message);
    throw error; // Renvoie l'erreur pour que le Front-End puisse l'afficher
  }
};

/**
 * Déconnecte l'utilisateur actuellement connecté.
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Utilisateur déconnecté avec succès.");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error.message);
    throw error;
  }
};

/**
 * Envoie un e-mail de réinitialisation de mot de passe.
 * @param {string} email - L'email du compte.
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("E-mail de réinitialisation envoyé à :", email);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation :", error.message);
    throw error;
  }
};

/**
 * Récupère tous les menus depuis la collection Firestore.
 * @returns {Array} Un tableau d'objets, où chaque objet est un menu.
 */
export const getMenus = async () => {
  try {
    // 1. Crée une référence à notre collection "Menu"
    const menuCollectionRef = collection(db, "Menu");

    // 2. Crée une requête pour récupérer tous les documents
    const q = query(menuCollectionRef);

    // 3. Exécute la requête et récupère les "instantanés" (snapshots)
    const querySnapshot = await getDocs(q);

    // 4. Transforme les résultats en un tableau simple
    const menus = [];
    querySnapshot.forEach((doc) => {
      menus.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log("Menus récupérés :", menus.length);
    return menus;

  } catch (error) {
    console.error("Erreur lors de la récupération des menus :", error.message);
    throw error;
  }
};

/**
 * Récupère un menu spécifique par son ID.
 * @param {string} menuId - L'ID unique du document menu.
 * @returns {object|null} L'objet menu s'il est trouvé, sinon null.
 */
export const getMenuById = async (menuId) => {
  try {
    // 1. Crée une référence directe au document
    const docRef = doc(db, "Menu", menuId);

    // 2. Exécute la requête pour UN seul document
    const docSnap = await getDoc(docRef);

    // 3. Vérifie si le document existe
    if (docSnap.exists()) {
      // 4. Renvoie les données
      const menuData = {
        id: docSnap.id,
        ...docSnap.data()
      };
      console.log("Menu trouvé :", menuData.nom_menu);
      return menuData;
    } else {
      // Le document n'existe pas
      console.warn("Aucun menu trouvé avec l'ID :", menuId);
      return null;
    }

  } catch (error)
 {
    console.error("Erreur lors de la récupération du menu :", error.message);
    throw error;
  }
};

/**
 * Crée un nouveau document de commande dans Firestore.
 * @param {object} orderData - L'objet contenant les infos de la commande.
 * @returns {object} La référence au document de commande créé.
 */
export const createOrder = async (orderData) => {
  try {
    // 1. Crée une référence à la collection "Commande"
    const orderCollectionRef = collection(db, "Commande");

    // 2. Prépare les données à sauvegarder
    const dataToSave = {
      ...orderData, // Les données du front-end (menu_id, user_id, prix, etc.)
      date_commande: serverTimestamp(), // Firebase ajoute la date/heure du serveur
      statut: "en attente" // Statut initial.
    };

    // 3. Ajoute le nouveau document à la collection
    const docRef = await addDoc(orderCollectionRef, dataToSave);

    console.log("Commande créée avec succès avec l'ID :", docRef.id);
    return docRef;

  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error.message);
    throw error;
  }
};

/**
 * Met à jour le statut d'une commande (pour l'espace Employé).
 * @param {string} orderId - L'ID unique du document commande.
 * @param {string} newStatus - Le nouveau statut (ex: "en préparation").
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    // 1. Crée une référence directe au document commande
    const orderDocRef = doc(db, "Commande", orderId);

    // 2. Met à jour uniquement les champs spécifiés
    await updateDoc(orderDocRef, {
      statut: newStatus
    });

    console.log("Statut de la commande mis à jour :", orderId);

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error.message);
    throw error;
  }
};