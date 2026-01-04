import JSZip from "jszip";
import type { FileRecord } from "@/types/Files";
import type { Employee } from "@/types/Employee";

/**
 * Download all files as a ZIP, organized by employee fullName
 */
export async function downloadAllFiles(files: FileRecord[], employees: Employee[]) {
  if (!files.length) {
    alert("No files to download.");
    return;
  }

  const zip = new JSZip();
  const rootFolder = zip.folder("School_Records");
  if (!rootFolder) return;

  // Map employeeId → fullName
  const empMap = new Map<string, string>();
  employees.forEach((emp) => empMap.set(emp.employeeId, emp.fullName));

  for (const file of files) {
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();

      // Folder per employee (fullName) or fallback to 'Unassigned'
      const employeeName: string = empMap.get(file.employeeId || "") ?? "Unassigned";
      const employeeFolder = rootFolder.folder(employeeName);
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
