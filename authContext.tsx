import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { useRouter, useSegments } from "expo-router";
import { getDoc, doc } from "firebase/firestore";


export const AuthContext = createContext<{ user: User | null } | null>(null);

interface AuthProviderProps {
    children: ReactNode; // ✅ Proper type for children
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
  
          if (userDoc.exists()) {
            setUser({ ...firebaseUser, ...userDoc.data() }); // Merge auth and Firestore data
          } else {
            setUser(firebaseUser); // Use only auth data if no Firestore entry
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
  

    return () => unsubscribe();
  }, []);

  // Wait until loading is done before navigating
  useEffect(() => {
    if (loading) return;

    // Ensure we're on the first render before trying to navigate
    if (!user && segments[0] !== "screens") {
      router.replace("/screens/auth/LoginScreen");
    } else if (user && segments[0] === "screens") {
      router.replace("/(tabs)/MyBetsScreen");
    }
  }, [user, loading]);

  if (loading) return null; // Prevent flicker while checking auth

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
