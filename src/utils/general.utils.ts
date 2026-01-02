import type { Employee } from "@/types/Employee";
import type { UserProfile } from "@/types/User";

// Converts Firestore Timestamp or Date/string into a number for sorting
export const getTimestamp = (value: any): number => {
  if (!value) return 0;

  if (value.toDate) return value.toDate().getTime(); // Firestore Timestamp
  if (value instanceof Date) return value.getTime(); // JS Date
  return new Date(value).getTime(); // string or other
};

// Format date nicely
export const formatDate = (value: any): string => {
  if (!value) return "";
  if (value.toDate) return value.toDate().toLocaleDateString();
  if (value instanceof Date) return value.toLocaleDateString();
  return new Date(value).toLocaleDateString();
};

export function canEditEmployee(employee: Employee | null, user: UserProfile | null) {
  if (!user) return false;

  return user?.role === "admin" || employee?.userId === user.uid;
}
