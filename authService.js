import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const signUp = async (email, password) => {
  try {
    console.log("auth: ", auth); // Log the auth object to verify it's initialized correctly
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("userCredential: ", userCredential); // Log the user credential object
    return userCredential.user; // Return the user object
  } catch (error) {
    console.error("Sign Up Error:", error.message); // Log error message
    console.error("Sign Up Error Code:", error.code); // Log the error code
    console.error("Sign Up Error Details:", error); // Log full error object for debugging
    throw error; // Re-throw the error if needed
  }
};


export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch Firestore user data
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      console.warn("No Firestore user data found, using auth data only.");
      return firebaseUser;
    }

    return { ...firebaseUser, ...userDoc.data() }; // Merge auth & Firestore
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
