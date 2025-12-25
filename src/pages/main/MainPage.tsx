import { useState, useEffect } from "react";

import MainContent from "../../components/homepage/MainContent";
import Sidebar from "@/app/layouts/Sidebar";
import { NavBar } from "@/app/layouts/Navbar";
import { RightBar } from "@/app/layouts/Rightbar";

import FileUploadModal from "@/components/modals/AddRecordModal";
import UpdateRecordModal from "@/components/modals/UpdateRecordModal";
import CreateUserModal from "@/components/modals/CreateUserModal";
import HelpModal from "@/components/modals/HelpModal";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useToast } from "@/components/general/Toast";

import { useAuth } from "../../context/AuthContext";
import type { FileRecord } from "@/types/Files";
import { getFiles, deleteFile } from "@/services/file.services";

type ModalType = "addRecord" | "updateRecord" | "createUser" | "help" | null;

export default function MainPage() {
  const { addToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Files & selected file
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<FileRecord | null>(null);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Single modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // --- File Handlers ---
  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      addToast(`Error fetching files: ${err}`, "error");
    } finally {
      setFilesLoading(false);
    }
  };

  const handleFileClick = (file: FileRecord) => {
    setSelectedFile(file);
    setShowDetails(true);
  };

  const handleFileUploaded = (newFiles: FileRecord[]) => {
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const handleUpdateFile = (updatedFile: FileRecord) => {
    setFiles((prev) => prev.map((f) => (f.fileId === updatedFile.fileId ? updatedFile : f)));
  };

  const handleFileDelete = async (file: FileRecord) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFile(file);
      setFiles((prev) => prev.filter((f) => f.fileId !== file.fileId));
      addToast("Record deleted!", "error");
    } catch (err) {
      console.error("Cannot delete file:", err);
      addToast("Failed to delete record.", "error");
    }
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  if (authLoading || filesLoading) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center animate-fadeIn">
        <LoadingSpinner label={authLoading ? "Checking authentication..." : "Loading school records..."} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onClick={() => setActiveModal("addRecord")}
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onHelpModal={() => setActiveModal("help")}
      />

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar
          userData={user}
          onBurgerClick={() => setSidebarOpen(true)}
          onCreateUser={() => setActiveModal("createUser")}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main scrollable table */}
          <MainContent files={files} selectedFile={selectedFile} onFileClick={handleFileClick} />

          {/* Right sidebar */}
          {showDetails && selectedFile && (
            <RightBar
              selectedFile={selectedFile}
              onClose={() => setShowDetails(false)}
              onDeleteFile={handleFileDelete}
              onUpdateClick={(file) => {
                setFileToUpdate(file);
                setActiveModal("updateRecord");
              }}
            />
          )}

          {/* --- MODALS --- */}
          {activeModal === "addRecord" && user && (
            <FileUploadModal onClose={() => setActiveModal(null)} user={user} onUploaded={handleFileUploaded} />
          )}

          {activeModal === "updateRecord" && fileToUpdate && (
            <UpdateRecordModal file={fileToUpdate} onClose={() => setActiveModal(null)} onUpdate={handleUpdateFile} />
          )}

          {activeModal === "createUser" && <CreateUserModal onClose={() => setActiveModal(null)} isOpen={true} />}

          {activeModal === "help" && <HelpModal onClose={() => setActiveModal(null)} />}
        </div>
      </div>
    </div>
  );
}
