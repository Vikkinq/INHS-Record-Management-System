import { useState, useEffect } from "react";

import MainContent from "../../components/homepage/MainContent";
import Sidebar from "@/app/layouts/Sidebar";
import { NavBar } from "@/app/layouts/Navbar";
import { RightBar } from "@/app/layouts/Rightbar";
import FileUploadModal from "@/components/homepage/AddRecordModal";

import { useAuth } from "../../context/AuthContext";
import type { FileRecord } from "@/types/Files";
import { getFiles } from "@/services/file.services";

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();

  const handleFileClick = (file: FileRecord) => {
    setSelectedFile(file);
    setShowDetails(true);
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

        {showModal && user && <FileUploadModal onClose={() => setShowModal(false)} user={user} />}

        <div className="flex-1 flex overflow-hidden">
          {/* Main content scrollable */}
          <MainContent files={files} selectedFile={selectedFile} onFileClick={handleFileClick} />

          {/* Right sidebar fixed width */}
          {showDetails && <RightBar selectedFile={selectedFile} onClose={() => setShowDetails(false)} />}
        </div>
      </div>
    </div>
  );
}
