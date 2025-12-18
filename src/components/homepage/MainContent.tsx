import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import FileUploadModal from "./AddRecordModal";

export default function MainContent() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Logged in User: ", user);
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
                <th className="px-4 py-3 text-left">Employee Name</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Date Created</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">Juan Dela Cruz</td>
                <td className="px-4 py-3">Teacher</td>
                <td className="px-4 py-3">Science</td>
                <td className="px-4 py-3">2024-01-12</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="text-amber-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">Maria Santos</td>
                <td className="px-4 py-3">Registrar</td>
                <td className="px-4 py-3">Admin</td>
                <td className="px-4 py-3">2024-02-05</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="text-amber-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
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
