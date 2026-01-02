import type { EmployeeEditSection } from "@/pages/employee/EmployeeProfile";

import type { Employee } from "@/types/Employee";

export const EMPLOYEE_SECTION_FIELDS: Record<EmployeeEditSection, readonly (keyof Employee)[]> = {
  personal: ["fullName", "dateOfBirth", "sex", "age"],
  employment: ["itemNumber", "positionTitle", "salaryGrade", "step", "employmentStatus", "natureOfAppointment"],
  appointment: ["originalAppointmentDate", "latestAppointmentDate"],
  education: ["education"],
};
export function calculateAge(dateOfBirth: string | Date) {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
