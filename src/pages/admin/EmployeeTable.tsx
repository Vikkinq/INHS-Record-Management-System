import type { UserProfile } from "@/types/User";

interface EmployeeTableProps {
  userDatas: UserProfile[];
}

export default function EmployeeTable({ userDatas }: EmployeeTableProps) {
  return (
    <tbody>
      {userDatas.map((user) => (
        <tr key={user.uid} className="border-t hover:bg-muted/50 transition-colors">
          <td className="px-4 py-3 text-xs text-slate-500">{user.uid}</td>

          <td className="px-4 py-3 font-medium">
            {/* If fullName exists in Firestore */}
            {"fullName" in user ? (user as any).fullName : "—"}
          </td>

          <td className="px-4 py-3">{user.email}</td>

          <td className="px-4 py-3 capitalize">{user.role}</td>

          <td className="px-4 py-3 text-sm text-slate-500">
            {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "—"}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
