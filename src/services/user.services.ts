import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { UserProfile } from "../types/User";

export const createUserProfile = async (user: UserProfile) => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      role: "staff",
      createdAt: new Date(),
    });
  }
};
