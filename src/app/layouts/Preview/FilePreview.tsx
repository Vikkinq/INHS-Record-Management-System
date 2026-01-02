import { Users, Star, Trash2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileRecord } from "@/types/Files";
import { canEditFile } from "@/utils/file.utils";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/general.utils";

type Props = {
  file: FileRecord;
  onDelete: (file: FileRecord) => void;
  onUpdate: (file: FileRecord) => void;
};

export function FilePreview({ file, onDelete, onUpdate }: Props) {
  const { user } = useAuth();
  const canEdit = user && canEditFile(file, user);

  console.log("file: ", file.userId);
  console.log("user: ", user?.uid);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* File Icon */}
        <div className="flex justify-center py-4">
          <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
            <FolderPlus className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        {/* File Info */}
        <div className="space-y-2 px-2">
          <h3 className="font-semibold text-center">{file.fileName}</h3>
          <Info label="Category" value={file.category} />
          <Info label="Type" value={file.fileType} />
          <Info label="Size" value={`${(file.fileSize / 1024 / 1024).toFixed(2)} MB`} />
          <Info label="Owner" value={file.uploadedBy} />
          <Info label="Uploaded" value={formatDate(file.uploadedAt)} />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t px-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => window.open(file.fileUrl, "_blank")}
        >
          <Users className="w-4 h-4" /> Download
        </Button>

        {canEdit && (
          <>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onUpdate(file)}>
              <Star className="w-4 h-4" /> Update File
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-600"
              onClick={() => onDelete(file)}
            >
              <Trash2 className="w-4 h-4" /> Remove File
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
