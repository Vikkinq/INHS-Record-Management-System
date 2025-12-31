// EmployeeFilesNavbar.tsx
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types/Employee";

type Props = {
  employee?: Employee | null;
  onBack: () => void;
};

export function EmployeeFilesNavbar({ employee, onBack }: Props) {
  return (
    <header className="h-14 border-b flex items-center px-4 bg-background">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="ml-4">
        <h1 className="text-sm font-semibold">{employee?.fullName || "Loading..."}</h1>
        <p className="text-xs text-gray-500">Employee Files</p>
      </div>
    </header>
  );
}
