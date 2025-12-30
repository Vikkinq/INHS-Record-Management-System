import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import type { CreateUserProfileInput, UserProfile } from "../types/User";

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

export async function getAllUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const users: UserProfile[] = snapshot.docs.map((doc) => {
    return {
      uid: doc.id,
      ...(doc.data() as Omit<UserProfile, "uid">),
    };
  });

  return users;
}
