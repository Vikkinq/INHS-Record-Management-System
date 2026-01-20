import { useState, useMemo } from "react";
import type { FileRecord } from "@/types/Files";
import { Search, Filter } from "lucide-react";

import EmployeeFilesTableList from "./EmployeeFilesTableList";

type EmployeeFilesProps = {
  files: FileRecord[];
  onFileClick: (file: FileRecord) => void;
};

const PAGE_SIZE = 30;

export default function EmployeeFilesList({ files, onFileClick }: EmployeeFilesProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"fileName" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    let data = files;

    if (search) {
      data = data.filter((f) => f.fileName.toLowerCase().includes(search.toLowerCase()));
    }

    if (category) {
      data = data.filter((f) => f.category === category);
    }

    data = data.sort((a, b) => {
      const aValue = sortBy === "fileName" ? a.fileName : a.createdAt;
      const bValue = sortBy === "fileName" ? b.fileName : b.createdAt;
      if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [files, search, category, sortBy, sortDir]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Page Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pr-80 flex flex-col min-h-screen">
        {/* Header */}
        <div className="pt-8 pb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Employee Files</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">File Management</h1>
        </div>

        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-white border-y border border-gray-200 rounded-3xl p-3">
          <div className="py-4 space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search file name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter:</span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "fileName" | "createdAt")}
                className="w-full sm:w-auto rounded-md border border-gray-200 px-3 py-2 text-sm bg-white
              focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="fileName">Sort by Name</option>
              </select>

              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
                className="w-full sm:w-auto rounded-md border border-gray-200 px-3 py-2 text-sm bg-white
              focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-auto rounded-md border border-gray-200 px-3 py-2 text-sm bg-white
              focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">All Categories</option>
                <option value="Personal Data">Personal Data</option>
                <option value="Appointment">Appointment</option>
                <option value="Educational Qualifications">Educational Qualifications</option>
                <option value="Learning & Development">Learning & Development</option>
                <option value="Performance">Performance</option>
                <option value="Service Records">Service Records</option>
                <option value="Medical">Medical</option>
                <option value="Administrative">Administrative</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 py-6 overflow-y-auto">
          {paginatedData.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
              <p className="text-sm text-gray-500 font-medium">No files found for this employee.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-225">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {["Name", "Category", "Type", "Size", "Date Modified"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-700"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <EmployeeFilesTableList paginatedData={paginatedData} onFileClick={onFileClick} />
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t rounded-xl border-gray-200 bg-white py-4 px-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm">
          <span className="text-gray-600 font-medium">
            {totalItems === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, totalItems)}`} of{" "}
            <span className="font-semibold text-gray-900">{totalItems}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
