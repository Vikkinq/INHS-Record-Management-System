import { db, storage } from "../config/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { FileRecord } from "../types/Files";

import { getFileType, isValidFileType, isValidFileSize } from "../utils/file.utils";

// Firestore collection
const filesCollection = collection(db, "files");

// CREATE / UPLOAD
export const uploadFile = async (
  file: File,
  meta: Omit<FileRecord, "fileId" | "fileUrl" | "uploadedAt" | "createdAt" | "fileSize">
) => {
  if (!isValidFileType(file)) {
    throw new Error("Invalid file type. Only PDF and Word documents are allowed.");
  }

  if (!isValidFileSize(file)) {
    throw new Error("File too large. Maximum allowed size is 10MB.");
  }

  const storageRef = ref(storage, `files/${file.name}-${Date.now()}`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  const fileDocRef = doc(filesCollection);
  const fileType = getFileType(file);

  const newFile: FileRecord = {
    fileId: fileDocRef.id,
    ...meta,
    fileType,
    fileSize: file.size,
    fileUrl: downloadUrl,
    uploadedAt: new Date(),
    createdAt: new Date(),
  };

  await setDoc(fileDocRef, newFile);
  return newFile;
};

// READ ALL
export const getFiles = async (): Promise<FileRecord[]> => {
  const snap = await getDocs(filesCollection);
  return snap.docs.map((doc) => doc.data() as FileRecord);
};

// READ ONE
export const getFileById = async (fileId: string): Promise<FileRecord | null> => {
  const docRef = doc(filesCollection, fileId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as FileRecord) : null;
};

// UPDATE
export const updateFile = async (fileId: string, updatedData: Partial<FileRecord>) => {
  const docRef = doc(filesCollection, fileId);
  await updateDoc(docRef, updatedData);
};

// DELETE
export const deleteFile = async (fileId: string) => {
  const docRef = doc(filesCollection, fileId);
  await deleteDoc(docRef);
};
