import { NavLink } from "react-router-dom";
import { logout } from "../../services/auth.services";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Employee Records", path: "/records" },
  { label: "Upload Files", path: "/upload" },
  { label: "Reports", path: "/reports" },
  { label: "Users", path: "/users", adminOnly: true },
];

interface SidebarProps {
  role?: "admin" | "staff";
}

export default function Sidebar({ role = "staff" }: SidebarProps) {
  return (
    <aside className="h-screen w-64 bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-lg font-bold tracking-wide">School RMS</h1>
        <p className="text-xs text-slate-400 mt-1">201 Files Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          if (item.adminOnly && role !== "admin") return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full rounded-lg bg-slate-800 py-2 text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">© {new Date().getFullYear()} School RMS</p>
      </div>
    </aside>
  );
}
