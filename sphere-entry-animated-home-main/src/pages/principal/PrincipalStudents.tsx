import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Users, Edit, Trash2, Save, X } from "lucide-react";
import api from "@/api/api";

const PrincipalStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    grade: "",
    section: "",
    dateOfBirth: "",
    parentName: "",
    parentPhone: "",
    email: ""
  });
  
  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [deletingStudentName, setDeletingStudentName] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/students/all", {
        params: { grade, section }
      });
      setStudents(res.data.students);
      setTotal(res.data.total);
    } catch {
      alert("Failed to load students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Edit Button Click
  const handleEditClick = (student: any) => {
    setEditingStudent(student);
    setEditForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      rollNumber: student.rollNumber || "",
      grade: student.grade || "",
      section: student.section || "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      email: student.email || ""
    });
    setEditDialogOpen(true);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!editingStudent) return;

    try {
      const res = await api.put(`/students/${editingStudent._id}`, editForm);
      
      // Update local state
      setStudents(students.map(student => 
        student._id === editingStudent._id 
          ? { ...student, ...editForm } 
          : student
      ));
      
      setEditDialogOpen(false);
      alert("Student updated successfully!");
    } catch (error) {
      alert("Failed to update student");
      console.error(error);
    }
  };

  // Handle Delete Button Click
  const handleDeleteClick = (studentId: string, studentName: string) => {
    setDeletingStudentId(studentId);
    setDeletingStudentName(studentName);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deletingStudentId) return;

    try {
      await api.delete(`/students/${deletingStudentId}`);
      
      // Update local state
      setStudents(students.filter(student => student._id !== deletingStudentId));
      setTotal(prev => prev - 1);
      
      setDeleteDialogOpen(false);
      alert("Student deleted successfully!");
    } catch (error) {
      alert("Failed to delete student");
      console.error(error);
    } finally {
      setDeletingStudentId(null);
      setDeletingStudentName("");
    }
  };

  // Handle Input Change in Edit Form
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/dashboard/principal")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Student Records
            </h1>
          </div>
          <div className="text-lg font-semibold">
            Total Students: {total}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="flex gap-4 p-4">
            <Input
              placeholder="Grade (e.g. 10)"
              value={grade}
              onChange={e => setGrade(e.target.value)}
            />
            <Input
              placeholder="Section (A/B/C)"
              value={section}
              onChange={e => setSection(e.target.value)}
            />
            <Button onClick={fetchStudents} disabled={loading}>
              Apply Filter
            </Button>
          </CardContent>
        </Card>

        {/* Student Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Roll No</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Class</th>
                  <th className="p-2">DOB</th>
                  <th className="p-2">Parent</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(stu => (
                  <tr key={stu._id} className="border-t">
                    <td className="p-2">{stu.rollNumber}</td>
                    <td className="p-2">{stu.firstName} {stu.lastName}</td>
                    <td className="p-2">{stu.grade}{stu.section}</td>
                    <td className="p-2">
                      {stu.dateOfBirth ? new Date(stu.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2">{stu.parentName}</td>
                    <td className="p-2">{stu.parentPhone}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(stu)}
                          className="h-8 px-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(stu._id, `${stu.firstName} ${stu.lastName}`)}
                          className="h-8 px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Edit Student Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Student Details</DialogTitle>
              <DialogDescription>
                Update student information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Roll Number</label>
                  <Input
                    name="rollNumber"
                    value={editForm.rollNumber}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade</label>
                  <Input
                    name="grade"
                    value={editForm.grade}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Input
                    name="section"
                    value={editForm.section}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={editForm.dateOfBirth}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Name</label>
                <Input
                  name="parentName"
                  value={editForm.parentName}
                  onChange={handleEditFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Phone</label>
                <Input
                  name="parentPhone"
                  value={editForm.parentPhone}
                  onChange={handleEditFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete 
                <span className="font-semibold text-red-600"> {deletingStudentName}</span>'s 
                record from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setDeleteDialogOpen(false);
                setDeletingStudentId(null);
                setDeletingStudentName("");
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
};

export default PrincipalStudents;