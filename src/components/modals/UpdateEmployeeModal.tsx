import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { calculateAge } from "@/utils/employee_updates.utils";

import type { Employee } from "@/types/Employee";
import type { EmployeeEditSection } from "@/pages/employee/EmployeeProfile";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

interface UpdateEmployeeModalProps {
  employee: Employee;
  section: EmployeeEditSection;
  onClose: () => void;
  onUpdated: (data: Partial<Employee>) => void;
}

export default function UpdateEmployeeModal({ employee, section, onClose, onUpdated }: UpdateEmployeeModalProps) {
  const [form, setForm] = useState<Record<string, string | number>>({});

  useEffect(() => {
    switch (section) {
      case "personal":
        setForm({
          fullName: employee.fullName ?? "",
          sex: employee.sex ?? "",
          dateOfBirth: employee.dateOfBirth ?? "",
          age: employee.age ?? "",
        });
        break;

      case "employment":
        setForm({
          positionTitle: employee.positionTitle ?? "",
          itemNumber: employee.itemNumber ?? "",
          employmentStatus: employee.employmentStatus ?? "",
          salaryGrade: employee.salaryGrade ?? "",
          step: employee.step ?? "",
        });
        break;

      case "appointment":
        setForm({
          originalAppointmentDate: employee.originalAppointmentDate ?? "",
          latestAppointmentDate: employee.latestAppointmentDate ?? "",
        });
        break;

      case "education":
        setForm({
          bachelor: employee.education?.bachelor ?? "",
          master: employee.education?.master ?? "",
          major: employee.education?.major ?? "",
          doctorate: employee.education?.doctorate ?? "",
        });
        break;
    }
  }, [employee, section]);

  function handleChange<T extends string | number>(key: string, value: T) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Auto-calc age when DOB changes
  useEffect(() => {
    if (section === "personal" && form.dateOfBirth) {
      const age = calculateAge(form.dateOfBirth as string);
      setForm((prev) => ({ ...prev, age }));
    }
  }, [form.dateOfBirth, section]);

  function handleSave() {
    const updatedEmployee: Employee = {
      ...employee,
      ...(section === "education" ? { education: { ...employee.education, ...form } } : form),
      updatedAt: new Date().toISOString(),
    };

    // 🔥 call firestore update here later
    // await updateEmployee(employee.employeeId, updatedEmployee)

    onUpdated(updatedEmployee);
    onClose();
  }

  function renderFields() {
    switch (section) {
      case "personal":
        return (
          <>
            <Field label="Full Name">
              <Input value={String(form.fullName)} onChange={(e) => handleChange("fullName", e.target.value)} />
            </Field>

            <Field label="Sex">
              <Select value={String(form.sex)} onValueChange={(value) => handleChange("sex", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Date of Birth">
              <Input
                type="date"
                value={String(form.dateOfBirth)}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              />
            </Field>

            <Field label="Age">
              <Input type="number" value={String(form.age)} disabled />
            </Field>
          </>
        );

      case "employment":
        return (
          <>
            <Field label="Position Title">
              <Input
                value={String(form.positionTitle)}
                onChange={(e) => handleChange("positionTitle", e.target.value)}
              />
            </Field>

            <Field label="Item Number">
              <Input value={String(form.itemNumber)} onChange={(e) => handleChange("itemNumber", e.target.value)} />
            </Field>

            <Field label="Employment Status">
              <Select
                value={String(form.employmentStatus)}
                onValueChange={(value) => handleChange("employmentStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Salary Grade">
              <Input value={String(form.salaryGrade)} onChange={(e) => handleChange("salaryGrade", e.target.value)} />
            </Field>

            <Field label="Step">
              <Input value={String(form.step)} onChange={(e) => handleChange("step", e.target.value)} />
            </Field>
          </>
        );

      case "appointment":
        return (
          <>
            <Field label="Original Appointment Date">
              <Input
                type="date"
                value={String(form.originalAppointmentDate)}
                onChange={(e) => handleChange("originalAppointmentDate", e.target.value)}
              />
            </Field>

            <Field label="Latest Appointment Date">
              <Input
                type="date"
                value={String(form.latestAppointmentDate)}
                onChange={(e) => handleChange("latestAppointmentDate", e.target.value)}
              />
            </Field>
          </>
        );

      case "education":
        return (
          <>
            <Field label="Bachelor's Degree">
              <Input value={String(form.bachelor)} onChange={(e) => handleChange("bachelor", e.target.value)} />
            </Field>

            <Field label="Master's Degree">
              <Input value={String(form.master)} onChange={(e) => handleChange("master", e.target.value)} />
            </Field>

            <Field label="Major / Specialization">
              <Input value={String(form.major)} onChange={(e) => handleChange("major", e.target.value)} />
            </Field>

            <Field label="Doctorate Degree">
              <Input value={String(form.doctorate)} onChange={(e) => handleChange("doctorate", e.target.value)} />
            </Field>
          </>
        );
    }
  }

  /* ----------------------------- */
  /* UI                            */
  /* ----------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-6 capitalize">Edit {section.replace("-", " ")}</h2>

        <div className="space-y-4">{renderFields()}</div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
