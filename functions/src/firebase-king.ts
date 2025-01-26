/* eslint-disable no-useless-escape */
/* eslint-disable quotes */
import admin from "firebase-admin";

const firebaseAdminApp = admin.apps.length ?
  admin.app() :
  admin.initializeApp();

const firestore = admin.firestore(firebaseAdminApp);
export { firestore };
