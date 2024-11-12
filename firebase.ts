// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig =  {
    apiKey: "AIzaSyD7JZZOOoz_KOIDO-vbcibR9x10i2C4Kbs",
    authDomain: "gkrish-mystery-hunt.firebaseapp.com",
    projectId: "gkrish-mystery-hunt",
    storageBucket: "gkrish-mystery-hunt.firebasestorage.app",
    messagingSenderId: "526345543661",
    appId: "1:526345543661:web:03d2c65501869d03e4d1e4",
    measurementId: "G-329FE0BLN8",
  };

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
auth.useDeviceLanguage();

// Export Firebase Utils
export { db, auth };
