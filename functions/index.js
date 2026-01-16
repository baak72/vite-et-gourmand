const nodemailer = require("nodemailer");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "contact.viteetgourmand@gmail.com",
    pass: "gitjacluzqmslxtz"
  }
});

// 2. Initialiser l'Admin SDK
initializeApp();

// ------------------------------------------------------------------
// FONCTION 1 : CRÉER UN COMPTE EMPLOYÉ (ADMIN SEULEMENT)
// ------------------------------------------------------------------
exports.createEmployeeAccount = onCall(async (request) => {
  const auth = request.auth;

  // 1. Vérifier que l'utilisateur est connecté
  if (!auth) {
    throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  }

  // 2. VÉRIFICATION DU RÔLE VIA FIRESTORE
  const db = getFirestore();
  const adminDoc = await db.collection("Utilisateur").doc(auth.uid).get();

  if (!adminDoc.exists || adminDoc.data().role_id !== 1) {
    throw new HttpsError(
      "permission-denied",
      "Accès refusé. Vous n'êtes pas administrateur."
    );
  }

  // 3. RÉCUPÉRATION DES DONNÉES
  const { email, password, nom, prenom } = request.data;

  // Validation supplémentaire
  if (!nom || !prenom) {
    throw new HttpsError("invalid-argument", "Le nom et le prénom sont requis.");
  }

  try {
    // Étape A : Créer l'utilisateur dans Firebase Authentication
    const userRecord = await getAuth().createUser({
      email: email,
      password: password,
      displayName: `${prenom} ${nom}`,
    });

    // Étape B : Marquer cet utilisateur comme "employe"
    await getAuth().setCustomUserClaims(userRecord.uid, { role: "employe" });

    // Étape C : Créer son document dans Firestore AVEC LES VRAIES INFOS
    const userDocRef = db.collection("Utilisateur").doc(userRecord.uid);
    await userDocRef.set({
      uid: userRecord.uid,
      email: email,
      role_id: 2, // 2 = Employé
      est_actif: true,
      nom: nom,
      prenom: prenom,
    });

    return {
      status: "success",
      message: `Compte employé créé pour ${prenom} ${nom}`,
    };
  } catch (error) {
    console.error("Erreur Cloud Function:", error);
    throw new HttpsError("internal", error.message);
  }
});

// ------------------------------------------------------------------
// DÉSACTIVER UN COMPTE EMPLOYÉ (ADMIN SEULEMENT)
// ------------------------------------------------------------------
exports.disableEmployeeAccount = onCall(async (request) => {
  const auth = request.auth;
  if (!auth) {
    throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  }

  // VÉRIFICATION DU RÔLE VIA FIRESTORE
  const db = getFirestore();
  const adminDoc = await db.collection("Utilisateur").doc(auth.uid).get();

  if (!adminDoc.exists || adminDoc.data().role_id !== 1) {
    throw new HttpsError(
      "permission-denied",
      "Accès refusé. Vous n'êtes pas administrateur."
    );
  }

  const { uid } = request.data;
  if (!uid) {
    throw new HttpsError("invalid-argument", "L'UID est manquant.");
  }

  try {
    // Étape A : Désactiver le compte dans Auth
    await getAuth().updateUser(uid, {
      disabled: true,
    });

    // Étape B : Mettre à jour notre base de données Firestore
    const userDocRef = db.collection("Utilisateur").doc(uid);
    await userDocRef.update({
      est_actif: false,
    });

    return {
      status: "success",
      message: `Compte employé ${uid} désactivé avec succès.`,
    };
  } catch (error) {
    console.error("Erreur Cloud Function (disable):", error);
    throw new HttpsError("internal", error.message);
  }
});

// ------------------------------------------------------------------
// RÉACTIVER UN COMPTE EMPLOYÉ (ADMIN SEULEMENT)
// ------------------------------------------------------------------
exports.reactivateEmployeeAccount = onCall(async (request) => {
  const auth = request.auth;
  if (!auth) throw new HttpsError("unauthenticated", "Non connecté.");

  const db = getFirestore();
  const adminDoc = await db.collection("Utilisateur").doc(auth.uid).get();
  if (!adminDoc.exists || adminDoc.data().role_id !== 1) {
    throw new HttpsError("permission-denied", "Réservé aux admins.");
  }

  const { uid } = request.data;

  try {
    // 1. Réactiver dans Auth
    await getAuth().updateUser(uid, { disabled: false });
    // 2. Mettre à jour Firestore
    await db.collection("Utilisateur").doc(uid).update({ est_actif: true });

    return { status: "success", message: "Compte réactivé." };
  } catch (error) {
    throw new HttpsError("internal", error.message);
  }
});

// ------------------------------------------------------------------
// SUPPRIMER DÉFINITIVEMENT UN COMPTE EMPLOYÉ (ADMIN SEULEMENT)
// ------------------------------------------------------------------
exports.deleteEmployeeAccount = onCall(async (request) => {
  const auth = request.auth;
  if (!auth) throw new HttpsError("unauthenticated", "Non connecté.");

  const db = getFirestore();
  const adminDoc = await db.collection("Utilisateur").doc(auth.uid).get();
  if (!adminDoc.exists || adminDoc.data().role_id !== 1) {
    throw new HttpsError("permission-denied", "Réservé aux admins.");
  }

  const { uid } = request.data;

  try {
    // 1. Supprimer de Auth
    await getAuth().deleteUser(uid);
    // 2. Supprimer de Firestore
    await db.collection("Utilisateur").doc(uid).delete();

    return { status: "success", message: "Compte supprimé définitivement." };
  } catch (error) {
    throw new HttpsError("internal", error.message);
  }
});

// ------------------------------------------------------------------
// TRAITER LE FORMULAIRE DE CONTACT
// ------------------------------------------------------------------
exports.processContactForm = onCall(async (request) => {
  const { titre, email, description } = request.data;
  if (!titre || !email || !description) {
    throw new HttpsError("invalid-argument", "Champs requis manquants.");
  }

  const mailOptions = {
    from: "contact.viteetgourmand@gmail.com",
    to: "contact.viteetgourmand@gmail.com",
    subject: `[Vite & Gourmand] Nouvelle demande : ${titre}`,
    html: `
      <p>Vous avez reçu une nouvelle demande de contact via le site web.</p>
      <p><strong>De la part de :</strong> ${email}</p>
      <p><strong>Objet :</strong> ${titre}</p>
      <hr>
      <p><strong>Message :</strong></p>
      <p>${description}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: "success", message: "Message envoyé." };
  } catch (error) {
    console.error("Erreur Nodemailer lors de l'envoi :", error);
    throw new HttpsError("internal", "Échec de l'envoi du message.");
  }
});

// ------------------------------------------------------------------
// VÉRIFIER LES MISES À JOUR DE STATUT DES COMMANDES
// ------------------------------------------------------------------
exports.checkOrderStatusUpdate = require("firebase-functions/v1/firestore")
  .document("Commande/{commandeId}")
  .onUpdate(async (change, context) => {

    const newStatus = change.after.data().statut;
    const previousStatus = change.before.data().statut;
    const orderData = change.after.data();
    const fullOrderId = context.params.commandeId;

    const orderIdShort = fullOrderId.slice(-8).toUpperCase();
    if (newStatus === previousStatus) {
      return null;
    }

    const clientEmail = orderData.email;
    const emailsToSend = [];

    // --- 1. Statut: VALIDÉ ---
    if (newStatus === "validé") {
      emailsToSend.push({
        subject: `Confirmation de Commande #${orderIdShort}`,
        html: `
            <p>Bonjour,</p>
            <p>Nous avons bien reçu et validé votre commande #${orderIdShort} (${orderData.nom_menu}).</p>
            <p>Elle est maintenant transmise à l'équipe de production.</p>
        `
      });
    }

    // --- 2. Statut: EN COURS DE LIVRAISON ---
    else if (newStatus === "en cours de livraison") {
      emailsToSend.push({
        subject: `Votre commande est en route ! Commande #${orderIdShort}`,
        html: `
            <p>Bonjour,</p>
            <p>Votre commande #${orderIdShort} (${orderData.nom_menu}) est actuellement en cours de livraison.</p>
            <p>Notre équipe logistique arrive chez vous à l'heure convenue (${orderData.heure_livraison}).</p>
        `
      });
    }

    // --- 3. Statut: LIVRÉ ---
    else if (newStatus === "livré") {
      emailsToSend.push({
        subject: `Commande #${orderIdShort} livrée`,
        html: `
            <p>Bonjour,</p>
            <p>Votre commande #${orderIdShort} a été livrée avec succès.</p>
            <p>Merci de votre confiance, cela nous fait vraiment plaisir de vous accompagner aujourd’hui. Nous vous souhaitons un excellent repas et un très bon appétit ! 🍽️😊</p>
        `
      });
    }

    // --- 4. Statut: MATÉRIEL EN ATTENTE ---
    else if (newStatus === "en attente du retour de matériel") {
      // Email A
      emailsToSend.push({
        subject: `Votre commande #${orderIdShort} a bien été livrée`,
        html: `
            <p>Bonjour,</p>
            <p>Votre commande #${orderIdShort} a été livrée avec succès.</p>
            <p>Merci de votre confiance, cela nous fait vraiment plaisir de vous accompagner aujourd’hui. Nous vous souhaitons un excellent repas et un très bon appétit ! 🍽️😊</p>
        `
      });

      // Email B
      emailsToSend.push({
        subject: `⚠️ URGENT : Rappel de restitution de matériel - Commande #${orderIdShort}`,
        html: `
            <p>Bonjour,</p>
            <p>Votre commande #${orderIdShort} a bien été livrée.</p>
            <p>Veuillez noter que le matériel doit être restitué dans les 10 jours ouvrés.</p>
            <p style="color: #CC0000; font-weight: bold;">Passé ce délai, une pénalité forfaitaire de 600€ sera appliquée (voir CGV).</p>
            <p>Merci de nous contacter rapidement pour convenir du retour.</p>
        `
      });
    }

    // --- 5. Statut: TERMINÉE ---
    else if (newStatus === "terminée" && previousStatus !== "terminée") {

      // CAS SPÉCIAL : Saut direct de "en cours" à "terminée"
      if (previousStatus === "en cours de livraison") {
        emailsToSend.push({
          subject: `Votre commande #${orderIdShort} a bien été livrée`,
          html: `
              <p>Bonjour,</p>
              <p>Votre commande #${orderIdShort} a été livrée avec succès.</p>
              <p>Merci de votre confiance, cela nous fait vraiment plaisir de vous accompagner aujourd’hui. Nous vous souhaitons un excellent repas et un très bon appétit ! 🍽️😊</p>
          `
        });
      }

      // Invitation à l'avis
      emailsToSend.push({
        subject: `⭐ Votre avis compte ! Commande #${orderIdShort} finalisée`,
        html: `
            <p>Bonjour,</p>
            <p>Votre commande #${orderIdShort} est maintenant clôturée.</p>
            <p>Votre avis nous est précieux. Connectez-vous à votre espace personnel pour laisser une note et un commentaire !</p>
            <p>Lien vers votre profil : [Ajouter ici l'URL de la page Profil]</p>
        `
      });
    }

    // --- ENVOI FINAL ---
    if (clientEmail && emailsToSend.length > 0) {
      const sendPromises = emailsToSend.map(emailData => {
        return transporter.sendMail({
          from: "contact.viteetgourmand@gmail.com",
          to: clientEmail,
          subject: emailData.subject,
          html: emailData.html,
        });
      });

      await Promise.all(sendPromises);
      console.log(`${emailsToSend.length} email(s) envoyé(s) à ${clientEmail}`);
    }

    return null;
  });

// ------------------------------------------------------------------
// ENVOYER UN EMAIL DE BIENVENUE (DÈS LA CRÉATION DU COMPTE)
// ------------------------------------------------------------------
exports.sendWelcomeEmail = require("firebase-functions/v1").auth.user().onCreate(async (user) => {
  const email = user.email;
  const displayName = user.displayName || "Cher client";

  const mailOptions = {
    from: "contact.viteetgourmand@gmail.com",
    to: email,
    subject: "Bienvenue chez Vite & Gourmand ! 🥗",
    html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Bienvenue parmi nous, ${displayName} !</h2>
            <p>Nous sommes ravis de vous compter parmi nos nouveaux clients.</p>
            <p>Chez <strong>Vite & Gourmand</strong>, notre mission est de vous régaler avec des repas frais, 
            préparés avec soin et livrés avec le sourire.</p>
            <p>Dès maintenant, vous pouvez :</p>
            <ul>
                <li>Consulter nos menus de saison.</li>
                <li>Passer votre première commande en quelques clics.</li>
                <li>Nous contacter pour une demande spéciale.</li>
            </ul>
            <p>Pour commencer, rendez-vous sur votre espace personnel : 
               <a href="https://votre-site-web.com/login" style="color: #27ae60; font-weight: bold;">Me connecter</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee;">
            <p style="font-size: 0.9em; color: #777;">
                À très vite pour votre première dégustation !<br>
                L'équipe Vite & Gourmand
            </p>
        </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de bienvenue envoyé avec succès à : ${email}`);
    return null;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue :", error);
    return null;
  }
});