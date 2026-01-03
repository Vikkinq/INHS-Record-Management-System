import { useRef, useState } from "react";
import { uploadFile } from "@/services/file.services";
import { getFileType, isValidFileType } from "@/utils/file.utils";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface UploadEmployeeFileModalProps {
  employeeId: string;
  onClose: () => void;
  onUploaded: () => void;
}

export default function UploadEmployeeFileModal({ employeeId, onClose, onUploaded }: UploadEmployeeFileModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();

  const [category, setCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  function handleFilesAdded(files: FileList) {
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const incoming = Array.from(files).filter((f) => !existing.has(f.name));
      return [...prev, ...incoming];
    });
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    try {
      setUploading(true);

      for (const file of selectedFiles) {
        if (!isValidFileType(file)) {
          alert(`Invalid file type: ${file.name}`);
          continue;
        }

        await uploadFile(file, {
          employeeId, // 🔥 FROM useParams
          fileName: file.name,
          fileType: getFileType(file),
          category,
          uploadedBy: user?.email || "Unknown", // or user.fullName if you want
        });
      }

      onUploaded();
      setSelectedFiles([]);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Upload Employee Files</h2>

        {/* Category */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Category</label>
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
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
          />
        </div>

        {/* File Queue */}
        {selectedFiles.length > 0 && (
          <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center border border-slate-200 p-2 rounded-lg bg-slate-50"
              >
                <span className="text-slate-700 truncate">{file.name}</span>
                <button className="text-red-600 font-bold hover:text-red-800" onClick={() => removeFile(index)}>
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
