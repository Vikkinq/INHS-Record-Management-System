import type { Timestamp } from "firebase/firestore";

export type UserRole = "staff" | "admin";
export type AuthProvider = "email" | "google" | "other";

export interface UserProfile {
  uid: string; // Firebase Auth UID
  email: string | null; // User email
  role: UserRole; // Role: staff | admin
  provider: AuthProvider; // Auth method: Email/Password or OAuth
  createdAt: Timestamp;
}
