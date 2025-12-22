import { X, Users, Star, Trash2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileRecord } from "@/types/Files";
import { canEditFile } from "@/utils/file.utils";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/general.utils";

type RightBarProps = {
  selectedFile: FileRecord | null;
  onClose: () => void;
  onDeleteFile: (file: FileRecord) => void;
  onUpdateClick: (file: FileRecord) => void;
};

export function RightBar({ selectedFile, onClose, onDeleteFile, onUpdateClick }: RightBarProps) {
  const { user } = useAuth();

  if (!selectedFile) return null;

  const canEdit = user && canEditFile(selectedFile, user);

  return (
    <aside className="w-80 border-l border-gray-300 bg-white overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
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
            <h3 className="font-semibold text-base mb-1">{selectedFile.fileName}</h3>
            <p className="text-sm text-gray-500 capitalize">folder</p>
          </div>

          {/* File Info */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="font-medium capitalize">{selectedFile.fileType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Size</span>
              <span className="font-medium">{(selectedFile.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Owner</span>
              <span className="font-medium">{selectedFile.uploadedBy}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Modified</span>
              <span className="font-medium">{formatDate(selectedFile.uploadedAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-300">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Users className="w-4 h-4" />
              Download
            </Button>

            {canEdit && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => selectedFile && onUpdateClick(selectedFile)}
              >
                <Star className="w-4 h-4" />
                Update File
              </Button>
            )}

            {canEdit && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-600 bg-transparent"
                onClick={() => selectedFile && onDeleteFile(selectedFile)}
              >
                <Trash2 className="w-4 h-4" />
                Remove File
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
