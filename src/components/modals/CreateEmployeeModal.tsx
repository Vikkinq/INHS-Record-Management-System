// CreateEmployeeModal.tsx
import { useState } from "react";
import { X } from "lucide-react";
import type { Employee } from "@/types/Employee";

import { createEmployee } from "@/services/employee.services";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  //   onSubmit: (employee: Employee) => void;
}

export default function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState<Omit<Employee, "employeeId" | "createdAt" | "updatedAt">>({
    fullName: "",
    sex: "Male",
    dateOfBirth: "",
    age: undefined,
    itemNumber: "",
    positionTitle: "",
    salaryGrade: "",
    step: "",
    employmentStatus: "",
    natureOfAppointment: "",
    originalAppointmentDate: "",
    latestAppointmentDate: "",
    education: { bachelor: "", major: "", master: "", doctorate: "" },
    userId: "",
  });

  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    if (!dob) return undefined;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (key: keyof Employee, value: any) => {
    if (key === "dateOfBirth") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, dateOfBirth: value, age }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleEducationChange = (key: keyof Employee["education"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: { ...prev.education, [key]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      await createEmployee({
        ...formData,
        age: formData.age ?? null, // Replace undefined with null
        userId: null, // Replace empty string or undefined with null
      });

      // Reset form
      setFormData({
        fullName: "",
        sex: "Male",
        dateOfBirth: "",
        age: null,
        itemNumber: "",
        positionTitle: "",
        salaryGrade: "",
        step: "",
        employmentStatus: "",
        natureOfAppointment: "",
        originalAppointmentDate: "",
        latestAppointmentDate: "",
        education: { bachelor: "", major: "", master: "", doctorate: "" },
        userId: null,
      });

      onClose();
    } catch (err: any) {
      console.error("Failed to create employee:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh] relative p-6">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Employee</h2>

        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sex</label>
            <select
              value={formData.sex}
              onChange={(e) => handleChange("sex", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              value={formData.age ?? ""}
              readOnly
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Position Title</label>
            <input
              type="text"
              value={formData.positionTitle}
              onChange={(e) => handleChange("positionTitle", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salary Grade</label>
            <input
              type="text"
              value={formData.salaryGrade}
              onChange={(e) => handleChange("salaryGrade", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Step</label>
            <input
              type="text"
              value={formData.step}
              onChange={(e) => handleChange("step", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Employment Status</label>
            <input
              type="text"
              value={formData.employmentStatus}
              onChange={(e) => handleChange("employmentStatus", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nature of Appointment</label>
            <input
              type="text"
              value={formData.natureOfAppointment}
              onChange={(e) => handleChange("natureOfAppointment", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Original Appointment Date</label>
            <input
              type="date"
              value={formData.originalAppointmentDate}
              onChange={(e) => handleChange("originalAppointmentDate", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Latest Appointment Date</label>
            <input
              type="date"
              value={formData.latestAppointmentDate}
              onChange={(e) => handleChange("latestAppointmentDate", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Education Section */}
        <h3 className="mt-6 mb-3 text-lg font-semibold text-slate-700">Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["bachelor", "major", "master", "doctorate"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
              <input
                type="text"
                value={formData.education?.[field as keyof Employee["education"]] || ""}
                onChange={(e) => handleEducationChange(field as keyof Employee["education"], e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 flex-1 sm:flex-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 flex-1 sm:flex-none"
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}
