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
import { doc, setDoc } from "firebase/firestore"; 

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