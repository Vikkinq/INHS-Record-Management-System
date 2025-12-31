import { useState } from "react";
import { useToast } from "../general/Toast";
import { createUserProfile } from "@/services/user.services";
import { createEmployee } from "@/services/employee.services";
import type { CreateUserProfileInput } from "@/types/User";
import { registerWithEmail } from "@/services/auth.services";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// ...imports remain the same

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const { addToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"staff" | "admin">("staff");
  const [sex, setSex] = useState<"Male" | "Female">("Male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [positionTitle, setPositionTitle] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState<"Permanent" | "Temporary" | "Part-time">("Permanent");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Auth user
      const firebaseUser = await registerWithEmail(email, password);

      // 2️⃣ Employee FIRST
      const employee = await createEmployee({
        fullName,
        sex,
        dateOfBirth,
        userId: firebaseUser.uid,
        itemNumber: "",
        positionTitle,
        salaryGrade: "",
        step: "",
        employmentStatus,
        natureOfAppointment: "",
        originalAppointmentDate: "",
        latestAppointmentDate: "",
        education: {},
      });

      // 3️⃣ User profile WITH employeeId
      const userInput: CreateUserProfileInput = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role,
        fullName,
        provider: "email",
        employeeId: employee.employeeId,
      };

      await createUserProfile(userInput);

      addToast(`Successfully created ${fullName} as ${role}`, "success");
      onClose();
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Juan Dela Cruz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <Label>Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as "staff" | "admin")}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sex */}
          <div className="space-y-1">
            <Label>Sex</Label>
            <Select value={sex} onValueChange={(value) => setSex(value as "Male" | "Female")}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </div>

          {/* Position Title */}
          <div className="space-y-1">
            <Label htmlFor="positionTitle">Position Title</Label>
            <Input
              id="positionTitle"
              placeholder="e.g., Teacher"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
            />
          </div>

          {/* Employment Status */}
          <div className="space-y-1">
            <Label>Employment Status</Label>
            <Select
              value={employmentStatus}
              onValueChange={(value) => setEmploymentStatus(value as "Permanent" | "Temporary" | "Part-time")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Permanent">Permanent</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
