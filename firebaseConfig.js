// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy1YvkSzs2YCXDsyvbXzt7ZxLY0SUqXbc",
  authDomain: "betonit-d7eca.firebaseapp.com",
  projectId: "betonit-d7eca",
  storageBucket: "betonit-d7eca.firebasestorage.app",
  messagingSenderId: "561197489996",
  appId: "1:561197489996:web:4e68ec6b5b19c7373f39e9",
  measurementId: "G-DE1EJVH8SV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Initialize Firebase
const auth = getAuth(app);  // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const storage = getStorage(app); // Firebase Storage

export { auth, db, storage };