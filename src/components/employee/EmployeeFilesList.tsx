import { useState, useMemo } from "react";
import type { FileRecord } from "@/types/Files";

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
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
            <input
              type="text"
              placeholder="Search file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "fileName" | "createdAt")}
              className="w-full md:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="fileName">Sort by Name</option>
            </select>

            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
              className="w-full md:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Report Card">Report Card</option>
              <option value="Transcript">Transcript</option>
              <option value="Certificate">Certificate</option>
              <option value="Enrollment">Enrollment</option>
              <option value="Medical">Medical</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {paginatedData.length === 0 ? (
          <p className="text-sm text-gray-500">No files found for this employee.</p>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-x-auto bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Owner</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Size</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Date Modified</th>
                </tr>
              </thead>

              <tbody>
                <EmployeeFilesTableList paginatedData={paginatedData} onFileClick={onFileClick} />
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-white text-sm text-gray-600">
        <span>
          {totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of {totalItems}
        </span>

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Prev
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>
    </main>
  );
}
