import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, User, Search, Plus, Trash2, Edit } from 'lucide-react';
import AddStaffModal from '@/components/AddStaffModal';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/api/api';

/* ================= TYPES ================= */

interface Staff {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  subjects: string[];
  classes: string[];
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}


/* ================= COMPONENT ================= */

const StaffManagement = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffData, setStaffData] = useState<Staff[]>([]);

  /* ================= FETCH ================= */

  const fetchStaffData = async () => {
    try {
      const res = await api.get('/Addstaff');
      setStaffData(res.data || []);
    } catch (error) {
      toast.error('Failed to load staff');
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const handleAddOrUpdateStaff = async (staff: Staff) => {
    try {
      if (editingStaff) {
        // UPDATE
        await api.put(`/Addstaff/${editingStaff._id}`, staff);
        toast.success('Staff updated successfully');
      } else {
        // CREATE
        await api.post('/Addstaff', staff);
        toast.success('Staff added successfully');
      }

      setShowAddModal(false);
      setEditingStaff(null);
      fetchStaffData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  /* ================= DELETE ================= */

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await api.delete(`/Addstaff/${id}`);
      toast.success('Staff deleted');
      fetchStaffData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  /* ================= FILTER ================= */

  const filteredStaff = staffData.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /* ================= EXPORT ================= */

  const exportStaffList = () => {
    const data = staffData.map(s => ({
      Name: s.name,
      Role: s.role,
      Subjects: s.subjects.join(', '),
      Classes: s.classes.join(', '),
      Email: s.email,
      Phone: s.phone,
      Status: s.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff');
    XLSX.writeFile(wb, 'staff.xlsx');
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <ToastContainer autoClose={1500} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate('/dashboard/principal')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <h1 className="text-2xl font-bold">Staff Management</h1>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditingStaff(null);
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Staff
            </Button>

            <Button onClick={exportStaffList} className="bg-green-600 text-white">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b">
                  <th>Name</th>
                  <th>Role</th>
                  <th>Subjects</th>
                  <th>Classes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.map(staff => (
                  <tr key={staff._id} className="border-b">
                    <td>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.email}</div>
                    </td>

                    <td>{staff.role}</td>

                    <td>
                      {staff.subjects.map((s, i) => (
                        <span key={i} className="px-2 py-1 mr-1 bg-blue-100 text-xs rounded">
                          {s}
                        </span>
                      ))}
                    </td>

                    <td>
                      {staff.classes.map((c, i) => (
                        <span key={i} className="px-2 py-1 mr-1 bg-green-100 text-xs rounded">
                          {c}
                        </span>
                      ))}
                    </td>

                    <td>{staff.status}</td>

                    <td className="flex gap-2">
                      {/* EDIT */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingStaff(staff);
                          setShowAddModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      {/* DELETE */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStaff(staff._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* MODAL */}
        <AddStaffModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingStaff(null);
          }}
          onAddStaff={handleAddOrUpdateStaff}
          editData={editingStaff}   // 🔥 IMPORTANT
        />
      </div>
    </div>
  );
};

export default StaffManagement;
