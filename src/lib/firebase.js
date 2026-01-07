import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyCABADbNYcj4Bo06qdWfMC8XCbmsSRXitc",
    authDomain: "birthday-site-511c9.firebaseapp.com",
    projectId: "birthday-site-511c9",
    storageBucket: "birthday-site-511c9.firebasestorage.app",
    messagingSenderId: "811025908396",
    appId: "1:811025908396:web:5f0e64989973c6200b9509"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);