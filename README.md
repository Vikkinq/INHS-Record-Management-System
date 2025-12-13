# Digital Record Management System — Ivisan National High School

A **web-based prototype system** for managing 201 Files of employees, built with **React, TypeScript, Firebase, Supabase, and TailwindCSS**.  
Allows secure file upload, download, and management with role-based access (Staff / Admin).

---

## Features

### Authentication & Authorization

- Email & Password login (default role: `staff`)
- Role-based access:
  - **Staff** → can upload/manage their files
  - **Admin** → can manage/delete all files

### Employee File Management

- Upload files (PDF, Word, etc.)
- List files per employee
- Search files by name or type
- Download files via public/signed URL
- Delete files (Admin only)

### Frontend

- React + TypeScript for robust and type-safe UI
- TailwindCSS for responsive design and styling

### Backend & Database

- Firebase Auth for authentication
- Firestore for user profiles and file metadata
- Supabase Storage for cloud file storage
