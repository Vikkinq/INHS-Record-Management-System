import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import FileUploadModal from "./AddRecordModal";
import type { FileRecord } from "@/types/Files";
import { getFiles } from "@/services/file.services";

import MainTable from "./MainTable";

export default function MainContent() {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
    <div className="flex-1 min-h-screen bg-slate-50">
      <main className="p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Employee Records (201 Files)</h1>

        {/* Modal */}
        {showModal && user && <FileUploadModal onClose={() => setShowModal(false)} user={user} />}

        {/* Employee Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">File Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Uploaded By</th>
                <th className="px-4 py-3 text-left">Date Created</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            {/* Main Table (tbody) */}
            <MainTable files={files} />
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-slate-600">Showing 1–30 of 120</span>
          <div className="space-x-2">
            <button className="rounded border px-3 py-1 hover:bg-slate-100 transition-colors">Prev</button>
            <button className="rounded border px-3 py-1 hover:bg-slate-100 transition-colors">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
