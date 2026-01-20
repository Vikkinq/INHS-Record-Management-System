import { formatDate } from "@/utils/general.utils";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { canEditEmployee, canDeleteEmployee } from "@/utils/general.utils";
import { deleteEmployee } from "@/services/employee.services";

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Briefcase, Calendar, GraduationCap, Info, FileText } from "lucide-react";

import type { Employee } from "@/types/Employee";
import { getEmployeeById } from "@/services/employee.services";
import { getFilesByEmployeeId, updateEmployee } from "@/services/employee.services";
import { EMPLOYEE_SECTION_FIELDS, calculateAge } from "@/utils/employee_updates.utils";

import UpdateEmployeeModal from "@/components/modals/UpdateEmployeeModal";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useToast } from "@/components/general/Toast";

export type EmployeeEditSection = "personal" | "employment" | "government" | "appointment" | "education";

export default function EmployeeProfilePage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { employeeId } = useParams(); // /employee/:employeeId
  const { user } = useAuth();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);

  // Edit States
  const [editSection, setEditSection] = useState<EmployeeEditSection | null>(null);
  const canEdit = canEditEmployee(employee, user);
  const canDelete = canDeleteEmployee(employee, user);

  const handleUpdate = async (section: EmployeeEditSection, data: Partial<Employee>) => {
    if (!employee || !canEdit) return;

    // Only allow fields for this section
    const allowedFields = EMPLOYEE_SECTION_FIELDS[section];

    const payload: Partial<Employee> = {};

    allowedFields.forEach((field) => {
      if (field in data) {
        payload[field] = data[field as keyof Employee];
      }
    });

    // Auto-calculate age if DOB is edited
    if (section === "personal" && data.dateOfBirth) {
      payload.age = calculateAge(data.dateOfBirth);
    }

    try {
      const updated = await updateEmployee(employee.employeeId, payload);
      console.log(updated);
      // Optimistic UI merge
      setEmployee((prev) => (prev ? { ...prev, ...payload } : prev));
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update employee.");
    }
  };

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const emp = await getEmployeeById(employeeId);
        setEmployee(emp);

        // Fetch all files using employeeId
        const files = await getFilesByEmployeeId(employeeId);
        setFileCount(files.length);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  if (loading) return <LoadingSpinner label="Loading Employee Datas" />;
  if (error || !employee)
    return <div className="min-h-screen flex items-center justify-center">{error || "Employee not found"}</div>;

  // Reusable row component
  const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-medium text-foreground">{value ?? "-"}</p>
    </div>
  );

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!window.confirm("Are you sure you want to delete this Employee?")) return;
    try {
      await deleteEmployee(employeeId);
      alert("Employee Deleted!");
      addToast(`Employee ${employee.fullName} has been Successfully Deleted`, "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      addToast(`Employee ${employee.fullName} failed to be Deleted`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Employee List</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/employee/${employee.employeeId}/files`)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FileText className="w-4 h-4" />
              SEE {fileCount} FILES
            </button>

            {canDelete && (
              <button
                onClick={() => handleDeleteEmployee(employee.employeeId)}
                className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Employee
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 space-y-8 max-w-5xl mx-auto">
        {/* Employee Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{employee.fullName}</h1>
          <p className="text-lg text-muted-foreground">{employee.positionTitle}</p>
          <p className="text-sm text-muted-foreground">{employee.employeeNumber}</p>
        </div>

        {/* Personal Information */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>

            {canEdit && (
              <button
                onClick={() => setEditSection("personal")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow label="Full Name" value={employee.fullName} />
            <InfoRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
            <InfoRow label="Sex" value={employee.sex} />
            <InfoRow label="Age" value={employee.age ?? ""} />
          </div>
        </div>

        {/* Position / Employment Details */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-semibold">Position / Employment Details</h2>
            </div>

            {canEdit && (
              <button
                onClick={() => setEditSection("employment")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                ✏️ Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow label="Item Number" value={employee.itemNumber} />
            <InfoRow label="Position Title" value={employee.positionTitle} />
            <InfoRow label="Salary Grade" value={employee.salaryGrade} />
            <InfoRow label="Step" value={employee.step} />
            <InfoRow label="Employment Status" value={employee.employmentStatus} />
            <InfoRow label="Nature of Appointment" value={employee.natureOfAppointment} />
          </div>
        </div>

        {/* Government Credentials */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-semibold">Government Identification Numbers</h2>
            </div>

            {canEdit && (
              <button
                onClick={() => setEditSection("government")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                ✏️ Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow label="Employee Number" value={employee.employeeNumber} />
            <InfoRow label="TIN Number" value={employee.tin} />
            <InfoRow label="GSIS BP Number" value={employee.gsisBPNumber} />
            <InfoRow label="PhilHealth Number" value={employee.philHealthNumber} />
            <InfoRow label="PAG-IBIG MID Number" value={employee.pagIbigMIDNumber} />
            <InfoRow label="LandBank Account Number" value={employee.landbankAccountNumber} />
          </div>
        </div>

        {/* Appointment Dates */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-semibold">Appointment Dates</h2>
            </div>

            {canEdit && (
              <button
                onClick={() => setEditSection("appointment")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                ✏️ Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow label="Original Appointment Date" value={formatDate(employee.originalAppointmentDate)} />
            <InfoRow label="Latest Appointment Date" value={formatDate(employee.latestAppointmentDate)} />
          </div>
        </div>

        {/* Educational Background */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-semibold">Education</h2>
            </div>

            {canEdit && (
              <button
                onClick={() => setEditSection("education")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                ✏️ Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow label="Bachelor's Degree" value={employee.education?.bachelor} />
            <InfoRow label="Master's Degree" value={employee.education?.master} />
            <InfoRow label="Major / Specialization" value={employee.education?.major} />
            <InfoRow label="Doctorate Degree" value={employee.education?.doctorate} />
          </div>
        </div>

        {/* System Info */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-foreground">System Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow label="Record Created Date" value={formatDate(employee.createdAt)} />
            <InfoRow label="Last Updated Date" value={formatDate(employee.updatedAt)} />
          </div>
        </div>
      </div>

      {editSection && employee && (
        <UpdateEmployeeModal
          employee={employee}
          section={editSection}
          onClose={() => setEditSection(null)}
          onUpdated={(data) => {
            handleUpdate(editSection, data);
            setEditSection(null);
          }}
        />
      )}
    </div>
  );
}
