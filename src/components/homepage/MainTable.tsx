import type { FileRecord } from "@/types/Files";
import { formatDate } from "@/utils/general.utils";

interface MainTableProps {
  files: FileRecord[];
  onSelectFile: FileRecord | null;
  onFileClick: (file: FileRecord) => void;
}

export default function MainTable({ files, onSelectFile, onFileClick }: MainTableProps) {
  return (
    <tbody>
      {files.map((f) => (
        <tr
          key={f.fileId}
          className={`cursor-pointer border-t hover:bg-muted/50 transition-colors ${
            onSelectFile?.fileId === f.fileId ? "bg-primary/10" : ""
          }`}
          onClick={() => onFileClick(f)}
        >
          <td className="px-4 py-3">{f.fileName}</td>
          <td className="px-4 py-3">{f.uploadedBy}</td>
          <td className="px-4 py-3">{formatDate(f.uploadedAt)}</td>
          <td className="px-4 py-3">{f.category}</td>
          <td className="px-4 py-3">{f.fileType}</td>
          <td>{(f.fileSize / (1024 * 1024)).toFixed(2)} MB</td>
        </tr>
      ))}
    </tbody>
  );
}
