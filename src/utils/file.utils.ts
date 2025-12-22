import type { FileType, FileRecord } from "../types/Files";
import type { UserProfile } from "@/types/User";

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE_BYTES;
};

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const isValidFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

export const getFileType = (file: File): FileType => {
  switch (file.type) {
    case "application/pdf":
      return "pdf";
    case "application/msword":
      return "doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    default:
      // Should never happen if validation is done before upload
      throw new Error("Unsupported file type");
  }
};

export const canEditFile = (file: FileRecord, user: UserProfile): boolean => {
  if (!user) return false;

  return user.role === "admin" || file.employeeId === user.uid;
};
