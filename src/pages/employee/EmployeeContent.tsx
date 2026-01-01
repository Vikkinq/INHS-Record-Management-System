import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "@/services/employee.services";
import type { Employee } from "@/types/Employee";
import EmployeeTable from "./EmployeeTable";

const PAGE_SIZE = 30;

export default function EmployeeContent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"fullName" | "sex" | "employmentStatus" | "createdAt">("fullName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };
    fetchEmployees();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = [...employees];
    if (category) filtered = filtered.filter((e) => e.employmentStatus === category);
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((e) => e.fullName?.toLowerCase().includes(lower));
    }

    filtered.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";
      switch (sortBy) {
        case "createdAt":
          valA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
          valB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
          break;
        case "employmentStatus":
          valA = a.positionTitle?.toLowerCase() ?? "";
          valB = b.positionTitle?.toLowerCase() ?? "";
          break;
        case "sex":
          valA = a.positionTitle?.toLowerCase() ?? "";
          valB = b.positionTitle?.toLowerCase() ?? "";
          break;
        default:
          valA = a.fullName?.toLowerCase() ?? "";
          valB = b.fullName?.toLowerCase() ?? "";
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, search, category, sortBy, sortDir]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val);
    setPage(1);
  };

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    navigate(`/employee/${employee.employeeId}`);
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
              className="w-full md:w-lg rounded-lg border px-3 py-2 text-sm"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "fullName" | "sex" | "employmentStatus" | "createdAt")}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="fullName">Sort by Name</option>
              <option value="sex">Sort by Sex</option>
              <option value="employmentStatus">Sort by Employment Status</option>
              <option value="createdAt">Sort by Date</option>
            </select>

            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            <select
              value={category}
              onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">All Employment Status</option>
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="border rounded-lg overflow-x-auto bg-white">
          <table className="w-full min-w-150">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Employee ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Employment Status</th>
              </tr>
            </thead>
            <EmployeeTable employeeData={paginatedData} onRowClick={handleRowClick} />
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
