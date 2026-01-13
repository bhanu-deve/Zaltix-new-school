// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// interface AddStaffModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddStaff: (staff: any) => void;
// }

// const AddStaffModal = ({ isOpen, onClose, onAddStaff }: AddStaffModalProps) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     designation: "",
//     department: "",
//     email: "",
//     phone: "",
//     password: "" // ✅ ADDED
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newStaff = {
//       id: Date.now(),
//       name: formData.name,
//       role: formData.designation,
//       subjects: [formData.department],
//       classes: ["TBD"],
//       joinDate: new Date().toISOString().split("T")[0],
//       email: formData.email,
//       phone: formData.phone,
//       status: "Active",
//       password: formData.password // ✅ SENT TO BACKEND
//     };

//     onAddStaff(newStaff);

//     setFormData({
//       name: "",
//       designation: "",
//       department: "",
//       email: "",
//       phone: "",
//       password: ""
//     });

//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Add New Staff Member</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label>Name *</Label>
//             <Input
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//           </div>

//           <div>
//             <Label>Designation *</Label>
//             <Select
//               value={formData.designation}
//               onValueChange={(value) =>
//                 setFormData({ ...formData, designation: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select designation" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Mathematics Teacher">Mathematics Teacher</SelectItem>
//                 <SelectItem value="English Teacher">English Teacher</SelectItem>
//                 <SelectItem value="Science Teacher">Science Teacher</SelectItem>
//                 <SelectItem value="Art Teacher">Art Teacher</SelectItem>
//                 <SelectItem value="Physical Education Teacher">Physical Education Teacher</SelectItem>
//                 <SelectItem value="Librarian">Librarian</SelectItem>
//                 <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Department *</Label>
//             <Select
//               value={formData.department}
//               onValueChange={(value) =>
//                 setFormData({ ...formData, department: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select department" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Mathematics">Mathematics</SelectItem>
//                 <SelectItem value="English">English</SelectItem>
//                 <SelectItem value="Science">Science</SelectItem>
//                 <SelectItem value="Arts">Arts</SelectItem>
//                 <SelectItem value="Physical Education">Physical Education</SelectItem>
//                 <SelectItem value="Administration">Administration</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Email *</Label>
//             <Input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               required
//             />
//           </div>

//           <div>
//             <Label>Phone *</Label>
//             <Input
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               pattern="[0-9]{10}"
//               required
//             />
//           </div>

//           {/* ✅ PASSWORD FIELD (THIS FIXES YOUR ISSUE) */}
//           <div>
//             <Label>Password (Set for Teacher Login) *</Label>
//             <Input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               placeholder="Set login password"
//               required
//             />
//           </div>

//           <div className="flex space-x-2">
//             <Button type="submit" className="flex-1">
//               Add Staff
//             </Button>
//             <Button type="button" variant="outline" onClick={onClose} className="flex-1">
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddStaffModal;


import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/* ================= TYPES ================= */

interface Staff {
  _id?: string;
  name: string;
  role: string;
  subjects: string[];
  classes: string[];
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
  password?: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: Staff) => void;
  editData?: Staff | null; // ✅ FOR EDIT
}

/* ================= COMPONENT ================= */

const AddStaffModal = ({
  isOpen,
  onClose,
  onAddStaff,
  editData,
}: AddStaffModalProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"Active" | "On Leave" | "Inactive">(
    "Active"
  );

  /* ================= PREFILL ON EDIT ================= */

  useEffect(() => {
    if (editData && isOpen) {
      setName(editData.name);
      setRole(editData.role);
      setSubject(editData.subjects?.[0] || "");
      setEmail(editData.email);
      setPhone(editData.phone);
      setStatus(editData.status);
      setPassword(""); // 🔐 do not prefill password
    }
  }, [editData, isOpen]);

  /* ================= RESET ON CLOSE ================= */

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setRole("");
      setSubject("");
      setEmail("");
      setPhone("");
      setPassword("");
      setStatus("Active");
    }
  }, [isOpen]);

  /* ================= SUBMIT ================= */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Staff = {
      name,
      role,
      subjects: [subject],
      classes: editData?.classes || ["TBD"],
      email,
      phone,
      status,
      joinDate: editData?.joinDate || new Date().toISOString().split("T")[0],
    };

    if (!editData) {
      payload.password = password; // ✅ only on CREATE
    }

    onAddStaff(payload);
    onClose();
  };

  /* ================= UI ================= */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label>Role *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics Teacher">Mathematics Teacher</SelectItem>
                <SelectItem value="English Teacher">English Teacher</SelectItem>
                <SelectItem value="Science Teacher">Science Teacher</SelectItem>
                <SelectItem value="Art Teacher">Art Teacher</SelectItem>
                <SelectItem value="Physical Education Teacher">
                  Physical Education Teacher
                </SelectItem>
                <SelectItem value="Librarian">Librarian</SelectItem>
                <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Subject *</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Physical Education">Physical Education</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Email *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <Label>Phone *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          {!editData && (
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editData ? "Update Staff" : "Add Staff"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;

