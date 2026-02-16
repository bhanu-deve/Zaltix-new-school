// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// /* ================= TYPES ================= */

// interface Staff {
//   _id?: string;
//   name: string;
//   role: string;
//   subjects: string[];
//   classes: string[];
//   email: string;
//   phone: string;
//   status: "Active" | "On Leave" | "Inactive";
//   joinDate: string;
//   password?: string;
// }

// interface AddStaffModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddStaff: (staff: Staff) => void;
//   editData?: Staff | null; // ✅ FOR EDIT
// }

// /* ================= COMPONENT ================= */

// const AddStaffModal = ({
//   isOpen,
//   onClose,
//   onAddStaff,
//   editData,
// }: AddStaffModalProps) => {
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("");
//   const [subject, setSubject] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [status, setStatus] = useState<"Active" | "On Leave" | "Inactive">(
//     "Active"
//   );

//   /* ================= PREFILL ON EDIT ================= */

//   useEffect(() => {
//     if (editData && isOpen) {
//       setName(editData.name);
//       setRole(editData.role);
//       setSubject(editData.subjects?.[0] || "");
//       setEmail(editData.email);
//       setPhone(editData.phone);
//       setStatus(editData.status);
//       setPassword(""); // 🔐 do not prefill password
//     }
//   }, [editData, isOpen]);

//   /* ================= RESET ON CLOSE ================= */

//   useEffect(() => {
//     if (!isOpen) {
//       setName("");
//       setRole("");
//       setSubject("");
//       setEmail("");
//       setPhone("");
//       setPassword("");
//       setStatus("Active");
//     }
//   }, [isOpen]);

//   /* ================= SUBMIT ================= */

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload: Staff = {
//       name,
//       role,
//       subjects: [subject],
//       classes: editData?.classes || ["TBD"],
//       email,
//       phone,
//       status,
//       joinDate: editData?.joinDate || new Date().toISOString().split("T")[0],
//     };

//     if (!editData) {
//       payload.password = password; // ✅ only on CREATE
//     }

//     onAddStaff(payload);
//     onClose();
//   };

//   /* ================= UI ================= */

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {editData ? "Edit Staff Member" : "Add New Staff Member"}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label>Name *</Label>
//             <Input value={name} onChange={(e) => setName(e.target.value)} required />
//           </div>

//           <div>
//             <Label>Role *</Label>
//             <Select value={role} onValueChange={setRole}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Mathematics Teacher">Mathematics Teacher</SelectItem>
//                 <SelectItem value="English Teacher">English Teacher</SelectItem>
//                 <SelectItem value="Science Teacher">Science Teacher</SelectItem>
//                 <SelectItem value="Art Teacher">Art Teacher</SelectItem>
//                 <SelectItem value="Physical Education Teacher">
//                   Physical Education Teacher
//                 </SelectItem>
//                 <SelectItem value="Librarian">Librarian</SelectItem>
//                 <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Subject *</Label>
//             <Select value={subject} onValueChange={setSubject}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select subject" />
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
//             <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           </div>

//           <div>
//             <Label>Phone *</Label>
//             <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
//           </div>

//           {!editData && (
//             <div>
//               <Label>Password *</Label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <div className="flex gap-2">
//             <Button type="submit" className="flex-1">
//               {editData ? "Update Staff" : "Add Staff"}
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


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, X, Upload } from 'lucide-react';

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  subjects: string[];
  classes: string[];
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  photo?: string;
  password?: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: Staff) => void;
  editData: Staff | null;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onAddStaff,
  editData,
}) => {
  const [formData, setFormData] = useState<Staff>({
    _id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    subjects: [],
    classes: [],
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    photo: '',
    password: '',
  });

  const [subjectInput, setSubjectInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (editData) {
      console.log('Editing staff with photo:', editData.photo ? 'Yes' : 'No');
      setFormData({
        ...editData,
        password: '',
      });
      setPhotoPreview(editData.photo || '');
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const resetForm = () => {
    setFormData({
      _id: '',
      name: '',
      email: '',
      phone: '',
      role: '',
      subjects: [],
      classes: [],
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      photo: '',
      password: '',
    });
    setSubjectInput('');
    setClassInput('');
    setPhotoPreview('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log('Photo processed, length:', base64String.length);
      setPhotoPreview(base64String);
      setFormData(prev => ({ ...prev, photo: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  const addSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const addClass = () => {
    if (classInput.trim() && !formData.classes.includes(classInput.trim())) {
      setFormData(prev => ({
        ...prev,
        classes: [...prev.classes, classInput.trim()]
      }));
      setClassInput('');
    }
  };

  const removeClass = (cls: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c !== cls)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting staff data:', {
      ...formData,
      photo: formData.photo ? `Photo present (length: ${formData.photo.length})` : 'No photo'
    });

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate password for new staff
    if (!editData && !formData.password) {
      alert('Password is required for new staff');
      return;
    }

    // Ensure subjects and classes are arrays (they should be already from your state)
    const payload = {
      ...formData,
      subjects: formData.subjects.length > 0 ? formData.subjects : ['TBD'],
      classes: formData.classes.length > 0 ? formData.classes : ['TBD'],
    };

    onAddStaff(payload);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Staff Member' : 'Add New Staff Member'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-6">
              {/* Photo Preview */}
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt={formData.name || 'Profile'} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {formData.name ? getInitials(formData.name) : <Camera className="h-8 w-8" />}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Upload Controls */}
              <div className="flex-1">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>

                {photoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics Teacher">Mathematics Teacher</SelectItem>
                  <SelectItem value="English Teacher">English Teacher</SelectItem>
                  <SelectItem value="Science Teacher">Science Teacher</SelectItem>
                  <SelectItem value="Art Teacher">Art Teacher</SelectItem>
                  <SelectItem value="Physical Education Teacher">PE Teacher</SelectItem>
                  <SelectItem value="Librarian">Librarian</SelectItem>
                  <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@school.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Password (only for new staff) */}
          {!editData && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
          )}

          {/* Subjects */}
          <div className="space-y-2">
            <Label>Subjects</Label>
            <div className="flex gap-2">
              <Input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="Add a subject"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
              />
              <Button type="button" onClick={addSubject} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Classes */}
          <div className="space-y-2">
            <Label>Classes</Label>
            <div className="flex gap-2">
              <Input
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                placeholder="Add a class"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addClass())}
              />
              <Button type="button" onClick={addClass} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.classes.map((cls, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                >
                  {cls}
                  <button
                    type="button"
                    onClick={() => removeClass(cls)}
                    className="hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Join Date and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value as Staff['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">
              {editData ? 'Update Staff' : 'Add Staff'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;
