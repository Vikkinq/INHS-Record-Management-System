import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "../general/Toast";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { uploadFile } from "@/services/file.services";
import { getFileType, isValidFileType } from "@/utils/file.utils";
import { getUserProfile } from "@/services/user.services";
import type { FileRecord } from "@/types/Files";
import type { Employee } from "@/types/Employee";
import { getEmployees } from "@/services/employee.services";

interface FileUploadModalProps {
  onClose: () => void;
  userId: string;
  onUploaded: (files: FileRecord[]) => void;
}

export default function FileUploadModal({ onClose, userId, onUploaded }: FileUploadModalProps) {
  const { addToast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    employeeId?: string | null;
    displayName?: string | null;
    email?: string;
  }>({});
  const [employees, setEmployees] = useState<Employee[]>([]); // all employees for search
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user metadata
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch user metadata", "error");
      }
    };
    fetchUser();
  }, [userId]);

  // Mock fetch employees (replace with real API)
  // Fetch employees for tagging
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const allEmployees = await getEmployees();
        setEmployees(allEmployees);
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch employees", "error");
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => emp.fullName.toLowerCase().includes(employeeQuery.toLowerCase()));

  const handleFilesAdded = (files: FileList) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!category) {
      addToast("Please select a category", "error");
      return;
    }

    setLoading(true);
    const uploaded: FileRecord[] = [];

    for (const file of selectedFiles) {
      try {
        if (!isValidFileType(file)) {
          addToast(`Invalid file type: ${file.name}`, "error");
          continue;
        }

        const newFile = await uploadFile(file, {
          employeeId: selectedEmployee?.employeeId, // optional assignment
          uploadedBy: userProfile.displayName || userProfile.email || "Unknown",
          fileName: file.name,
          fileType: getFileType(file),
          category,
          userId,
        });

        uploaded.push(newFile);
        addToast(`File "${file.name}" uploaded!`, "success");
      } catch (err) {
        console.error(err);
        addToast(`Failed to upload "${file.name}"`, "error");
      }
    }

    setLoading(false);
    onUploaded(uploaded);
    setSelectedFiles([]);
    setSelectedEmployee(null);
    setCategory("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {loading && <LoadingSpinner label="Uploading files..." />}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Upload Files</h2>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Personal Data">Personal Data</SelectItem>
              <SelectItem value="Appointment">Appointment</SelectItem>
              <SelectItem value="Educational Qualifications">Educational Qualifications</SelectItem>
              <SelectItem value="Learning & Development">Learning & Development</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="Service Records">Service Records</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
              <SelectItem value="Administrative">Administrative</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Employee Search */}
        {/* Employee Search */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-slate-700">Assign to Employee (optional)</label>

          <Input
            placeholder="Type to search..."
            value={employeeQuery}
            onChange={(e) => setEmployeeQuery(e.target.value)}
          />

          {employeeQuery && filteredEmployees.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-300 rounded shadow-md z-50">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp.employeeId}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setEmployeeQuery(emp.fullName);
                  }}
                >
                  {emp.fullName}
                </li>
              ))}
            </ul>
          )}

          {selectedEmployee && <p className="text-xs text-slate-500 mt-1">Assigned to: {selectedEmployee.fullName}</p>}
        </div>

        {/* Drag & Drop */}
        <div
          onDrop={(e) => {
            e.preventDefault();
            handleFilesAdded(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <p className="text-slate-500 text-sm mb-2">Drag & drop files here</p>
          <p className="text-slate-400 text-xs">or click to browse</p>
          <input
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
            className="hidden"
            ref={fileInputRef}
          />
        </div>

        {/* File Queue */}
        {selectedFiles.length > 0 && (
          <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center border border-slate-200 p-2 rounded-lg bg-slate-50"
              >
                <span className="text-slate-700 truncate">{file.name}</span>
                <button
                  className="text-red-600 font-bold hover:text-red-800 transition-colors"
                  onClick={() => removeFile(index)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || !category}>
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
