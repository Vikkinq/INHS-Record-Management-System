import type { FileRecord } from "@/types/Files";

interface MainTableProps {
  files: FileRecord[];
  onSelectFile?: (file: FileRecord) => void;
}

export default function MainTable({ files }: MainTableProps) {
  return (
    <tbody>
      {files.map((f) => (
        <tr key={f.fileId} className="border-t hover:bg-slate-50">
          <td className="px-4 py-3">{f.fileName}</td>
          <td className="px-4 py-3">{f.category}</td>
          <td className="px-4 py-3">{f.fileType}</td>
          <td className="px-4 py-3">{f.uploadedBy}</td>
          <td className="px-4 py-3">{new Date(f.uploadedAt).toLocaleDateString()}</td>
          <td className="px-4 py-3 text-center space-x-2">
            <button className="text-blue-600 hover:underline">View</button>
            <button className="text-amber-600 hover:underline">Edit</button>
            <button className="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
