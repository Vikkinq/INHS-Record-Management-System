import { useState, useEffect } from "react";
import { updateFile } from "@/services/file.services";
import type { FileRecord } from "@/types/Files";

import LoadingSpinner from "@/app/layouts/LoadingSpinner";

interface UpdateRecordModalProps {
  file: FileRecord; // Existing file to update
  onClose: () => void;
  onUpdate: (updatedFile: FileRecord) => void; // callback to update state in parent
}

export default function UpdateRecordModal({ file, onClose, onUpdate }: UpdateRecordModalProps) {
  const [fileName, setFileName] = useState(file.fileName || "");
  const [category, setCategory] = useState(file.category || "");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFileName(file.fileName || "");
    setCategory(file.category || "");
  }, [file]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updatedData: Partial<FileRecord> = { fileName, category };

      await updateFile(file.fileId, updatedData);

      // Update parent state
      onUpdate({ ...file, ...updatedData });

      setLoading(false);
      onClose();
    } catch (err) {
      console.error("Error updating file:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {loading && <LoadingSpinner label="Updating file..." />}

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Update File</h2>
          <p className="text-sm text-slate-500 mt-1">Update file name or category</p>
        </div>

        {/* File Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-slate-700">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Actions */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={handleUpdate}
            disabled={!fileName || !category}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
