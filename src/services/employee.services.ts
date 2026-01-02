import { db } from "@/config/firebase";
import { collection, addDoc, getDocs, getDoc, doc, serverTimestamp, query, where, updateDoc } from "firebase/firestore";

import type { Employee } from "@/types/Employee";
import type { FileRecord } from "@/types/Files";

export const createEmployee = async (data: Omit<Employee, "employeeId" | "createdAt" | "updatedAt">) => {
  const ref = await addDoc(collection(db, "employees"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    employeeId: ref.id,
    ...data,
  };
};

export const getEmployees = async (): Promise<Employee[]> => {
  const snap = await getDocs(collection(db, "employees"));
  return snap.docs.map((d) => ({
    employeeId: d.id,
    ...(d.data() as Omit<Employee, "employeeId">),
  }));
};

export const getEmployeeById = async (employeeId: string): Promise<Employee> => {
  const snap = await getDoc(doc(db, "employees", employeeId));

  if (!snap.exists()) {
    throw new Error("Employee not found");
  }

  return {
    employeeId: snap.id,
    ...(snap.data() as Omit<Employee, "employeeId">),
  };
};

export const getFilesByEmployeeId = async (employeeId: string): Promise<FileRecord[]> => {
  const filesRef = collection(db, "files");
  const q = query(filesRef, where("employeeId", "==", employeeId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      fileId: doc.id,
      employeeId: data.employeeId,
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.fileSize,
      fileUrl: data.fileUrl,
      category: data.category,
      uploadedBy: data.uploadedBy,
      createdAt: data.createdAt,
      storagePath: data.storagePath,
      uploadedAt: data.updatedAt,
      updatedAt: data.updatedAt,
    } as FileRecord;
  });
};

export const updateEmployee = async (employeeId: string, payload: Partial<Employee>): Promise<Employee> => {
  const ref = doc(db, "employees", employeeId);

  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  // Return merged object for optimistic UI
  return {
    employeeId,
    ...payload,
  } as Employee;
};
