export interface FileRecord {
  fileId: string;
  employeeId?: string;
  userId?: string | null;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  fileUrl: string;
  storagePath: string;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  createdAt: Date;
}

export type FileType = "pdf" | "docx" | "doc";
