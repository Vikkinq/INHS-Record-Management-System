import { useState, useRef } from "react";
import { uploadFile } from "../../services/file.services";
import { getFileType } from "../../utils/file.utils";

interface FileUploadModalProps {
  onClose: () => void;
  user: { uid: string; displayName?: string | null; email: string }; // Auth user type
}

export default function FileUploadModal({ onClose, user }: FileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (files: FileList) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!user) return;
    for (const file of selectedFiles) {
      try {
        await uploadFile(file, {
          employeeId: user.uid, // reference employee
          uploadedBy: user.displayName || user.email, // current user
          fileName: file.name, // file name from frontend
          fileType: getFileType(file), // convert MIME to "pdf", "doc", etc
        });
      } catch (err) {
        console.error(err);
      }
    }

    setSelectedFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Upload Files</h2>

        {/* Drag & drop / click */}
        <div
          onDrop={(e) => {
            e.preventDefault();
            handleFilesAdded(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-slate-300 p-6 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          Drag & drop files here or click to browse
          <input
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
            className="hidden"
            ref={fileInputRef}
          />
        </div>

        {/* File queue */}
        <ul className="mt-4 space-y-2 max-h-40 overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <li key={index} className="flex justify-between items-center border p-2 rounded">
              <span>{file.name}</span>
              <button className="text-red-600 font-bold" onClick={() => removeFile(index)}>
                X
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex justify-end mt-4">
          <button className="mr-2 text-slate-500" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
