import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import type { UserProfile, AuthProvider } from "../types/User";

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          const providerId = firebaseUser.providerData[0]?.providerId || "password";

          const providerMap: Record<string, AuthProvider> = {
            password: "email",
            "google.com": "google",
          };

          if (!firebaseUser.email) {
            throw new Error("No email available for this user");
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: snap.data()?.role || "staff",
            provider: providerMap[providerId] ?? "other",
            createdAt: snap.data()?.createdAt || serverTimestamp(),
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("AuthContext error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthContextProvider");
  return ctx;
};
