const googleProvider = new GoogleAuthProvider();

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
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logout = async () => {
  try {
    if (!window.confirm("Are you sure you want to Logout?")) return;
    await signOut(auth);
  } catch (err) {
    alert("Cannot Logout");
    console.log("Unable to Logout, Cause: ", err);
  }
};
