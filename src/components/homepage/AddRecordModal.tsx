import { useState, useRef } from "react";
import { uploadFile } from "../../services/file.services";
import { getFileType } from "../../utils/file.utils";
import type { FileRecord } from "@/types/Files";
import LoadingSpinner from "@/components/general/LoadingSpinner";

import { isValidFileType } from "../../utils/file.utils";

interface FileUploadModalProps {
  onClose: () => void;
  user: { uid: string; displayName?: string | null; email: string }; // Auth user type
  onUploaded: (file: FileRecord[]) => void;
}

export default function FileUploadModal({ onClose, user, onUploaded }: FileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>(""); // default can be empty or "Other"

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (files: FileList) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!user) return;
    setLoading(true);
    const uploaded: FileRecord[] = [];
    for (const file of selectedFiles) {
      try {
        if (!isValidFileType(file)) {
          alert(`Invalid file type: ${file.name}`);
          continue;
        }

        const newFile = await uploadFile(file, {
          employeeId: user.uid, // reference employee
          uploadedBy: user.displayName || user.email, // current user
          fileName: file.name, // file name from frontend
          fileType: getFileType(file), // convert MIME to "pdf", "doc", etc
          category,
        });

        uploaded.push(newFile);
      } catch (err) {
        console.error(err);
      }
    }

    setLoading(false);
    onUploaded(uploaded);
    setSelectedFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {loading && <LoadingSpinner label="Uploading file..." />}

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg">
        {/* Header */}

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Upload Files</h2>
          <p className="text-sm text-slate-500 mt-1">Drag & drop files or browse from your device</p>
        </div>

        {/* Category Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="Report Card">Report Card</option>
            <option value="Transcript">Transcript</option>
            <option value="Certificate">Certificate</option>
            <option value="Enrollment">Enrollment</option>
            <option value="Medical">Medical</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Drag & Drop / Click Area */}
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

        {/* Selected File Queue */}
        {selectedFiles.length > 0 && (
          <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
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
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || !category}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
