export type UserRole = "staff" | "admin";
export type AuthProvider = "email" | "google" | "other";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: any;
}

// 👇 input type for profile creation
export type CreateUserProfileInput = {
  uid: string;
  email: string;
  provider?: AuthProvider;
};
