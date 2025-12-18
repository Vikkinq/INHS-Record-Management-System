import { logout } from "../../services/auth.services";

import { Upload, File, Users, Clock, Star, Trash2, Settings, HelpCircle, HardDrive, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  onClick?: () => void; // optional function prop
  role?: "admin" | "staff";
};

export default function Sidebar({ onClick, role = "staff" }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">INHS</span>
        </div>
      </div>

      <div className="p-4">
        <Button
          className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onClick}
        >
          <Upload className="w-5 h-5" />
          New
        </Button>
      </div>

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

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <Button variant="outline" className="w-full justify-start gap-2 " onClick={logout}>
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
        <p className="mt-3 text-center text-xs text-slate-500">© {new Date().getFullYear()} School RMS</p>
      </div>
    </aside>
  );
}
