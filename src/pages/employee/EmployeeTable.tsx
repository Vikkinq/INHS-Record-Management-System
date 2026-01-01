import type { Employee } from "@/types/Employee";

interface EmployeeTableProps {
  employeeData: Employee[];
  onRowClick: (employee: Employee) => void; // accept one argument
}

export default function EmployeeTable({ employeeData, onRowClick }: EmployeeTableProps) {
  return (
    <tbody>
      {employeeData.map((employee) => (
        <tr
          key={employee?.employeeId}
          className="border-t hover:bg-muted/50 transition-colors"
          onClick={() => onRowClick(employee)}
        >
          <td className="px-4 py-3 text-xs text-slate-500">{employee.employeeId} </td>

          <td className="px-4 py-3 font-medium">
            {/* If fullName exists in Firestore */}
            {"fullName" in employee ? (employee as any).fullName : "—"}
          </td>

          <td className="px-4 py-3">{employee.sex}</td>
          <td className="px-4 py-3">{employee.positionTitle}</td>

          <td className="px-4 py-3 capitalize">{employee.employmentStatus}</td>
        </tr>
      ))}
    </tbody>
  );
}
