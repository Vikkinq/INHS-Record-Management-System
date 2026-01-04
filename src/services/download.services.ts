import JSZip from "jszip";
import type { FileRecord } from "@/types/Files";

/**
 * Download all files as a ZIP
 * Prototype-safe version
 */
export async function downloadAllFiles(files: FileRecord[]) {
  if (!files.length) {
    alert("No files to download.");
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder("School_Records");

  if (!folder) return;

  for (const file of files) {
    try {
      const response = await fetch(file.fileUrl);
      const blob = await response.blob();

      // Folder per employee (optional but clean)
      const employeeFolder = folder.folder(file.employeeId || "Unassigned");

      employeeFolder?.file(file.fileName, blob);
    } catch (err) {
      console.error("Failed to fetch file:", file.fileName, err);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `School_Records_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
