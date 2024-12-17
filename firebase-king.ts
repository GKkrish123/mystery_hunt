import admin from "firebase-admin";

const firebaseAdminApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FB_KING!) as admin.ServiceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

const adminAuth = admin.auth();
export { firebaseAdminApp, adminAuth };
