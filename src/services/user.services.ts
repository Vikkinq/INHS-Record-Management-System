import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import type { CreateUserProfileInput } from "../types/User";

export const createUserProfile = async (input: CreateUserProfileInput) => {
  const userRef = doc(db, "users", input.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: input.email,
      role: input.role,
      fullName: input.fullName,
      provider: input.provider ?? "email",
      createdAt: serverTimestamp(),
    });
  }
};
