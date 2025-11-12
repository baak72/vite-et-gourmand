// 1. Importer les outils
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");

// 2. Initialiser l'Admin SDK
initializeApp();

// 3. Définir la fonction "createEmployeeAccount"
exports.createEmployeeAccount = onCall(async (request) => {

  // 4. VÉRIFICATION DE SÉCURITÉ (TRÈS IMPORTANT)
  // Vérification de qui nous appelle.
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

  // 5. L'UTILISATEUR EST BIEN UN ADMIN. ON PEUT CONTINUER.
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

    // 6. Renvoyer un message de succès
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
