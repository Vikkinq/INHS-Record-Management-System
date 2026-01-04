import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

import MainContent from "../../components/homepage/MainContent";
import Sidebar from "@/app/layouts/Sidebar";
import { NavBar } from "@/app/layouts/Navbar";
import { RightBar } from "@/app/layouts/Rightbar";
import EmployeeContent from "../employee/EmployeeContent";
import type { Employee } from "@/types/Employee";

import { FilePreview } from "@/app/layouts/Preview/FilePreview";
import EmployeePreview from "@/app/layouts/Preview/EmployeePreview";

import FileUploadModal from "@/components/modals/AddRecordModal";
import UpdateRecordModal from "@/components/modals/UpdateRecordModal";
import CreateUserModal from "@/components/modals/CreateUserModal";
import HelpModal from "@/components/modals/HelpModal";
import CreateEmployeeModal from "@/components/modals/CreateEmployeeModal";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useToast } from "@/components/general/Toast";

import { useAuth } from "../../context/AuthContext";
import type { FileRecord } from "@/types/Files";
import { getFiles, deleteFile } from "@/services/file.services";
import { downloadAllFiles } from "@/services/download.services";

import { getEmployees } from "@/services/employee.services";

type ModalType = "addRecord" | "updateRecord" | "createUser" | "help" | "createEmployee" | null;
type RightBarView = { type: "file"; data: FileRecord } | { type: "employee"; data: Employee } | null;

export default function MainPage() {
  const { addToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Files & selected file
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [fileToUpdate, setFileToUpdate] = useState<FileRecord | null>(null);

  const [activeView, setActiveView] = useState<"files" | "employees">("employees");
  const [rightBar, setRightBar] = useState<RightBarView>(null);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recordFilter, setRecordFilter] = useState<"all" | "mine" | "recent">("all");
  const [allFiles, setAllFiles] = useState<FileRecord[]>([]);

  // Single modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // --- File Handlers ---
  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const data = await getFiles();
      setAllFiles(data);
      setFiles(data);
    } catch (err) {
      addToast(`Error fetching files: ${err}`, "error");
    } finally {
      setFilesLoading(false);
    }
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

  const handleDownloadAll = async () => {
    if (!window.confirm("Download all files?")) return;

    try {
      const employees = await getEmployees(); // fetch employee list
      await downloadAllFiles(files, employees); // pass employees for folder mapping
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download files.");
    }
  };

  // const toggleView = () => {
  //   setActiveView((prev) => (prev === "files" ? "employees" : "files"));
  // };

  const handleEmployeeClick = (employee: Employee) => {
    setRightBar({ type: "employee", data: employee });
  };

  const handleFilesClick = (file: FileRecord) => {
    setRightBar({ type: "file", data: file });
    setSelectedFile(file); // May be a Bug idk..
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (recordFilter === "all") setFiles(allFiles);
      if (recordFilter === "mine") setFiles(allFiles.filter((f) => f.uploadedBy === user?.email));
    }
  }, [recordFilter, allFiles, user]);

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
        setRecordFilter={setRecordFilter}
        onToggleView={setActiveView}
        activeView={activeView}
        onDownloadAll={handleDownloadAll}
      />

      {/* Mobile overlay for sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar
          userData={user}
          onBurgerClick={() => setSidebarOpen(true)}
          onCreateUser={() => setActiveModal("createUser")}
          onCreateEmployee={() => setActiveModal("createEmployee")}
          rightBar={rightBar}
        />

        {/* Main content + RightBar */}
        <div className={`flex-1 flex overflow-hidden transition-all duration-300 ${rightBar ? "md:mr-80" : ""}`}>
          {/* Main scrollable table */}
          <div className="flex-1 overflow-auto">
            {activeView === "files" && (
              <MainContent files={files} selectedFile={selectedFile} onFileClick={handleFilesClick} />
            )}

            {activeView === "employees" && <EmployeeContent onEmployeeClick={handleEmployeeClick} />}
          </div>

          {/* Right sidebar */}
          {rightBar && (
            <RightBar
              isOpen={!!rightBar}
              onClose={() => setRightBar(null)}
              title={rightBar.type === "file" ? "File Details" : "Employee Overview"}
              icon={rightBar.type === "file" ? null : <Users className="w-10 h-10 text-blue-500" />}
            >
              {rightBar.type === "file" && (
                <FilePreview
                  file={rightBar.data}
                  onDelete={handleFileDelete}
                  onUpdate={(file) => {
                    setFileToUpdate(file);
                    setActiveModal("updateRecord");
                  }}
                />
              )}

              {rightBar.type === "employee" && (
                <EmployeePreview
                  employee={rightBar.data}
                  onSeeProfile={() => navigate(`/employee/${rightBar.data.employeeId}`)}
                  onSeeFiles={() => navigate(`/employee/${rightBar.data.employeeId}/files`)}
                />
              )}
            </RightBar>
          )}
        </div>

        {/* --- MODALS --- */}
        {activeModal === "addRecord" && user && (
          <FileUploadModal onClose={() => setActiveModal(null)} userId={user.uid} onUploaded={handleFileUploaded} />
        )}

        {activeModal === "updateRecord" && fileToUpdate && (
          <UpdateRecordModal file={fileToUpdate} onClose={() => setActiveModal(null)} onUpdate={handleUpdateFile} />
        )}

        {activeModal === "createUser" && <CreateUserModal onClose={() => setActiveModal(null)} isOpen={true} />}

        {activeModal === "help" && <HelpModal onClose={() => setActiveModal(null)} />}

        {activeModal === "createEmployee" && <CreateEmployeeModal onClose={() => setActiveModal(null)} isOpen={true} />}
      </div>
    </div>
  );
}
