export interface FileRecord {
  fileId: string; // Firestore auto-generated ID
  employeeId: string; // reference to Employee
  fileName: string;
  fileType: FileType;
  fileUrl: string; // Supabase Storage URL
  uploadedBy: string; // AppUser.uid
  uploadedAt: Date;
  createdAt: Date;
}

export type FileType = "pdf" | "docx" | "doc" | "other";
