import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import type { UserProfile, AuthProvider } from "../types/User";

const AuthContext = createContext<any>(null);

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        const providerId = firebaseUser.providerData[0]?.providerId || "password";

        const providerMap: Record<string, AuthProvider> = {
          password: "email",
          "google.com": "google",
        };

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: snap.data()?.role || "staff",
          provider: providerMap[providerId] ?? "other",
          createdAt: snap.data()?.createdAt || (serverTimestamp() as unknown as Timestamp),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
