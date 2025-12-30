// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
// // import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // import {Api_url} from '../config/config.js'
// import  api  from "@/api/api";

// const subjectFields = [
//   'math',
//   'english',
//   'science',
//   'socialStudies',
//   'computer',
//   'hindi',
// ];

// const Reports = () => {
//   const navigate = useNavigate();
//   const [selectedClass, setSelectedClass] = useState('10A');
//   const [students, setStudents] = useState([]);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [editMarks, setEditMarks] = useState({
//     math: 0,
//     english: 0,
//     science: 0,
//     socialStudies: 0,
//     computer: 0,
//     hindi: 0,
//   });

//   const [newStudent, setNewStudent] = useState({
//     name: '',
//     rollNo: '',
//     math: 0,
//     english: 0,
//     science: 0,
//     socialStudies: 0,
//     computer: 0,
//     hindi: 0,
//   });

//   const calculateGrade = (marks) => {
//     const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
//     if (avg >= 90) return 'A+';
//     if (avg >= 80) return 'A';
//     if (avg >= 70) return 'B+';
//     if (avg >= 60) return 'B+';
//     if (avg >= 50) return 'B';
//     if (avg >= 40) return 'C';
//     if (avg >= 35) return 'D';
//     return 'F';
//   };

//   const fetchStudents = async (className) => {
//     try {
//       const res = await api.get(`/grades/${className}`);
//       setStudents(res.data);
//     } catch (err) {
//       toast.error('Failed to fetch students');
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchStudents(selectedClass);
//   }, [selectedClass]);

//   const handleEdit = (student) => {
//     setEditingStudent(student);
//     setEditMarks({
//       math: student.math || 0,
//       english: student.english || 0,
//       science: student.science || 0,
//       socialStudies: student.socialStudies || 0,
//       computer: student.computer || 0,
//       hindi: student.hindi || 0,
//     });
//     setShowEditModal(true);
//   };

//   const handleUpdateMarks = async () => {
//     try {
//       const marks = subjectFields.map((field) => Number(editMarks[field]) || 0);
//       const totalMarks = marks.reduce((a, b) => a + b, 0);
//       const average = Math.round(totalMarks / marks.length);
//       const grade = calculateGrade(marks);

//       await api.put(`/grades/${editingStudent._id}`, {
//         ...editMarks,
//         totalMarks,
//         average,
//         grade,
//         class: selectedClass,
//       });
//       setShowEditModal(false);
//       toast.success('Student marks updated');
//       fetchStudents(selectedClass);
//     } catch (err) {
//       toast.error('Failed to update marks');
//       console.error(err);
//     }
//   };

//   const handleAddStudent = async () => {
//     const { name, rollNo } = newStudent;

//     if (!name || !rollNo) {
//       toast.warn("Please enter student's name and roll number.");
//       return;
//     }

//     const marks = subjectFields.map((field) => Number(newStudent[field]) || 0);
//     const totalMarks = marks.reduce((a, b) => a + b, 0);
//     const average = Math.round(totalMarks / marks.length);
//     const grade = calculateGrade(marks);

//     const formattedStudent = {
//       ...newStudent,
//       math: Number(newStudent.math) || 0,
//       english: Number(newStudent.english) || 0,
//       science: Number(newStudent.science) || 0,
//       socialStudies: Number(newStudent.socialStudies) || 0,
//       computer: Number(newStudent.computer) || 0,
//       hindi: Number(newStudent.hindi) || 0,
//       totalMarks,
//       average,
//       grade,
//       class: selectedClass,
//     };

//     try {
//       await api.post(`/grades`, formattedStudent);
//       setShowAddModal(false);
//       setNewStudent({
//         name: '',
//         rollNo: '',
//         math: 0,
//         english: 0,
//         science: 0,
//         socialStudies: 0,
//         computer: 0,
//         hindi: 0,
//       });
//       toast.success('Student added successfully');
//       fetchStudents(selectedClass);
//     } catch (err) {
//       toast.error('Failed to add student');
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/grades/${id}`);
//       toast.success('Student deleted');
//       fetchStudents(selectedClass);
//     } catch (err) {
//       toast.error('Failed to delete student');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
//           <div className="flex items-center space-x-4">
//             <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Dashboard
//             </Button>
//             <h1 className="text-2xl font-bold text-gray-800">Academic Reports</h1>
//           </div>
//           <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Student
//           </Button>
//         </div>

//         {/* Class Selection */}
//         <Card className="mb-6">
//           <CardContent className="pt-6">
//             <div className="flex items-center space-x-4">
//               <Label>Select Class:</Label>
//               <Select value={selectedClass} onValueChange={setSelectedClass}>
//                 <SelectTrigger className="w-48">
//                   <SelectValue placeholder="Select Class" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {['10A', '10B', '10C', '9A', '9B'].map((cls) => (
//                     <SelectItem key={cls} value={cls}>
//                       Class {cls}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Student Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Class {selectedClass} - Academic Reports</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Roll No</TableHead>
//                     <TableHead>Name</TableHead>
//                     {subjectFields.map((subject) => (
//                       <TableHead key={subject}>{subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</TableHead>
//                     ))}
//                     <TableHead>Total Marks</TableHead>
//                     <TableHead>Average</TableHead>
//                     <TableHead>Grade</TableHead>
//                     <TableHead className="text-center">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {students.map((student) => {
//                     const marks = subjectFields.map((field) => Number(student[field]) || 0);
//                     const totalMarks = student.totalMarks ?? marks.reduce((a, b) => a + b, 0);
//                     const average = Math.round(totalMarks / marks.length);
//                     return (
//                       <TableRow key={student._id}>
//                         <TableCell>{student.rollNo}</TableCell>
//                         <TableCell>{student.name}</TableCell>
//                         {subjectFields.map((subject) => (
//                           <TableCell key={subject}>{student[subject]}</TableCell>
//                         ))}
//                         <TableCell>{totalMarks}</TableCell>
//                         <TableCell>{average}</TableCell>
//                         <TableCell>
//                           <span className={`px-2 py-1 rounded text-sm font-medium ${
//                             student.grade === 'A+' ? 'bg-green-100 text-green-800' :
//                             student.grade === 'A' ? 'bg-blue-100 text-blue-800' :
//                             student.grade === 'B+' || student.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
//                             student.grade === 'C' ? 'bg-orange-100 text-orange-800' :
//                             student.grade === 'D' ? 'bg-red-100 text-red-800' :
//                             'bg-gray-100 text-gray-800'
//                           }`}>
//                             {student.grade}
//                           </span>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <div className="flex justify-center space-x-2">
//                             <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
//                               <Edit className="w-4 h-4" />
//                             </Button>
//                             <Button size="sm" variant="destructive" onClick={() => handleDelete(student._id)}>
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Edit Dialog */}
//         <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Edit Marks - {editingStudent?.name}</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               {subjectFields.map((subject) => (
//                 <div key={subject}>
//                   <Label>{subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={editMarks[subject]}
//                     onChange={(e) => setEditMarks({ ...editMarks, [subject]: parseInt(e.target.value) || 0 })}
//                   />
//                 </div>
//               ))}
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <Button onClick={handleUpdateMarks} className="flex-1">Update</Button>
//                 <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Add Dialog */}
//         <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
//           <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto', padding: '1.5rem' }}>
//             <DialogHeader>
//               <DialogTitle>Add Student - Class {selectedClass}</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label>Name</Label>
//                 <Input value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
//               </div>
//               <div>
//                 <Label>Roll No</Label>
//                 <Input value={newStudent.rollNo} onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })} />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {subjectFields.map((subject) => (
//                   <div key={subject}>
//                     <Label>{subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
//                     <Input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={newStudent[subject]}
//                       onChange={(e) => setNewStudent({ ...newStudent, [subject]: parseInt(e.target.value) || 0 })}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="flex flex-col sm:flex-row gap-2 pt-2">
//                 <Button onClick={handleAddStudent} className="flex-1">Add</Button>
//                 <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default Reports;






import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, GraduationCap, Settings, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "@/api/api";

const Reports = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('10A');
  const [selectedExamType, setSelectedExamType] = useState('FA1');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editMarks, setEditMarks] = useState({});
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '' });
  const [newSubjects, setNewSubjects] = useState(['']);

  const calculateGrade = (marks) => {
    const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
    if (avg >= 90) return 'A+';
    if (avg >= 80) return 'A';
    if (avg >= 70) return 'B+';
    if (avg >= 60) return 'B';
    if (avg >= 50) return 'C';
    if (avg >= 40) return 'D';
    if (avg >= 35) return 'E';
    return 'F';
  };
  const fetchSubjects = async (className, examType) => {
    try {
      const res = await api.get(
        `/report-subjects/${className}/${examType}`
      );
      setSubjects(res.data.subjects || []);
    } catch {
      setSubjects([]);
    }
  };


  const fetchStudents = async (className, examType) => {
    try {
      const res = await api.get(`/grades/${className}/${examType}`);
      setStudents(res.data || []);
    } catch (err) {
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchSubjects(selectedClass, selectedExamType);
    fetchStudents(selectedClass, selectedExamType);
  }, [selectedClass, selectedExamType]);

  const handleEdit = (student) => {
    setEditingStudent(student);
    const marksObj = {};
    subjects.forEach(subject => {
      marksObj[subject] = student[subject] || 0;
    });
    setEditMarks(marksObj);
    setShowEditModal(true);
  };

  const handleUpdateMarks = async () => {
    try {
      const marks = subjects.map(subject => Number(editMarks[subject]) || 0);
      const totalMarks = marks.reduce((a, b) => a + b, 0);
      const average = Math.round(totalMarks / marks.length);
      const grade = calculateGrade(marks);

      await api.put(`/grades/${editingStudent._id}`, {
        marks: editMarks,
        totalMarks,
        average,
        grade,
        class: selectedClass,
        examType: selectedExamType,
      });
      setShowEditModal(false);
      toast.success('✅ Marks updated successfully');
      fetchStudents(selectedClass, selectedExamType);
    } catch (err) {
      toast.error('❌ Failed to update marks');
    }
  };

  const handleAddStudent = async () => {
    const { name, rollNo } = newStudent;

    if (!name || !rollNo) {
      toast.warn("Please enter name and roll number");
      return;
    }

    // 🔥 CREATE DYNAMIC MARKS OBJECT
    const marksObj = {};
    subjects.forEach(subject => {
      marksObj[subject] = Number(newStudent[subject]) || 0;
    });

    const marksArray = Object.values(marksObj);
    const totalMarks = marksArray.reduce((a, b) => a + b, 0);
    const average = Math.round(totalMarks / marksArray.length);
    const grade = calculateGrade(marksArray);

    try {
      await api.post("/grades", {
        name,
        rollNo,
        class: selectedClass,
        examType: selectedExamType,   // ✅ VERY IMPORTANT
        marks: marksObj,              // ✅ DYNAMIC SUBJECTS
        totalMarks,
        average,
        grade,
      });

      setShowAddModal(false);
      setNewStudent({ name: "", rollNo: "" });
      toast.success("✅ Student added successfully");
      fetchStudents(selectedClass, selectedExamType);
    } catch (err) {
      toast.error("❌ Failed to add student");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student record?')) return;
    try {
      await api.delete(`/grades/${id}`);
      toast.success('✅ Student deleted');
      fetchStudents(selectedClass, selectedExamType);
    } catch (err) {
      toast.error('❌ Failed to delete student');
    }
  };

  const addSubjectField = () => {
    setNewSubjects([...newSubjects, '']);
  };

  const removeSubjectField = (index) => {
    if (newSubjects.length > 1) {
      const updated = newSubjects.filter((_, i) => i !== index);
      setNewSubjects(updated);
    }
  };

  const updateSubjectField = (index, value) => {
    const updated = [...newSubjects];
    updated[index] = value.trim();
    setNewSubjects(updated);
  };

  // 🔥 ADD/REMOVE SUBJECTS FROM CURRENT LIST
  const removeCurrentSubject = async (subjectIndex) => {
    if (!window.confirm('Remove this subject? All student marks for this subject will be lost.')) return;
    
    const newSubjectList = subjects.filter((_, index) => index !== subjectIndex);
    
    try {
      await api.post(`/subjects/${selectedClass}/${selectedExamType}`, {
        subjects: newSubjectList
      });
      setSubjects(newSubjectList);
      toast.success('✅ Subject removed');
    } catch (err) {
      toast.error('❌ Failed to remove subject');
    }
  };

  const saveSubjects = async () => {
    const inputSubjects = newSubjects
      .map(s => s.trim().toLowerCase().replace(/\s+/g, "_"))
      .filter(s => s.length > 0);

    if (inputSubjects.length === 0) {
      toast.warn("Please enter at least one subject");
      return;
    }

    try {
      await api.post(
        `/report-subjects/${selectedClass}/${selectedExamType}`,
        { subjects: inputSubjects }
      );

      setSubjects(inputSubjects);
      setShowSubjectsModal(false);
      setNewSubjects([""]);
      toast.success("✅ Report subjects saved");
    } catch {
      toast.error("❌ Failed to save report subjects");
    }
  };


  const formatSubjectName = (subject) => {
    return subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        {/* Header - ORIGINAL STYLE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Dynamic Exam Reports</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowSubjectsModal(true)} 
              variant="outline"
              className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100"
            >
              <Settings className="w-4 h-4" />
              Subjects ({subjects.length})
            </Button>
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
          </div>
        </div>

        {/* Filters - ORIGINAL STYLE */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="flex items-center space-x-4">
                <Label className="w-24">Class:</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['10A', '10B', '10C', '9A', '9B', '8A', '8B', '7A'].map((cls) => (
                      <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <Label className="w-32">Exam Type:</Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['FA1', 'FA2', 'FA3', 'SA1', 'SA2', 'SA3', 'FINAL'].map((exam) => (
                      <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Active Subjects: <span className="font-bold text-2xl text-purple-600">{subjects.length}</span>
                  {subjects.length === 0 && <span className="block text-xs text-red-500 mt-1">Click Subjects button to set</span>}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table - ORIGINAL STYLE */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <CardTitle>Class {selectedClass} - {selectedExamType}</CardTitle>
              <span className="text-sm text-gray-500">({subjects.length} Subjects)</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Exam</TableHead>
                    {subjects.map((subject) => (
                      <TableHead key={subject} className="text-center min-w-[100px]">
                        {formatSubjectName(subject)}
                      </TableHead>
                    ))}
                    <TableHead className="text-center min-w-[80px]">Total</TableHead>
                    <TableHead className="text-center min-w-[70px]">Avg</TableHead>
                    <TableHead className="text-center min-w-[70px]">Grade</TableHead>
                    <TableHead className="text-center min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={20} className="text-center py-12 text-gray-500">
                        📚 No subjects set for {selectedClass} {selectedExamType}<br />
                        <small>Click "Subjects ({subjects.length})" button above</small>
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={subjects.length + 7} className="text-center py-12 text-gray-500">
                        📝 No student data for {selectedExamType} exam<br />
                        <small>Use "Add Student" to create records</small>
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => {
                      const marks = subjects.map(subject => Number(student[subject]) || 0);
                      const totalMarks = student.totalMarks ?? marks.reduce((a, b) => a + b, 0);
                      const average = Math.round(totalMarks / marks.length);
                      return (
                        <TableRow key={student._id} className="hover:bg-gray-50">
                          <TableCell className="font-semibold">{student.rollNo}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                              {student.examType || selectedExamType}
                            </span>
                          </TableCell>
                          {subjects.map((subject) => (
                            <TableCell key={subject} className="text-center">
                              {student.marks?.[subject] || 0}
                            </TableCell>
                          ))}

                          <TableCell className="text-center font-bold text-green-600">{totalMarks}</TableCell>
                          <TableCell className="text-center font-bold">{average}%</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              student.grade === 'A+' ? 'bg-green-100 text-green-800' :
                              student.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                              student.grade === 'B+' || student.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                              student.grade === 'C' || student.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {student.grade}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(student)} className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDelete(student._id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit & Add Modals - SAME AS ORIGINAL */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Edit Marks - {editingStudent?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg text-sm">
                <div>Class: <span className="font-bold">{selectedClass}</span></div>
                <div>Exam: <span className="font-bold text-blue-700">{selectedExamType}</span></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
                {subjects.map((subject) => (
                  <div key={subject} className="space-y-1">
                    <Label className="text-xs capitalize font-medium block text-center">
                      {formatSubjectName(subject)}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editMarks[subject] || 0}
                      onChange={(e) => setEditMarks({ ...editMarks, [subject]: parseInt(e.target.value) || 0 })}
                      className="text-center font-mono text-lg tracking-wider"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpdateMarks} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  💾 Update Marks
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add Student - {selectedClass} ({selectedExamType})</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border">
                <div>Class: <strong>{selectedClass}</strong></div>
                <div>Exam: <strong>{selectedExamType}</strong></div>
                <div>Subjects: <strong>{subjects.length}</strong></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student Name *</Label>
                  <Input 
                    value={newStudent.name} 
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label>Roll Number *</Label>
                  <Input 
                    value={newStudent.rollNo} 
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    placeholder="e.g., 001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {subjects.map((subject) => (
                  <div key={subject}>
                    <Label className="text-xs capitalize block text-center mb-1">
                      {formatSubjectName(subject)}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newStudent[subject] || 0}
                      onChange={(e) => setNewStudent({ ...newStudent, [subject]: parseInt(e.target.value) || 0 })}
                      className="text-center"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddStudent} className="flex-1 bg-green-600 hover:bg-green-700">
                  ➕ Add Student
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 🔥 SUBJECTS MODAL WITH REMOVE BUTTONS */}
        <Dialog open={showSubjectsModal} onOpenChange={setShowSubjectsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Subjects</DialogTitle>
              <p className="text-sm text-gray-600">
                Class {selectedClass} - {selectedExamType} • Currently {subjects.length} subjects
              </p>
            </DialogHeader>
            <div className="space-y-4">
              {/* 🔥 CURRENT SUBJECTS WITH DELETE BUTTONS */}
              {subjects.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    📚 Current Subjects ({subjects.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject, index) => (
                      <div key={index} className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-full">
                        <span className="text-sm font-medium text-red-800">
                          {formatSubjectName(subject)}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeCurrentSubject(index)}
                          className="h-7 w-7 p-0 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADD NEW SUBJECTS */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">➕ Add New Subjects</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-yellow-50">
                  {newSubjects.map((subject, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                      <Input
                        value={subject}
                        onChange={(e) => updateSubjectField(index, e.target.value)}
                        placeholder={`Subject ${index + 1} (e.g., Physics, Biology)`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubjectField(index)}
                        className="h-9 w-9 p-0"
                        disabled={newSubjects.length <= 1}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={addSubjectField}
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full flex items-center gap-2"
                >
                  ➕ Add Another Subject Field
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={saveSubjects} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  💾 Save Subjects
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowSubjectsModal(false);
                    setNewSubjects(['']);
                  }} 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Reports;
