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

// Initialiser l'Admin SDK
initializeApp();

// ==================================================================
// FONCTION UTILITAIRE POUR LE DESIGN DES EMAILS
// ==================================================================
const getEmailTemplate = (title, bodyContent) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #18181b; padding: 30px 20px; text-align: center; }
        .logo { color: #f59e0b; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; font-size: 16px; }
        .btn { display: inline-block; background-color: #f59e0b; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
        .footer { background-color: #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7; }
        .footer a { color: #71717a; text-decoration: none; margin: 0 5px; }
        .footer a:hover { color: #f59e0b; }
        h2 { color: #18181b; margin-top: 0; }
        .status-badge { background-color: #fffbeb; color: #d97706; padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 0.9em; border: 1px solid #fcd34d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="https://vite-et-gourmand.web.app/" class="logo">Vite & Gourmand</a>
        </div>
        
        <div class="content">
          <h2>${title}</h2>
          ${bodyContent}
        </div>

        <div class="footer">
          <p>
            <a href="https://vite-et-gourmand.web.app/menus">Nos Menus</a> • 
            <a href="https://vite-et-gourmand.web.app/contact">Contact</a> • 
            <a href="https://vite-et-gourmand.web.app/login">Mon Compte</a>
          </p>
          <p>
            <a href="https://vite-et-gourmand.web.app/cgv">CGV</a> • 
            <a href="https://vite-et-gourmand.web.app/mentions-legales">Mentions Légales</a>
          </p>
          <p>© ${new Date().getFullYear()} Vite & Gourmand. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


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

  const emailBody = `
    <p>Vous avez reçu une nouvelle demande de contact via le site web.</p>
    <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
      <p><strong>De la part de :</strong> <a href="mailto:${email}" style="color: #f59e0b;">${email}</a></p>
      <p><strong>Objet :</strong> ${titre}</p>
      <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
      <p><strong>Message :</strong></p>
      <p style="white-space: pre-wrap;">${description}</p>
    </div>
  `;

  const mailOptions = {
    from: "contact.viteetgourmand@gmail.com",
    to: "contact.viteetgourmand@gmail.com",
    subject: `[Vite & Gourmand] Contact : ${titre}`,
    html: getEmailTemplate("Nouvelle Demande de Contact", emailBody),
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
      const body = `
        <p>Bonjour ${orderData.prenom || ""},</p>
        <p>Bonne nouvelle ! Nous avons bien reçu et <strong>validé</strong> votre commande.</p>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;"><strong>Commande #${orderIdShort}</strong></p>
          <p style="margin: 5px 0 0 0; color: #166534;">Menu : ${orderData.nom_menu}</p>
        </div>
        <p>Elle est maintenant transmise à notre équipe de production qui va la préparer avec soin.</p>
        <a href="https://vite-et-gourmand.web.app/login" class="btn">Suivre ma commande</a>
      `;
      emailsToSend.push({
        subject: `Commande #${orderIdShort} Validée ✅`,
        html: getEmailTemplate("Commande Validée", body)
      });
    }

    // --- 2. Statut: EN COURS DE LIVRAISON ---
    else if (newStatus === "en cours de livraison") {
      const body = `
        <p>Bonjour ${orderData.prenom || ""},</p>
        <p>Votre commande est en route ! 🚚</p>
        <p>Notre équipe logistique est partie et se dirige vers vous pour la livraison prévue à <strong>${orderData.heure_livraison}</strong>.</p>
        <p>Merci de vous tenir prêt(e) pour la réception.</p>
      `;
      emailsToSend.push({
        subject: `En route ! Commande #${orderIdShort}`,
        html: getEmailTemplate("Livraison en cours", body)
      });
    }

    // --- 3. Statut: LIVRÉ ---
    else if (newStatus === "livré") {
      const body = `
        <p>Bonjour ${orderData.prenom || ""},</p>
        <p>Votre commande <strong>#${orderIdShort}</strong> a été livrée avec succès.</p>
        <p>Merci de votre confiance. Cela nous fait vraiment plaisir de vous accompagner aujourd’hui.</p>
        <p style="font-size: 1.1em; font-weight: bold; color: #f59e0b;">Nous vous souhaitons un excellent appétit ! 🍽️</p>
      `;
      emailsToSend.push({
        subject: `Commande #${orderIdShort} Livrée 🍽️`,
        html: getEmailTemplate("Bon Appétit !", body)
      });
    }

    // --- 4. Statut: MATÉRIEL EN ATTENTE ---
    else if (newStatus === "en attente du retour de matériel") {
      // Email A (Bon appétit)
      const bodyA = `
        <p>Bonjour ${orderData.prenom || ""},</p>
        <p>Votre commande <strong>#${orderIdShort}</strong> a été livrée avec succès.</p>
        <p>Merci de votre confiance. Nous vous souhaitons un excellent repas et un très bon appétit ! 🍽️😊</p>
      `;
      emailsToSend.push({
        subject: `Commande #${orderIdShort} Livrée 🍽️`,
        html: getEmailTemplate("Bon Appétit !", bodyA)
      });

      // Email B (Rappel Matériel)
      const bodyB = `
        <p>Bonjour,</p>
        <p>Suite à la livraison de votre commande <strong>#${orderIdShort}</strong>, nous vous rappelons que le matériel de service doit nous être restitué.</p>
        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #9f1239; font-weight: bold; margin-top: 0;">⚠️ Rappel Important</p>
            <p style="color: #9f1239; margin-bottom: 0;">Le matériel doit être restitué dans les 10 jours ouvrés.</p>
        </div>
        <p style="font-size: 0.9em; color: #7f1d1d;">Note : Passé ce délai, une pénalité forfaitaire de 600€ sera appliquée (voir CGV).</p>
        <p>Merci de nous contacter rapidement pour convenir du retour.</p>
        <a href="https://vite-et-gourmand.web.app/contact" class="btn">Contacter le service client</a>
      `;
      emailsToSend.push({
        subject: `⚠️ Retour Matériel - Commande #${orderIdShort}`,
        html: getEmailTemplate("Restitution de Matériel", bodyB)
      });
    }

    // --- 5. Statut: TERMINÉE ---
    else if (newStatus === "terminée" && previousStatus !== "terminée") {

      // CAS SPÉCIAL : Saut direct de "en cours" à "terminée"
      if (previousStatus === "en cours de livraison") {
        const bodyDelivered = `
           <p>Bonjour ${orderData.prenom || ""},</p>
           <p>Votre commande <strong>#${orderIdShort}</strong> a été livrée avec succès.</p>
           <p>Nous vous souhaitons un excellent repas ! 🍽️</p>
        `;
        emailsToSend.push({
          subject: `Commande #${orderIdShort} Livrée`,
          html: getEmailTemplate("Bon Appétit !", bodyDelivered)
        });
      }

      // Invitation à l'avis
      const bodyReview = `
        <p>Bonjour ${orderData.prenom || ""},</p>
        <p>Votre commande <strong>#${orderIdShort}</strong> est maintenant clôturée.</p>
        <p>Nous espérons que vous vous êtes régalé ! Votre avis est précieux pour nous aider à nous améliorer et pour guider nos futurs clients.</p>
        <p>Cela ne prend que 30 secondes :</p>
        <a href="https://vite-et-gourmand.web.app/profil" class="btn">Laisser un avis ⭐</a>
      `;
      emailsToSend.push({
        subject: `⭐ Votre avis sur la commande #${orderIdShort}`,
        html: getEmailTemplate("Votre avis compte !", bodyReview)
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

  const bodyContent = `
    <p>Nous sommes ravis de vous compter parmi nos nouveaux clients.</p>
    <p>Chez <strong>Vite & Gourmand</strong>, notre mission est de vous régaler avec des repas frais, préparés avec soin et livrés avec le sourire.</p>
    <p>Dès maintenant, vous pouvez :</p>
    <ul style="padding-left: 20px;">
        <li style="margin-bottom: 5px;">Consulter nos menus de saison.</li>
        <li style="margin-bottom: 5px;">Passer votre première commande en quelques clics.</li>
        <li style="margin-bottom: 5px;">Nous contacter pour une demande spéciale.</li>
    </ul>
    <p>Pour commencer, rendez-vous sur votre espace personnel :</p>
    <a href="https://vite-et-gourmand.web.app/login" class="btn">Me connecter</a>
    <p style="margin-top: 30px; font-size: 0.9em; color: #777;">À très vite pour votre première dégustation !</p>
  `;

  const mailOptions = {
    from: "contact.viteetgourmand@gmail.com",
    to: email,
    subject: "Bienvenue chez Vite & Gourmand ! 🥗",
    html: getEmailTemplate(`Bienvenue, ${displayName} !`, bodyContent)
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

// ------------------------------------------------------------------
// REFUSER ET SUPPRIMER UNE COMMANDE (ADMIN/STAFF)
// ------------------------------------------------------------------
exports.refuseOrder = onCall(async (request) => {
  const auth = request.auth;
  // 1. Vérification sécurité (Connecté ?)
  if (!auth) {
    throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  }

  const db = getFirestore();
  
  // 2. Vérification Rôle (Admin ou Employé ?)
  const userDoc = await db.collection("Utilisateur").doc(auth.uid).get();
  if (!userDoc.exists || (userDoc.data().role_id !== 1 && userDoc.data().role_id !== 2)) {
    throw new HttpsError("permission-denied", "Droits insuffisants.");
  }

  const { orderId, reason } = request.data;
  if (!orderId || !reason) {
    throw new HttpsError("invalid-argument", "ID de commande ou motif manquant.");
  }

  try {
    const orderRef = db.collection("Commande").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      throw new HttpsError("not-found", "Commande introuvable.");
    }

    const orderData = orderSnap.data();
    const clientEmail = orderData.email;
    const orderIdShort = orderId.slice(-8).toUpperCase();

    // 3. Envoyer l'email de refus
    if (clientEmail) {
      const bodyContent = `
        <p>Bonjour ${orderData.prenom || ""},</p>
        <p>Nous sommes au regret de vous informer que nous ne pouvons pas honorer votre commande.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
             <p style="margin: 0; color: #991b1b;"><strong>Commande #${orderIdShort}</strong></p>
             <p style="margin: 5px 0 0 0; color: #991b1b;">${orderData.nom_menu}</p>
        </div>

        <p><strong>Motif du refus :</strong></p>
        <div style="background-color: #fff; padding: 15px; border-left: 4px solid #ef4444; font-style: italic; color: #555;">
             "${reason}"
        </div>
        
        <p style="margin-top: 20px;">Cette commande a été annulée et ne vous sera pas facturée (ou sera remboursée si déjà payée).</p>
        <p>Nous nous excusons sincèrement pour la gêne occasionnée et espérons vous revoir bientôt.</p>
        <a href="https://vite-et-gourmand.web.app/menus" class="btn">Voir d'autres menus</a>
      `;

      await transporter.sendMail({
        from: "contact.viteetgourmand@gmail.com",
        to: clientEmail,
        subject: `Commande Refusée #${orderIdShort}`,
        html: getEmailTemplate("Mise à jour de commande", bodyContent)
      });
    }

    // 4. Supprimer la commande définitivement
    await orderRef.delete();

    return { status: "success", message: "Commande refusée et supprimée." };

  } catch (error) {
    console.error("Erreur refuseOrder:", error);
    throw new HttpsError("internal", error.message);
  }
});