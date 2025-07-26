// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth }        from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBph9y5ieyTNDl2ygmTk_WSCAO8mlhvwng",
  authDomain: "ekatra-ai-35d6e.firebaseapp.com",
  projectId: "ekatra-ai-35d6e",
  storageBucket: "ekatra-ai-35d6e.firebasestorage.app",
  messagingSenderId: "263904598549",
  appId: "1:263904598549:web:ae6c6cc99534bc55934c1c",
  measurementId: "G-YPKY7V45L6"
};

console.log("Loaded Firebase config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };