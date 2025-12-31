export type UserRole = "staff" | "admin";
export type AuthProvider = "email" | "google" | "other";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;

  employeeId?: string | null; // ✅ stored in Firestore

  provider: AuthProvider;
  createdAt: any;
}

// 👇 input type for profile creation
export type CreateUserProfileInput = {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  provider?: AuthProvider;

  employeeId?: string | null; // 🔥 ADD THIS
};
