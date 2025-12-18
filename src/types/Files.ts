export interface FileRecord {
  fileId: string;
  employeeId: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  fileUrl: string;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  createdAt: Date;
}

export type FileType = "pdf" | "docx" | "doc";
