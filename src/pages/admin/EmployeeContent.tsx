import { useState, useEffect, useMemo } from "react";
import { getAllUsers } from "@/services/user.services";
import type { UserProfile } from "@/types/User";
import EmployeeTable from "./EmployeeTable";

const PAGE_SIZE = 30;

function getTimestamp(ts: any) {
  if (!ts) return 0;
  return ts.toDate ? ts.toDate().getTime() : new Date(ts).getTime();
}

export default function EmployeeContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(""); // role filter
  const [sortBy, setSortBy] = useState<"role" | "fullName" | "createdAt">("role");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [userData, setUserData] = useState<UserProfile[]>([]);

  // ----- Fetch users -----
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUserData(users);
      } catch (err) {
        console.error("Error fetching Users", err);
      }
    };

    fetchUsers();
  }, []);

  // ----- Filter + Search + Sort -----
  const filteredData = useMemo(() => {
    let filtered = [...userData];

    // Filter by role
    if (category) {
      filtered = filtered.filter((u) => u.role === category);
    }

    // Search by full name
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((u) => u.fullName?.toLowerCase().startsWith(lower));
    }

    // Sort
    filtered.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sortBy) {
        case "createdAt":
          valA = getTimestamp(a.createdAt);
          valB = getTimestamp(b.createdAt);
          break;
        case "fullName":
          valA = a.fullName?.toLowerCase() ?? "";
          valB = b.fullName?.toLowerCase() ?? "";
          break;
        default:
          valA = a.role;
          valB = b.role;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [userData, search, category, sortBy, sortDir]);

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
          <h1 className="text-xl font-bold text-slate-800">Employees ({totalItems})</h1>

          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Search name..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
              className="w-full md:w-64 rounded-lg border px-3 py-2 text-sm"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "role" | "fullName" | "createdAt")}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="role">Sort by Role</option>
              <option value="fullName">Sort by Name</option>
              <option value="createdAt">Sort by Created</option>
            </select>

            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <select
              value={category}
              onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">All Roles</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="border rounded-lg overflow-x-auto bg-white">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">UID</th>
                <th className="px-4 py-3 text-left">Fullname</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>

            <EmployeeTable userDatas={paginatedData} />
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 px-4 py-3 border-t text-sm">
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
