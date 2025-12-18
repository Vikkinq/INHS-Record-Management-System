import { X, Users, Star, Trash2, FolderPlus, FileText, ImageIcon, Video, Music, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RightBar() {
  return (
    <aside className="w-80 border-l border-gray-300 bg-white overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <Button variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* File Icon */}
          <div className="flex justify-center py-6">
            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
              <FolderPlus className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          {/* File Name */}
          <div>
            <h3 className="font-semibold text-base mb-1">Sample File</h3>
            <p className="text-sm text-gray-500 capitalize">folder</p>
          </div>

          {/* File Info */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="font-medium capitalize">folder</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Size</span>
              <span className="font-medium">2 MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Owner</span>
              <span className="font-medium">John Doe</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Modified</span>
              <span className="font-medium">2024-12-18</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shared</span>
              <span className="font-medium">Yes</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-300">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Users className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Star className="w-4 h-4" />
              Add to Starred
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-600 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
              Move to Trash
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
