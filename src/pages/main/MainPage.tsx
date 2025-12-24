import { useState, useEffect } from "react";

import MainContent from "../../components/homepage/MainContent";
import Sidebar from "@/app/layouts/Sidebar";
import { NavBar } from "@/app/layouts/Navbar";
import { RightBar } from "@/app/layouts/Rightbar";
import FileUploadModal from "@/components/homepage/AddRecordModal";
import UpdateRecordModal from "@/components/homepage/UpdateRecordModal";

import { useAuth } from "../../context/AuthContext";
import type { FileRecord } from "@/types/Files";
import { getFiles, deleteFile } from "@/services/file.services";

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();

  const [signupModal, setSignupModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<FileRecord | null>(null);

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
    const data = await getFiles();
    setFiles(data);
    setLoading(false);
  };

  useEffect(() => {
    try {
      console.log("Logged in User: ", user);
      fetchFiles();
    } catch (err) {
      console.error("Error Spotted", err);
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onClick={() => setShowModal(true)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />

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
              onUpdateClick={handleOpenUpdateModal} // new prop
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
