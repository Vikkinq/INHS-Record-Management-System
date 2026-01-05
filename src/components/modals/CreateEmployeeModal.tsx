import { useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import type { Employee } from "@/types/Employee";
import { createEmployee } from "@/services/employee.services";
import { calculateAge } from "@/utils/employee_updates.utils";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<Omit<Employee, "employeeId" | "createdAt" | "updatedAt">>({
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

    education: {},

    userId: null,

    employeeNumber: "",
    tin: "",
    gsisBPNumber: "",
    philHealthNumber: "",
    pagIbigMIDNumber: "",
    landbankAccountNumber: "",
  });

  const handleChange = (key: keyof Employee, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "dateOfBirth" && value) {
        updated.age = calculateAge(value);
      }
      return updated;
    });
  };

  const handleDigitsOnly = (key: keyof Employee, max: number, value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, max);
    handleChange(key, digits);
  };

  const handleEducationChange = (key: keyof NonNullable<Employee["education"]>, value: string) => {
    setForm((prev) => ({
      ...prev,
      education: {
        ...(prev.education ?? {}),
        [key]: value,
      },
    }));
  };

  const validateGovernmentIDs = () => {
    const e: Record<string, string> = {};

    if (form.employeeNumber && !/^\d{7}$/.test(form.employeeNumber)) e.employeeNumber = "Must be 7 digits";
    if (form.tin && !/^\d{9}$/.test(form.tin)) e.tin = "Must be 9 digits";
    if (form.gsisBPNumber && !/^\d{11}$/.test(form.gsisBPNumber)) e.gsisBPNumber = "Must be 11 digits";
    if (form.philHealthNumber && !/^\d{12}$/.test(form.philHealthNumber)) e.philHealthNumber = "Must be 12 digits";
    if (form.pagIbigMIDNumber && !/^\d{12}$/.test(form.pagIbigMIDNumber)) e.pagIbigMIDNumber = "Must be 12 digits";
    if (form.landbankAccountNumber && !/^\d{10}$/.test(form.landbankAccountNumber))
      e.landbankAccountNumber = "Must be 10 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateGovernmentIDs()) {
      setStep(4);
      return;
    }

    try {
      // Only include education if it has at least one non-empty value
      const employeeData = {
        ...form,
        ...(form.education && Object.values(form.education).some(Boolean) ? { education: form.education } : {}),
      };

      await createEmployee(employeeData);
      onClose();
    } catch (err) {
      console.error("Failed to create employee:", err);
    }
  };

  if (!isOpen) return null;

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-semibold">Create Employee</h2>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 py-2 text-[11px] text-gray-500">Step {step} of 5</div>

        {/* Content */}
        <div className="px-4 pb-4 space-y-4">
          {/* STEP 1 – Personal */}
          {step === 1 && (
            <>
              <Field label="Full Name">
                <Input value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
              </Field>

              <Field label="Sex">
                <Select value={form.sex} onValueChange={(v) => handleChange("sex", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sex" />
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
                  value={form.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                />
              </Field>

              <Field label="Age">
                <Input value={form.age ?? ""} readOnly />
              </Field>
            </>
          )}

          {/* STEP 2 – Employment */}
          {step === 2 && (
            <>
              <Field label="Position Title">
                <Input value={form.positionTitle} onChange={(e) => handleChange("positionTitle", e.target.value)} />
              </Field>

              <Field label="Salary Grade">
                <Input value={form.salaryGrade} onChange={(e) => handleChange("salaryGrade", e.target.value)} />
              </Field>

              <Field label="Employment Status">
                <Select value={form.employmentStatus} onValueChange={(v) => handleChange("employmentStatus", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </>
          )}

          {/* STEP 3 – Education */}
          {step === 3 && (
            <>
              {(["bachelor", "major", "master", "doctorate"] as const).map((key) => (
                <Field key={key} label={key.toUpperCase()}>
                  <Input
                    value={form.education?.[key] ?? ""}
                    onChange={(e) => handleEducationChange(key, e.target.value)}
                  />
                </Field>
              ))}
            </>
          )}

          {/* STEP 4 – Government IDs */}
          {step === 4 && (
            <>
              <Field label="Employee Number" error={errors.employeeNumber}>
                <Input
                  value={form.employeeNumber}
                  maxLength={7}
                  onChange={(e) => handleDigitsOnly("employeeNumber", 7, e.target.value)}
                />
              </Field>

              <Field label="TIN" error={errors.tin}>
                <Input value={form.tin} maxLength={9} onChange={(e) => handleDigitsOnly("tin", 9, e.target.value)} />
              </Field>

              <Field label="GSIS BP Number" error={errors.gsisBPNumber}>
                <Input
                  value={form.gsisBPNumber}
                  maxLength={11}
                  onChange={(e) => handleDigitsOnly("gsisBPNumber", 11, e.target.value)}
                />
              </Field>

              <Field label="PhilHealth Number" error={errors.philHealthNumber}>
                <Input
                  value={form.philHealthNumber}
                  maxLength={12}
                  onChange={(e) => handleDigitsOnly("philHealthNumber", 12, e.target.value)}
                />
              </Field>

              <Field label="PAG-IBIG Number" error={errors.pagIbigMIDNumber}>
                <Input
                  value={form.pagIbigMIDNumber}
                  maxLength={12}
                  onChange={(e) => handleDigitsOnly("pagIbigMIDNumber", 12, e.target.value)}
                />
              </Field>

              <Field label="Landbank Account Number" error={errors.landbankAccountNumber}>
                <Input
                  value={form.landbankAccountNumber}
                  maxLength={10}
                  onChange={(e) => handleDigitsOnly("landbankAccountNumber", 10, e.target.value)}
                />
              </Field>
            </>
          )}

          {/* STEP 5 – Review */}
          {step === 5 && <p className="text-xs text-slate-600">Review the information and click “Create Employee”.</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 py-3 border-t">
          {step > 1 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep((s) => (s - 1) as Step)}>
              Back
            </Button>
          )}

          {step < 5 ? (
            <Button className="flex-1" onClick={() => setStep((s) => (s + 1) as Step)}>
              Next
            </Button>
          ) : (
            <Button className="flex-1" onClick={handleSubmit}>
              Create Employee
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
