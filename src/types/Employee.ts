export interface Employee {
  employeeId: string; // Firestore doc ID
  fullName: string;
  sex: "Male" | "Female";
  dateOfBirth: string; // or Date
  age?: number | null;

  // Employee & Government IDs
  employeeNumber?: string; // max 7 digits, strictly numbers
  tin?: string; // 9 digits
  gsisBPNumber?: string; // 11 digits
  philHealthNumber?: string; // 12 digits
  pagIbigMIDNumber?: string; // 12 digits
  landbankAccountNumber?: string; // 10 digits

  // Position / Employment Details
  itemNumber?: string;
  positionTitle?: string;
  salaryGrade?: string;
  step?: string;

  employmentStatus?: string;
  natureOfAppointment?: string;
  originalAppointmentDate?: string;
  latestAppointmentDate?: string;

  // Education
  education?: {
    bachelor?: string;
    major?: string;
    master?: string;
    doctorate?: string;
  };

  // System / linking
  createdAt?: any;
  updatedAt?: any;
  userId?: string | null; // link to user account if any
}
