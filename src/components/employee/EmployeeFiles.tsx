import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RightBar } from "@/app/layouts/Rightbar";

import EmployeeFilesList from "./EmployeeFilesList";

import type { Employee } from "@/types/Employee";
import { getEmployeeById, getFilesByEmployeeId } from "@/services/employee.services";
import type { FileRecord } from "@/types/Files";
import LoadingSpinner from "../general/LoadingSpinner";
import { EmployeeFilesNavbar } from "@/app/layouts/EmployeeNavbar";

import { FilePreview } from "@/app/layouts/Preview/FilePreview";
import UploadEmployeeFileModal from "../modals/UploadEmployeeFileModal";
import UpdateRecordModal from "../modals/UpdateRecordModal";
import { deleteFile } from "@/services/file.services";
import { useToast } from "../general/Toast";

export default function EmployeeFiles() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [files, setFiles] = useState<FileRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [updateFileModal, setUpdateFileModal] = useState(false);

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployeeAndFiles = async () => {
      try {
        setLoading(true);

        const emp = await getEmployeeById(employeeId);
        setEmployee(emp);

        const empFiles = await getFilesByEmployeeId(employeeId);
        setFiles(empFiles);
      } catch (err) {
        console.error("Error fetching employee or files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAndFiles();
  }, [employeeId]);

  const handleUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleUploaded = async () => {
    const updatedFiles = await getFilesByEmployeeId(employeeId!);
    setFiles(updatedFiles);
  };

  const handleFileDelete = async (file: FileRecord) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await deleteFile(file);
      setFiles((prev) => prev.filter((f) => f.fileId !== file.fileId));
      addToast("Record deleted!", "error");

      // Close preview if deleted file is active
      if (selectedFile?.fileId === file.fileId) setSelectedFile(null);
    } catch (err) {
      console.error("Cannot delete file:", err);
      addToast("Failed to delete record.", "error");
    }
  };

  if (loading) return <LoadingSpinner label="Loading employee files..." />;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <EmployeeFilesNavbar employee={employee} onBack={() => navigate(-1)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-full">
            {/* Header Section with Upload Button */}
            <div className="px-6 py-6 bg-white border-b">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{files.length} Files</h1>
                  <p className="text-gray-600 mt-1">
                    {employee?.fullName} - {employee?.positionTitle}
                  </p>
                </div>
                <button
                  onClick={handleUploadModal}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload File
                </button>
              </div>
            </div>

            {/* Files Table */}
            <EmployeeFilesList files={files} onFileClick={setSelectedFile} />
          </div>
        </div>

        {/* RightBar */}
        <RightBar isOpen={!!selectedFile} onClose={() => setSelectedFile(null)} title="File Details">
          {selectedFile && (
            <FilePreview file={selectedFile} onDelete={handleFileDelete} onUpdate={() => setUpdateFileModal(true)} />
          )}
        </RightBar>
      </div>
      // Modal toggle
      {updateFileModal && selectedFile && (
        <UpdateRecordModal
          file={selectedFile}
          onClose={() => setUpdateFileModal(false)}
          onUpdate={(updatedFile) => {
            // optional: update local state if needed
            setFiles((prev) => prev.map((f) => (f.fileId === updatedFile.fileId ? updatedFile : f)));
            setSelectedFile(updatedFile);
          }}
        />
      )}
      {showUploadModal && employeeId && (
        <UploadEmployeeFileModal
          employeeId={employeeId}
          onClose={() => setShowUploadModal(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  );
}
