// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { ArrowLeft, DollarSign, Users, GraduationCap, Edit, Plus, Trash } from 'lucide-react';
// import AnimatedBackground from '@/components/AnimatedBackground';
// import EditFeeModal from '@/components/EditFeeModal';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // import {Api_url} from '../config/config.js'
// import  api  from "@/api/api";

// const FeeReports = () => {
//   const navigate = useNavigate();
//   const [filterType, setFilterType] = useState('student');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);

//   const [studentWiseData, setStudentWiseData] = useState<any[]>([]);
//   const [classWiseData, setClassWiseData] = useState<any[]>([]);

//   useEffect(() => {
//     if (filterType === 'student') fetchStudentWiseFees();
//     else fetchClassWiseFees();
//   }, [filterType]);

//   const fetchStudentWiseFees = async () => {
//     try {
//       const res = await api.get(`/fee/student`);
//       setStudentWiseData(res.data);
//     } catch {
//       console.error('Failed to load student-wise fee data.');
//     }
//   };

//   const fetchClassWiseFees = async () => {
//     try {
//       const res = await api.get(`/fee/class`);
//       setClassWiseData(res.data);
//     } catch {
//       console.error('Failed to load class-wise fee data.');
//     }
//   };

//   const handleUpdateRecord = async (updatedRecord: any) => {
//     try {
//       await api.put(`/fee/${updatedRecord.id}`, updatedRecord);
//       fetchStudentWiseFees();
//       setShowEditModal(false);
//       toast.success('✅ Record updated successfully!');
//     } catch {
//       toast.error('❌ Failed to update record.');
//     }
//   };

//   const handleAddRecord = async (newRecord: any) => {
//     try {
//       newRecord.amount = newRecord.amount.replace(/[₹,]/g, '');
//       await api.post(`/fee`, newRecord);
//       fetchStudentWiseFees();
//       toast.success('✅ Student added successfully!');
//     } catch {
//       toast.error('❌ Failed to add student.');
//     }
//   };

//   const handleDeleteStudent = async (id: string) => {
//     try {
//       await api.delete(`/fee/${id}`);
//       fetchStudentWiseFees();
//       toast.success('🗑️ Student deleted successfully!');
//     } catch {
//       toast.error('❌ Failed to delete student.');
//     }
//   };

//   const handleDeleteClass = async (className: string) => {
//     try {
//       await api.delete(`/fee/class/${className}`);
//       fetchClassWiseFees();
//       toast.success('🗑️ Class fee data deleted!');
//     } catch {
//       toast.error('❌ Failed to delete class data.');
//     }
//   };

//   const handleEdit = (record: any) => {
//     setEditingRecord(record);
//     setShowEditModal(true);
//   };

//   return (
//     <div className="min-h-screen p-4 bg-gray-50 relative">
//       <AnimatedBackground />
//       <ToastContainer position="top-right" autoClose={2500} />

//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
//             <Button
//               onClick={() => navigate('/dashboard/principal')}
//               className="bg-white text-black border border-black hover:bg-gray-100 flex items-center justify-center w-full sm:w-auto"
//               size="sm"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2 text-black" />
//               Back to Dashboard
//             </Button>
//             <div className="flex items-center space-x-3">
//               <div className="p-2 rounded-full bg-red-100">
//                 <DollarSign className="w-6 h-6 text-red-600" />
//               </div>
//               <div>
//                 <h1 className="text-xl md:text-2xl font-bold text-gray-800">Fee Reports</h1>
//                 <p className="text-gray-600 text-sm">Financial collections & payment tracking</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filter Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <Button
//             onClick={() => setFilterType('student')}
//             variant={filterType === 'student' ? 'default' : 'outline'}
//             className="w-full sm:w-auto"
//           >
//             <Users className="w-4 h-4 mr-2" /> Student-wise
//           </Button>
//           <Button
//             onClick={() => setFilterType('class')}
//             variant={filterType === 'class' ? 'default' : 'outline'}
//             className="w-full sm:w-auto"
//           >
//             <GraduationCap className="w-4 h-4 mr-2" /> Class-wise
//           </Button>
//           {filterType === 'student' && (
//             <Button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto sm:ml-auto"
//             >
//               <Plus className="w-4 h-4 mr-2" /> Add Student
//             </Button>
//           )}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { label: 'Total Collected', color: 'text-green-600', value: '₹2,45,000' },
//             { label: 'Pending Amount', color: 'text-yellow-600', value: '₹41,000' },
//             { label: 'Overdue', color: 'text-red-600', value: '₹15,000' },
//             { label: 'Collection Rate', color: 'text-blue-600', value: '85.7%' }
//           ].map(stat => (
//             <Card key={stat.label} className="bg-white shadow-sm rounded-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Data Table */}
//         <Card className="bg-white shadow-md rounded-lg">
//           <CardHeader>
//             <CardTitle>{filterType === 'student' ? 'Student-wise Fee Report' : 'Class-wise Fee Report'}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               {filterType === 'student' ? (
//                 <Table className="min-w-[700px]">
//                   <TableHeader>
//                     <TableRow className="bg-gray-100">
//                       <TableHead>Student ID</TableHead>
//                       <TableHead>Student Name</TableHead>
//                       <TableHead>Class</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Payment Date</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                       <TableHead>Delete</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {studentWiseData.length > 0 ? (
//                       studentWiseData.map(student => (
//                         <TableRow key={student.id} className="hover:bg-gray-50">
//                           <TableCell>{student.id}</TableCell>
//                           <TableCell>{student.name}</TableCell>
//                           <TableCell>{student.class}</TableCell>
//                           <TableCell>{student.amount}</TableCell>
//                           <TableCell>{student.date}</TableCell>
//                           <TableCell>
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs ${
//                                 student.status === 'Paid'
//                                   ? 'bg-green-100 text-green-800'
//                                   : student.status === 'Pending'
//                                   ? 'bg-yellow-100 text-yellow-800'
//                                   : 'bg-red-100 text-red-800'
//                               }`}
//                             >
//                               {student.status}
//                             </span>
//                           </TableCell>
//                           <TableCell>
//                             <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
//                               <Edit className="w-4 h-4 mr-1" /> Edit
//                             </Button>
//                           </TableCell>
//                           <TableCell>
//                             <Button size="sm" variant="outline" onClick={() => handleDeleteStudent(student.id)}>
//                               <Trash className="w-4 h-4 text-red-600" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={8} className="text-center py-4 text-gray-500">
//                           No student fee data available
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <Table className="min-w-[600px]">
//                   <TableHeader>
//                     <TableRow className="bg-gray-100">
//                       <TableHead>Class</TableHead>
//                       <TableHead>Total Students</TableHead>
//                       <TableHead>Collected</TableHead>
//                       <TableHead>Pending</TableHead>
//                       <TableHead>Collection %</TableHead>
//                       <TableHead>Delete</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {classWiseData.length > 0 ? (
//                       classWiseData.map(classData => (
//                         <TableRow key={classData.class} className="hover:bg-gray-50">
//                           <TableCell>{classData.class}</TableCell>
//                           <TableCell>{classData.totalStudents}</TableCell>
//                           <TableCell className="text-green-600">{classData.collected}</TableCell>
//                           <TableCell className="text-red-600">{classData.pending}</TableCell>
//                           <TableCell>
//                             <span
//                               className={`px-2 py-1 rounded text-xs ${
//                                 parseFloat(classData.percentage) >= 90
//                                   ? 'bg-green-100 text-green-800'
//                                   : parseFloat(classData.percentage) >= 80
//                                   ? 'bg-yellow-100 text-yellow-800'
//                                   : 'bg-red-100 text-red-800'
//                               }`}
//                             >
//                               {classData.percentage}
//                             </span>
//                           </TableCell>
//                           <TableCell>
//                             <Button size="sm" variant="outline" onClick={() => handleDeleteClass(classData.class)}>
//                               <Trash className="w-4 h-4 text-red-600" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center py-4 text-gray-500">
//                           No class fee data available
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Edit Modal */}
//         <EditFeeModal
//           isOpen={showEditModal}
//           onClose={() => setShowEditModal(false)}
//           record={editingRecord}
//           onUpdateRecord={handleUpdateRecord}
//         />

//         {/* Add Student Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
//             <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg mx-4">
//               <h2 className="text-lg font-semibold mb-4">Add New Student Fee Record</h2>
//               <form
//                 onSubmit={(e: any) => {
//                   e.preventDefault();
//                   const newRecord = {
//                     id: e.target.id.value.trim(),
//                     name: e.target.name.value.trim(),
//                     class: e.target.class.value.trim(),
//                     amount: e.target.amount.value.trim(),
//                     status: e.target.status.value,
//                     date: e.target.date.value,
//                     remarks: e.target.remarks.value
//                   };
//                   handleAddRecord(newRecord);
//                   setShowAddModal(false);
//                 }}
//                 className="space-y-4"
//               >
//                 <input name="id" placeholder="Student ID" required className="w-full border px-3 py-2 rounded" />
//                 <input name="name" placeholder="Student Name" required className="w-full border px-3 py-2 rounded" />
//                 <input name="class" placeholder="Class" required className="w-full border px-3 py-2 rounded" />
//                 <input name="amount" placeholder="Amount (e.g., 12000)" required className="w-full border px-3 py-2 rounded" />
//                 <input name="date" type="date" required className="w-full border px-3 py-2 rounded" />
//                 <select name="status" className="w-full border px-3 py-2 rounded" required>
//                   <option value="Paid">Paid</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Overdue">Overdue</option>
//                 </select>
//                 <input name="remarks" placeholder="Remarks" className="w-full border px-3 py-2 rounded" />
//                 <div className="flex flex-col sm:flex-row justify-end gap-2">
//                   <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto">
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="w-full sm:w-auto">Add</Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeeReports;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, DollarSign, Users, GraduationCap, Edit, Plus, Trash, Calendar, BookOpen } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import EditFeeModal from '@/components/EditFeeModal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "@/api/api";

const FeeReports = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('class'); // Default to class-wise for principal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSetFeeModal, setShowSetFeeModal] = useState(false);
  const [newClassFee, setNewClassFee] = useState({
    class: '',
    feeType: '',
    amount: '',
    paymentType: '', // term-wise, monthly, quarterly, one-time
    dueDate: ''
  });

  const [studentWiseData, setStudentWiseData] = useState<any[]>([]);
  const [classWiseData, setClassWiseData] = useState<any[]>([]);

  useEffect(() => {
    if (filterType === 'student') fetchStudentWiseFees();
    else fetchClassWiseFees();
  }, [filterType]);

  const fetchStudentWiseFees = async () => {
    try {
      const res = await api.get(`/fee/student`);
      setStudentWiseData(res.data);
    } catch {
      console.error('Failed to load student-wise fee data.');
    }
  };

  const fetchClassWiseFees = async () => {
    try {
      const res = await api.get(`/fee/class`);
      setClassWiseData(res.data);
    } catch {
      console.error('Failed to load class-wise fee data.');
    }
  };

  const handleSetClassFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/fee/class-setting`, newClassFee);
      fetchClassWiseFees();
      setShowSetFeeModal(false);
      setNewClassFee({ class: '', feeType: '', amount: '', paymentType: '', dueDate: '' });
      toast.success('✅ Class fee set successfully! Student app will show this fee.');
    } catch {
      toast.error('❌ Failed to set class fee.');
    }
  };

  const handleUpdateRecord = async (updatedRecord: any) => {
    try {
      await api.put(`/fee/${updatedRecord.id}`, updatedRecord);
      fetchStudentWiseFees();
      setShowEditModal(false);
      toast.success('✅ Record updated successfully!');
    } catch {
      toast.error('❌ Failed to update record.');
    }
  };

  const handleAddRecord = async (newRecord: any) => {
    try {
      newRecord.amount = newRecord.amount.replace(/[₹,]/g, '');
      await api.post(`/fee`, newRecord);
      fetchStudentWiseFees();
      toast.success('✅ Student fee record added!');
    } catch {
      toast.error('❌ Failed to add student fee.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Delete this student fee record?')) return;
    try {
      await api.delete(`/fee/${id}`);
      fetchStudentWiseFees();
      toast.success('🗑️ Student fee deleted!');
    } catch {
      toast.error('❌ Failed to delete student fee.');
    }
  };

  const handleDeleteClassFee = async (className: string) => {
    if (!window.confirm(`Delete fee settings for ${className}?`)) return;
    try {
      await api.delete(`/fee/class-setting/${className}`);
      fetchClassWiseFees();
      toast.success('🗑️ Class fee settings deleted!');
    } catch {
      toast.error('❌ Failed to delete class fee.');
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 relative">
      <AnimatedBackground />
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <Button
              onClick={() => navigate('/dashboard/principal')}
              className="bg-white text-black border border-black hover:bg-gray-100 flex items-center justify-center w-full sm:w-auto"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-black" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Fee Management</h1>
                <p className="text-gray-600 text-sm">Set class fees → Auto appears in student app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setFilterType('student')}
            variant={filterType === 'student' ? 'default' : 'outline'}
            className="w-full sm:w-auto"
          >
            <Users className="w-4 h-4 mr-2" /> Student Payments
          </Button>
          <Button
            onClick={() => setFilterType('class')}
            variant={filterType === 'class' ? 'default' : 'outline'}
            className="w-full sm:w-auto"
          >
            <GraduationCap className="w-4 h-4 mr-2" /> Class Fee Settings
          </Button>
          {filterType === 'class' && (
            <Button
              onClick={() => setShowSetFeeModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto sm:ml-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> Set Class Fee
            </Button>
          )}
          {filterType === 'student' && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto sm:ml-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Payment
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Set', color: 'text-green-600', value: '₹12,45,000' },
            { label: 'Collected', color: 'text-blue-600', value: '₹9,41,000' },
            { label: 'Pending', color: 'text-yellow-600', value: '₹2,04,000' },
            { label: 'Collection %', color: 'text-purple-600', value: '75.6%' }
          ].map(stat => (
            <Card key={stat.label} className="bg-white shadow-sm rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Table */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>{filterType === 'student' ? 'Student Payment Records' : 'Class Fee Settings (Student App)'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filterType === 'student' ? (
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentWiseData.length > 0 ? (
                      studentWiseData.map(student => (
                        <TableRow key={student.id} className="hover:bg-gray-50">
                          <TableCell>{student.name} ({student.id})</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell className="font-medium">₹{student.amount}</TableCell>
                          <TableCell className="text-green-600 font-medium">₹{student.paid || '0'}</TableCell>
                          <TableCell>{student.date}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.status === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : student.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No payment records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>Class</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classWiseData.length > 0 ? (
                      classWiseData.map(fee => (
                        <TableRow key={`${fee.class}-${fee.feeType}`} className="hover:bg-gray-50">
                          <TableCell className="font-semibold">{fee.class}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span>{fee.feeType}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-2xl font-bold text-green-600">₹{fee.amount}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {fee.paymentType}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="w-3 h-3" />
                              {fee.dueDate}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{fee.studentCount || 0}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteClassFee(fee.class)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No class fee settings. Set fees for classes to appear in student app.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <EditFeeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          record={editingRecord}
          onUpdateRecord={handleUpdateRecord}
        />

        {/* Set Class Fee Modal */}
        {showSetFeeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                Set Class Fee
              </h2>
              <form onSubmit={handleSetClassFee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <input
                    value={newClassFee.class}
                    onChange={(e) => setNewClassFee({...newClassFee, class: e.target.value})}
                    placeholder="e.g., 10A"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label>
                  <input
                    value={newClassFee.feeType}
                    onChange={(e) => setNewClassFee({...newClassFee, feeType: e.target.value})}
                    placeholder="Tuition, Exam, Library, etc."
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                  <input
                    value={newClassFee.amount}
                    onChange={(e) => setNewClassFee({...newClassFee, amount: e.target.value})}
                    placeholder="15000"
                    type="number"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type *</label>
                  <select
                    value={newClassFee.paymentType}
                    onChange={(e) => setNewClassFee({...newClassFee, paymentType: e.target.value})}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select payment schedule</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                    <option value="Annual">Annual</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="One-time">One-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input
                    value={newClassFee.dueDate}
                    onChange={(e) => setNewClassFee({...newClassFee, dueDate: e.target.value})}
                    type="date"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSetFeeModal(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    Set Fee for Class
                  </Button>
                </div>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                💡 This fee will automatically appear in student app for payment
              </p>
            </div>
          </div>
        )}

        {/* Add Student Payment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg mx-4">
              <h2 className="text-lg font-semibold mb-4">Add Payment Record</h2>
              <form
                onSubmit={(e: any) => {
                  e.preventDefault();
                  const newRecord = {
                    id: e.target.id.value.trim(),
                    name: e.target.name.value.trim(),
                    class: e.target.class.value.trim(),
                    amount: e.target.amount.value.trim(),
                    paid: e.target.paid.value.trim(),
                    status: e.target.status.value,
                    date: e.target.date.value,
                  };
                  handleAddRecord(newRecord);
                  setShowAddModal(false);
                }}
                className="space-y-4"
              >
                <input name="id" placeholder="Student ID" required className="w-full border px-3 py-2 rounded" />
                <input name="name" placeholder="Student Name" required className="w-full border px-3 py-2 rounded" />
                <input name="class" placeholder="Class" required className="w-full border px-3 py-2 rounded" />
                <input name="amount" placeholder="Total Amount" required className="w-full border px-3 py-2 rounded" />
                <input name="paid" placeholder="Amount Paid" className="w-full border px-3 py-2 rounded" />
                <input name="date" type="date" required className="w-full border px-3 py-2 rounded" />
                <select name="status" className="w-full border px-3 py-2 rounded" required>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">Add Payment</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeReports;
