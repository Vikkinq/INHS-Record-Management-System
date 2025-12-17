export interface FileRecord {
  fileId: string;
  employeeId: string;
  fileName: string;
  fileType: FileType;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  createdAt: Date;
}

export type FileType = "pdf" | "docx" | "doc" | "other";
