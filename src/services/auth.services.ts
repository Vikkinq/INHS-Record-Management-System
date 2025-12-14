import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../config/firebase";

export const registerWithEmail = async (email: string, password: string) => {
  const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
  return userCredentials.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const userCredentials = await signInWithEmailAndPassword(auth, email, password);
  return userCredentials.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};
