import type { Employee } from "@/types/Employee";
import { Button } from "@/components/ui/button";

type Props = {
  employee: Employee;
  onSeeProfile: () => void;
  onSeeFiles: () => void;
};

export default function EmployeePreview({ employee, onSeeProfile, onSeeFiles }: Props) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Avatar / Icon */}
        {/* <div className="flex justify-center py-4">
          <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-500">{employee.fullName.charAt(0)}</span>
          </div>
        </div> */}

        {/* Basic Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">{employee.fullName}</h3>
          <p className="text-sm text-gray-500">{employee.positionTitle}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm px-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="capitalize font-medium">{employee.employmentStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sex</span>
            <span className="font-medium">{employee.sex}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Employee ID</span>
            <span className="font-medium">{employee.employeeId}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t px-2">
        <Button className="w-full" onClick={onSeeProfile}>
          See Profile
        </Button>
        <Button variant="outline" className="w-full" onClick={onSeeFiles}>
          See Files
        </Button>
      </div>
    </div>
  );
}
