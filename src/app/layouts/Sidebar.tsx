import { logout } from "../../services/auth.services";
import { Upload, File, Users, Clock, Settings, HelpCircle, HardDrive, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  onClick?: () => void;
  role?: "admin" | "staff";
  isOpen?: boolean; // for mobile toggle
  onClose?: () => void; // close sidebar on mobile
};

export default function Sidebar({ onClick, role = "staff", isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
              <img
                src="https://live.staticflickr.com/5065/5732629600_f6f22b9816_n.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-semibold text-foreground">INHS</span>
          </div>
          {/* Close button for mobile */}
          <button className="md:hidden" onClick={onClose} aria-label="Close sidebar">
            ✕
          </button>
        </div>

        {/* New Button */}
        <div className="p-4">
          <Button
            className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onClick}
          >
            <Upload className="w-5 h-5" />
            New
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">All Drives</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
              <File className="w-5 h-5" />
              <span className="text-sm font-medium">My Drive</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Recent</span>
            </button>
          </div>

          <div className="border-t border-sidebar-border my-3" />

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Help</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
          <p className="mt-3 text-center text-xs text-slate-500">© {new Date().getFullYear()} School RMS</p>
        </div>
      </aside>
    </>
  );
}
