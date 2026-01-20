import type { FileRecord } from "@/types/Files";
import { formatFileSize } from "@/utils/file.utils";
import { formatDate } from "@/utils/general.utils";

type EmployeeFilesTableListProps = {
  paginatedData: FileRecord[];
  onFileClick: (file: FileRecord) => void;
};

export default function EmployeeFilesTableList({ paginatedData, onFileClick }: EmployeeFilesTableListProps) {
  return (
    <>
      {paginatedData.map((file) => (
        <tr
          key={file.fileId}
          onClick={() => onFileClick(file)}
          className="cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
        >
          <td className="px-6 py-3 font-medium text-gray-900">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              </svg>
              {file.fileName}
            </div>
          </td>
          <td className="px-6 py-3 text-gray-600 uppercase text-xs font-medium">{file.category}</td>
          <td className="px-6 py-3 text-gray-600 uppercase text-xs font-medium">{file.fileType}</td>
          <td className="px-6 py-3 text-gray-600">{formatFileSize(file.fileSize)}</td>
          <td className="px-6 py-3 text-gray-600">{formatDate(file.createdAt)}</td>
        </tr>
      ))}
    </>
  );
}
