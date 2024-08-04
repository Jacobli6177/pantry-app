// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdsoWGeHEQZl845yT2tO_z_72hYSY9KzQ",
  authDomain: "inventory-management-ea60f.firebaseapp.com",
  projectId: "inventory-management-ea60f",
  storageBucket: "inventory-management-ea60f.appspot.com",
  messagingSenderId: "203659635830",
  appId: "1:203659635830:web:80e2c2331831fa706cc357",
  measurementId: "G-NL9L953791"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app); 


export {firestore}