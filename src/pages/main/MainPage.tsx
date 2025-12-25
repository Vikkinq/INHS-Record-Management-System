import { useState, useEffect } from "react";

import MainContent from "../../components/homepage/MainContent";
import Sidebar from "@/app/layouts/Sidebar";
import { NavBar } from "@/app/layouts/Navbar";
import { RightBar } from "@/app/layouts/Rightbar";
import FileUploadModal from "@/components/homepage/AddRecordModal";
import UpdateRecordModal from "@/components/homepage/UpdateRecordModal";
import LoadingSpinner from "@/components/general/LoadingSpinner";

import { useAuth } from "../../context/AuthContext";
import type { FileRecord } from "@/types/Files";
import { getFiles, deleteFile } from "@/services/file.services";

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const [signupModal, setSignupModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<FileRecord | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false); // <-- new

  if (authLoading) {
    return <LoadingSpinner label="Checking authentication..." />;
  }

  const handleOpenUpdateModal = (file: FileRecord) => {
    setFileToUpdate(file);
    setShowUpdateModal(true);
  };

  const handleFileUploaded = (newFile: FileRecord[]) => {
    setFiles((prev) => [...newFile, ...prev]);
  };

  const handleUpdateFile = (updatedFile: FileRecord) => {
    setFiles((prev) => prev.map((f) => (f.fileId === updatedFile.fileId ? updatedFile : f)));
  };

  const handleFileClick = (file: FileRecord) => {
    setSelectedFile(file);
    setShowDetails(true);
  };

  const handleFileDelete = async (file: FileRecord) => {
    try {
      if (!window.confirm("Are you sure you want to delete this file?")) return;

      await deleteFile(file); // deletes from Storage + Firestore

      setFiles((prev) => prev.filter((f) => f.fileId !== file.fileId));
    } catch (err) {
      console.error("Cannot delete file:", err);
    }
  };

  const fetchFiles = async () => {
    setFilesLoading(true);
    const data = await getFiles();
    setFiles(data);
    setFilesLoading(false);
  };

  useEffect(() => {
    try {
      console.log("Logged in User: ", user);
      fetchFiles();
    } catch (err) {
      console.error("Error Spotted", err);
    }
  }, [user]);

  if (filesLoading) {
    return (
      <div className="absolute inset-0 z-20">
        <LoadingSpinner label="Loading employee records..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}

      <Sidebar
        onClick={() => setShowModal(true)}
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar userData={user} onBurgerClick={() => setSidebarOpen(true)} onCreateUser={() => setSignupModal(true)} />
        {showModal && user && (
          <FileUploadModal onClose={() => setShowModal(false)} user={user} onUploaded={handleFileUploaded} />
        )}
        <div className="flex-1 flex overflow-hidden">
          {/* Main content scrollable */}
          <MainContent files={files} selectedFile={selectedFile} onFileClick={handleFileClick} />

          {/* Right sidebar fixed width */}
          {showDetails && selectedFile && (
            <RightBar
              selectedFile={selectedFile}
              onClose={() => setShowDetails(false)}
              onDeleteFile={handleFileDelete}
              onUpdateClick={handleOpenUpdateModal}
            />
          )}

          {showUpdateModal && fileToUpdate && (
            <UpdateRecordModal
              file={fileToUpdate}
              onClose={() => setShowUpdateModal(false)}
              onUpdate={handleUpdateFile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
