// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1n6qTb6jXvLDvvQbWCyuIlpdKoWsD1Kk",
  authDomain: "myecom-4dccc.firebaseapp.com",
  projectId: "myecom-4dccc",
  storageBucket: "myecom-4dccc.firebasestorage.app",
  messagingSenderId: "1089346992039",
  appId: "1:1089346992039:web:6c18b123144d8398006882"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, auth }