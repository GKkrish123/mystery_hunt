/* eslint-disable no-useless-escape */
/* eslint-disable quotes */
import admin from "firebase-admin";
import {getFunctions} from "firebase-admin/functions";

const firebaseAdminApp = admin.apps.length ?
  admin.app() :
  admin.initializeApp({
      credential: admin.credential.cert({} as admin.ServiceAccount),
    });

const firestore = admin.firestore(firebaseAdminApp);
const adminFunctions = getFunctions(firebaseAdminApp);
export { firestore, adminFunctions };
