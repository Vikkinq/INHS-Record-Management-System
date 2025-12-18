import type { FileRecord } from "@/types/Files";
import MainTable from "./MainTable";

type MainContentProps = {
  files: FileRecord[]; // <-- type the prop
  selectedFile: FileRecord | null;
  onFileClick: (file: FileRecord) => void;
};

export default function MainContent({ files, selectedFile, onFileClick }: MainContentProps) {
  return (
    <div className="flex-1 min-h-screen bg-slate-50">
      <main className="p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Employee Records (201 Files)</h1>

        {/* Employee Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Modified</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Size</th>
              </tr>
            </thead>
            {/* Main Table (tbody) */}
            <MainTable files={files} onSelectFile={selectedFile} onFileClick={onFileClick} />
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-slate-600">Showing 1–30 of 120</span>
          <div className="space-x-2">
            <button className="rounded border px-3 py-1 hover:bg-slate-100 transition-colors">Prev</button>
            <button className="rounded border px-3 py-1 hover:bg-slate-100 transition-colors">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
