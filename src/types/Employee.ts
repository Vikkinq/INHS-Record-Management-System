export interface Employee {
  employeeId: string;
  fullName: string;
  sex: "Male" | "Female";
  dateOfBirth: string; // or Date
  age?: number | null;

  itemNumber?: string;
  positionTitle?: string;
  salaryGrade?: string;
  step?: string;

  employmentStatus?: string;
  natureOfAppointment?: string;
  originalAppointmentDate?: string;
  latestAppointmentDate?: string;

  education?: {
    bachelor?: string;
    major?: string;
    master?: string;
    doctorate?: string;
  };

  createdAt?: any;
  updatedAt?: any;
  userId?: string | null; // 🔹 link to user account if 1-1
}
