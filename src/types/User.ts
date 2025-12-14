export type UserRole = "staff" | "admin";

export interface UserProfile {
  uid: string; // Firebase Auth UID
  email: string; // User email
  role: UserRole; // Role: staff | admin
  provider: AuthProvider; // Auth method: Email/Password or OAuth
  createdAt: any; // Firestore serverTimestamp
}

export type AuthProvider = "email" | "google" | "other";
