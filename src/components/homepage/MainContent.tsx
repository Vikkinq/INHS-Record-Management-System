import { useState, useMemo } from "react";
import MainTable from "./MainTable";
import type { FileRecord } from "@/types/Files";
import { getTimestamp } from "@/utils/general.utils";

type MainContentProps = {
  files: FileRecord[]; // always keep updated from parent
  selectedFile: FileRecord | null;
  onFileClick: (file: FileRecord) => void;
};

export default function MainContent({ files, selectedFile, onFileClick }: MainContentProps) {
  const PAGE_SIZE = 30;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "fileName">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // ----- Filter + Search + Sort -----
  const filteredData = useMemo(() => {
    let filtered = [...files];

    // Filter by category
    if (category) {
      filtered = filtered.filter((f) => f.category === category);
    }

    // Search by fileName (starts-with)
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((f) => f.fileName.toLowerCase().startsWith(lower));
    }

    // Sort
    filtered.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortBy === "createdAt") {
        valA = getTimestamp(a.createdAt);
        valB = getTimestamp(b.createdAt);
      } else {
        valA = a.fileName.toLowerCase();
        valB = b.fileName.toLowerCase();
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, search, category, sortBy, sortDir]);

  // ----- Pagination -----
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  // Reset page when filters/search change
  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val);
    setPage(1);
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3 md:gap-0">
          <h1 className="text-xl font-bold text-slate-800">Employee Records ({filteredData.length} Files)</h1>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mt-2 md:mt-0">
            <input
              type="text"
              placeholder="Search file name..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
              className="w-full md:w-64 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "createdAt" | "fileName")}
              className="w-full md:w-auto rounded-lg border px-3 py-2 text-sm"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="fileName">Sort by Name</option>
            </select>

            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
              className="w-full md:w-auto rounded-lg border px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <select
              value={category}
              onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
              className="w-full md:w-auto rounded-lg border px-3 py-2 text-sm"
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
        <div className="border rounded-lg overflow-x-auto bg-white">
          <table className="w-full min-w-150">
            {/* ensures horizontal scroll if needed */}
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Modified</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Size</th>
              </tr>
            </thead>
            <MainTable files={paginatedData} onSelectFile={selectedFile} onFileClick={onFileClick} />
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 px-4 py-3 border-t text-sm text-slate-600">
        <span>
          {totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of {totalItems}
        </span>

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
