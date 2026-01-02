import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type RightBarProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
};

export function RightBar({ isOpen, onClose, title = "Details", icon, children }: RightBarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {onClose && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      <aside
        className="
      fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-300 z-50
      transform transition-transform duration-300
      md:w-80 md:block
    "
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">{title}</h2>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Optional Icon */}
          {icon && (
            <div className="flex justify-center py-6">
              <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">{icon}</div>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
        </div>
      </aside>
    </>
  );
}
