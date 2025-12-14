export interface Employee {
  employeeId: string; // Firestore auto-generated ID
  name: string;
  employeeNo?: string; // optional, depends on school policy
  department?: string;
  createdAt: Date;
}
