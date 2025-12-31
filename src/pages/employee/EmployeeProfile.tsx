"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Briefcase, Calendar, GraduationCap, Info, FileText } from "lucide-react";

import type { Employee } from "@/types/Employee";
import { getEmployeeById } from "@/services/employee.services";
import { getFilesByEmployeeId } from "@/services/employee.services";

import LoadingSpinner from "@/components/general/LoadingSpinner";

export default function EmployeeProfilePage() {
  const navigate = useNavigate();
  const { employeeId } = useParams(); // /employee/:employeeId

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);

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

  // Helper to format dates
  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  // Reusable row component
  const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-medium text-foreground">{value ?? "-"}</p>
    </div>
  );

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

          <button
            onClick={() => navigate(`/employee/${employee.employeeId}/files`)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            SEE {fileCount} FILES
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 space-y-8 max-w-5xl mx-auto">
        {/* Employee Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{employee.fullName}</h1>
          <p className="text-lg text-muted-foreground">{employee.positionTitle}</p>
          <p className="text-sm text-muted-foreground">{employee.itemNumber}</p>
        </div>

        {/* Personal Information */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-blue-700 " />
            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
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
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-foreground">Position / Employment Details</h2>
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

        {/* Appointment Dates */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-foreground">Appointment Dates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow label="Original Appointment Date" value={formatDate(employee.originalAppointmentDate)} />
            <InfoRow label="Latest Appointment Date" value={formatDate(employee.latestAppointmentDate)} />
          </div>
        </div>

        {/* Educational Background */}
        <div className="border-2 border-border rounded-lg bg-background p-6">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-foreground">Educational Background</h2>
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
    </div>
  );
}
