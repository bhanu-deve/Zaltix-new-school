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
  // ===== CALCULATIONS =====

  let totalSet = 0;
  let totalCollected = 0;

  if (filterType === "student") {
    totalSet = studentWiseData.reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

    totalCollected = studentWiseData.reduce(
      (sum, fee) => sum + Number(fee.paidAmount || 0),
      0
    );
  } else {
    totalSet = classWiseData.reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

    // Class fees don’t have paidAmount
    totalCollected = studentWiseData.reduce(
      (sum, fee) => sum + Number(fee.paidAmount || 0),
      0
    );
  }

  const totalPending = totalSet - totalCollected;

  const collectionPercent =
    totalSet > 0
      ? ((totalCollected / totalSet) * 100).toFixed(1)
      : 0;
  // ========================
  useEffect(() => {
    if (filterType === 'student') fetchStudentWiseFees();
    else fetchClassWiseFees();
  }, [filterType]);

  const fetchStudentWiseFees = async () => {
    try {
      const res = await api.get(`/api/fees/student`);
      setStudentWiseData(res.data);
    } catch {
      console.error('Failed to load student-wise fee data.');
    }
  };

  const fetchClassWiseFees = async () => {
    try {
      const res = await api.get(`/api/fees/class`);
      setClassWiseData(res.data);
    } catch {
      console.error('Failed to load class-wise fee data.');
    }
  };

  const handleSetClassFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/fees/class`, {
        className: newClassFee.class,
        feeType: newClassFee.feeType,
        amount: Number(newClassFee.amount),
        paymentType: newClassFee.paymentType,
        dueDate: newClassFee.dueDate
      });

      toast.success('✅ Class fee set successfully! Student app will show this fee.');
    } catch {
      toast.error('❌ Failed to set class fee.');
    }
  };

  // const handleUpdateRecord = async (updatedRecord: any) => {
  //   try {
  //     await api.put(`/fee/${updatedRecord.id}`, updatedRecord);
  //     fetchStudentWiseFees();
  //     setShowEditModal(false);
  //     toast.success('✅ Record updated successfully!');
  //   } catch {
  //     toast.error('❌ Failed to update record.');
  //   }
  // };

  const handleAddRecord = async (newRecord: any) => {
    try {
      await api.post(`/api/fees/student`, {
        studentId: newRecord.id,
        studentName: newRecord.name,
        className: newRecord.class,
        feeType: "Custom Payment",
        amount: Number(newRecord.amount),
        paidAmount: Number(newRecord.paid || 0), // ✅ ADD THIS
        dueDate: newRecord.date,
        status:
          Number(newRecord.paid) >= Number(newRecord.amount)
            ? "Paid"
            : Number(newRecord.paid) > 0
            ? "Partial"
            : "Pending"
      });


      fetchStudentWiseFees();
      toast.success('✅ Student fee record added!');
    } catch {
      toast.error('❌ Failed to add student fee.');
    }
  };
  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure to delete this record?")) return;

    try {
      await api.delete(`/api/fees/student/${id}`);
      fetchStudentWiseFees();
      toast.success("✅ Record deleted successfully");
    } catch {
      toast.error("❌ Failed to delete record");
    }
  };

  const handleUpdateStudent = async (updatedData) => {
    try {
      await api.put(`/api/fees/student/${updatedData._id}`, updatedData);
      fetchStudentWiseFees();
      setShowEditModal(false);
      toast.success("✅ Record updated successfully");
    } catch {
      toast.error("❌ Failed to update record");
    }
  };
  const handleDeleteClassFee = async (id: string) => {
    if (!window.confirm("Delete this class fee setting?")) return;

    try {
      await api.delete(`/api/fees/class/${id}`);
      fetchClassWiseFees();
      toast.success("✅ Class fee deleted");
    } catch {
      toast.error("❌ Failed to delete class fee");
    }
  };

  




  // const handleDeleteStudent = async (id: string) => {
  //   if (!window.confirm('Delete this student fee record?')) return;
  //   try {
  //     await api.delete(`/fee/${id}`);
  //     fetchStudentWiseFees();
  //     toast.success('🗑️ Student fee deleted!');
  //   } catch {
  //     toast.error('❌ Failed to delete student fee.');
  //   }
  // };

  // const handleDeleteClassFee = async (className: string) => {
  //   if (!window.confirm(`Delete fee settings for ${className}?`)) return;
  //   try {
  //     await api.delete(`/fee/class-setting/${className}`);
  //     fetchClassWiseFees();
  //     toast.success('🗑️ Class fee settings deleted!');
  //   } catch {
  //     toast.error('❌ Failed to delete class fee.');
  //   }
  // };

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
            { label: 'Total Set', color: 'text-green-600', value: `₹${totalSet.toLocaleString()}` },
            { label: 'Collected', color: 'text-blue-600', value: `₹${totalCollected.toLocaleString()}` },
            { label: 'Pending', color: 'text-yellow-600', value: `₹${totalPending.toLocaleString()}` },
            { label: 'Collection %', color: 'text-purple-600', value: `${collectionPercent}%` }
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
                        <TableRow key={student._id} className="hover:bg-gray-50">
                          <TableCell>{student.studentName} ({student.studentId})</TableCell>
                          <TableCell>{student.className}</TableCell>
                          <TableCell className="font-medium">₹{student.amount}</TableCell>
                          <TableCell className="text-green-600 font-medium">
                            ₹{student.paidAmount || 0}
                          </TableCell>
                          <TableCell>{student.dueDate}</TableCell>

                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.status === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : student.status === 'Partial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {student.status}
                            </span>
                          </TableCell>

                          <TableCell className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRecord(student);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteStudent(student._id)}
                            >
                              <Trash className="w-4 h-4" />
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
                      <TableHead>Actions</TableHead>

                      {/* <TableHead>Delete</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classWiseData.length > 0 ? (
                      classWiseData.map(fee => (
                        <TableRow key={fee._id} className="hover:bg-gray-50">
                          <TableCell className="font-semibold">{fee.className}</TableCell>

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
                              variant="destructive"
                              onClick={() => handleDeleteClassFee(fee._id)}
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
        {/* <EditFeeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          record={editingRecord}
          onUpdateRecord={handleUpdateRecord}
        /> */}
        {showEditModal && editingRecord && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Edit Payment</h2>

              <form
                onSubmit={(e: any) => {
                  e.preventDefault();

                  const updated = {
                    ...editingRecord,
                    amount: Number(e.target.amount.value),
                    paidAmount: Number(e.target.paidAmount.value),
                    status:
                      Number(e.target.paidAmount.value) >= Number(e.target.amount.value)
                        ? "Paid"
                        : Number(e.target.paidAmount.value) > 0
                        ? "Partial"
                        : "Pending",
                  };

                  handleUpdateStudent(updated);
                }}
                className="space-y-4"
              >
                <input
                  name="amount"
                  defaultValue={editingRecord.amount}
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <input
                  name="paidAmount"
                  defaultValue={editingRecord.paidAmount}
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}


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
