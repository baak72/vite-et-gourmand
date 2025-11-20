// 1. Importer les outils
const nodemailer = require("nodemailer");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

// Définir la fonction "createEmployeeAccount"
exports.createEmployeeAccount = onCall(async (request) => {

  // VÉRIFICATION DE SÉCURITÉ
  const auth = request.auth;
  if (!auth) {
    // L'utilisateur n'est pas connecté.
    throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  }

  // Vérification du rôle de l'utilisateur.
  if (auth.token.role !== "admin") {
    // L'utilisateur est connecté, mais n'est pas un admin.
    throw new HttpsError(
        "permission-denied",
        "Vous n'avez pas les droits pour faire ça.",
    );
  }

  // L'UTILISATEUR EST BIEN UN ADMIN. ON PEUT CONTINUER.
  const {email, password} = request.data;

  try {
    // Étape A : Créer l'utilisateur dans Firebase Authentication
    const userRecord = await getAuth().createUser({
      email: email,
      password: password,
    });

    // Étape B : Marquer cet utilisateur comme "employe"
    await getAuth().setCustomUserClaims(userRecord.uid, {role: "employe"});

    // Étape C : Créer son document dans Firestore
    const db = getFirestore();
    const userDocRef = db.collection("Utilisateur").doc(userRecord.uid);
    await userDocRef.set({
      uid: userRecord.uid,
      email: email,
      role_id: 2,
      est_actif: true,
      nom: "Employé", // L'admin pourra le changer plus tard
      prenom: "Nouveau",
    });

    return {
      status: "success",
      message: `Compte employé créé avec succès pour ${email}`,
    };
  } catch (error) {
    // Gérer les erreurs (ex: email déjà pris)
    console.error("Erreur Cloud Function:", error);
    throw new HttpsError("internal", error.message);
  }
});

// ------------------------------------------------------------------
// Désactiver un compte employé
// ------------------------------------------------------------------
exports.disableEmployeeAccount = onCall(async (request) => {
  // Vérification de sécurité (Admin seulement)
  const auth = request.auth;
  if (!auth) {
    throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  }
  if (auth.token.role !== "admin") {
    throw new HttpsError(
        "permission-denied",
        "Vous n'avez pas les droits pour faire ça.",
    );
  }

  // On récupère l'ID de l'employé à désactiver
  const {uid} = request.data;
  if (!uid) {
    throw new HttpsError("invalid-argument", "L'UID est manquant.");
  }

  try {
    // Étape A : Désactiver le compte
    await getAuth().updateUser(uid, {
      disabled: true,
    });

    // Étape B : Mettre à jour notre base de données
    const db = getFirestore();
    const userDocRef = db.collection("Utilisateur").doc(uid);
    await userDocRef.update({
      est_actif: false,
    });

    // 3. Renvoyer un message de succès
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
// FONCTION 3 : TRAITER LE FORMULAIRE DE CONTACT
// ------------------------------------------------------------------
exports.processContactForm = onCall(async (request) => {
  // On vérifie que la requête contient bien les données nécessaires
  const { titre, email, description } = request.data;
  if (!titre || !email || !description) {
    throw new HttpsError("invalid-argument", "Champs requis manquants.");
  }
  
  // Créer le transporteur Nodemailer
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "contact.viteetgourmand@gmail.com", // Adresse pour l'envoi
          pass: "gitjacluzqmslxtz"
      }
  });

  // Définir le contenu de l'e-mail
  const mailOptions = {
      from: "contact.viteetgourmand@gmail.com",
      to: "contact.viteetgourmand@gmail.com", // L'adresse de l'entreprise qui reçoit
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
    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);
    console.log("E-mail de contact envoyé avec succès à l'entreprise.");
    
    return {
      status: "success",
      message: "Message envoyé.",
    };
  } catch (error) {
    console.error("Erreur Nodemailer lors de l'envoi :", error);
    throw new HttpsError("internal", "Échec de l'envoi du message.");
  }
});

// ------------------------------------------------------------------
// FONCTION 4 : VÉRIFIER LES MISES À JOUR DE STATUT DES COMMANDES
// ------------------------------------------------------------------
exports.checkOrderStatusUpdate = require("firebase-functions/v1/firestore")
    .document("Commande/{commandeId}")
    .onUpdate(async (change, context) => {
        
        const newStatus = change.after.data().statut;
        const previousStatus = change.before.data().statut;
        const orderData = change.after.data();
        const fullOrderId = context.params.commandeId;

        // --- FORMATTER L'ID (8 derniers caractères) ---
        const orderIdShort = fullOrderId.slice(-8).toUpperCase();
        
        // --- ENVOYEUR SMTP ---
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "contact.viteetgourmand@gmail.com",
                pass: "gitjacluzqmslxtz" 
            }
        });

        // Sortir si le statut n'a pas changé
        if (newStatus === previousStatus) {
            return null;
        }

        const clientEmail = orderData.email;
        const emailsToSend = [];

        // -----------------------------------------------------------
        // LOGIQUE D'ENVOI D'EMAILS PAR STATUT
        // -----------------------------------------------------------

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
        
        // --- 3. Statut: MATÉRIEL EN ATTENTE (DOUBLE ENVOI) (Lors des commandes avec du  matériel) ---
        else if (newStatus === "en attente du retour de matériel") {
            // Email A : La confirmation de livraison
            emailsToSend.push({
                subject: `Votre commande #${orderIdShort} a bien été livrée`,
                html: `
                    <p>Bonjour,</p>
                    <p>Votre commande #${orderIdShort} a été livrée avec succès.</p>
                    <p>Merci de votre confiance, cela nous fait vraiment plaisir de vous accompagner aujourd’hui. Nous vous souhaitons un excellent repas et un très bon appétit ! 🍽️😊</p>
                `
            });

            // Email B : L'avertissement de pénalité
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
        
        // --- 4. Statut: TERMINÉE (Invitation à l'avis) ---
        else if (newStatus === "terminée" && previousStatus !== "terminée") {
            
            // CAS SPÉCIAL : Si on passe directement de "EN COURS DE LIVRAISON" à "terminée" (Lors des commandes sans matériel)
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

            // Invitation à l'avis (Envoyé dans tous les cas quand c'est fini)
            emailsToSend.push({
                subject: `⭐ Votre avis compte ! Commande #${orderIdShort} finalisée`,
                html: `
                    <p>Bonjour,</p>
                    <p>Votre commande #${orderIdShort} est maintenant cloturée.</p>
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
