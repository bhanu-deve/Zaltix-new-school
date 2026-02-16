// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { ArrowLeft, Download, User, Search, Plus, Trash2, Edit } from 'lucide-react';
// import AddStaffModal from '@/components/AddStaffModal';
// import * as XLSX from 'xlsx';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from '@/api/api';

// /* ================= TYPES ================= */

// interface Staff {
//   _id: string;
//   id?: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: string;
//   subjects: string[];
//   classes: string[];
//   joinDate: string;
//   status: 'Active' | 'On Leave' | 'Inactive';
// }


// /* ================= COMPONENT ================= */

// const StaffManagement = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
//   const [staffData, setStaffData] = useState<Staff[]>([]);

//   /* ================= FETCH ================= */

//   const fetchStaffData = async () => {
//     try {
//       const res = await api.get('/Addstaff');
//       setStaffData(res.data || []);
//     } catch (error) {
//       toast.error('Failed to load staff');
//     }
//   };

//   useEffect(() => {
//     fetchStaffData();
//   }, []);

//   /* ================= ADD / UPDATE ================= */

//   const handleAddOrUpdateStaff = async (staff: Staff) => {
//     try {
//       if (editingStaff) {
//         // UPDATE
//         await api.put(`/Addstaff/${editingStaff._id}`, staff);
//         toast.success('Staff updated successfully');
//       } else {
//         // CREATE
//         await api.post('/Addstaff', staff);
//         toast.success('Staff added successfully');
//       }

//       setShowAddModal(false);
//       setEditingStaff(null);
//       fetchStaffData();
//     } catch (error) {
//       toast.error('Operation failed');
//     }
//   };

//   /* ================= DELETE ================= */

//   const handleDeleteStaff = async (id: string) => {
//     if (!window.confirm('Are you sure?')) return;

//     try {
//       await api.delete(`/Addstaff/${id}`);
//       toast.success('Staff deleted');
//       fetchStaffData();
//     } catch (error) {
//       toast.error('Delete failed');
//     }
//   };

//   /* ================= FILTER ================= */

//   const filteredStaff = staffData.filter(staff =>
//     staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     staff.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   /* ================= EXPORT ================= */

//   const exportStaffList = () => {
//     const data = staffData.map(s => ({
//       Name: s.name,
//       Role: s.role,
//       Subjects: s.subjects.join(', '),
//       Classes: s.classes.join(', '),
//       Email: s.email,
//       Phone: s.phone,
//       Status: s.status,
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Staff');
//     XLSX.writeFile(wb, 'staff.xlsx');
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
//       <ToastContainer autoClose={1500} />

//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <Button onClick={() => navigate('/dashboard/principal')} variant="outline">
//             <ArrowLeft className="w-4 h-4 mr-2" /> Back
//           </Button>

//           <h1 className="text-2xl font-bold">Staff Management</h1>

//           <div className="flex gap-2">
//             <Button
//               onClick={() => {
//                 setEditingStaff(null);
//                 setShowAddModal(true);
//               }}
//               className="bg-blue-600 text-white"
//             >
//               <Plus className="w-4 h-4 mr-1" /> Add Staff
//             </Button>

//             <Button onClick={exportStaffList} className="bg-green-600 text-white">
//               <Download className="w-4 h-4 mr-1" /> Export
//             </Button>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <Input
//             placeholder="Search staff..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {/* Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Staff Directory</CardTitle>
//           </CardHeader>

//           <CardContent className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th>Name</th>
//                   <th>Role</th>
//                   <th>Subjects</th>
//                   <th>Classes</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredStaff.map(staff => (
//                   <tr key={staff._id} className="border-b">
//                     <td>
//                       <div className="font-medium">{staff.name}</div>
//                       <div className="text-xs text-gray-500">{staff.email}</div>
//                     </td>

//                     <td>{staff.role}</td>

//                     <td>
//                       {staff.subjects.map((s, i) => (
//                         <span key={i} className="px-2 py-1 mr-1 bg-blue-100 text-xs rounded">
//                           {s}
//                         </span>
//                       ))}
//                     </td>

//                     <td>
//                       {staff.classes.map((c, i) => (
//                         <span key={i} className="px-2 py-1 mr-1 bg-green-100 text-xs rounded">
//                           {c}
//                         </span>
//                       ))}
//                     </td>

//                     <td>{staff.status}</td>

//                     <td className="flex gap-2">
//                       {/* EDIT */}
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setEditingStaff(staff);
//                           setShowAddModal(true);
//                         }}
//                       >
//                         <Edit className="w-4 h-4 mr-1" />
//                         Edit
//                       </Button>

//                       {/* DELETE */}
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={() => handleDeleteStaff(staff._id)}
//                       >
//                         <Trash2 className="w-4 h-4 mr-1" />
//                         Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>

//         {/* MODAL */}
//         <AddStaffModal
//           isOpen={showAddModal}
//           onClose={() => {
//             setShowAddModal(false);
//             setEditingStaff(null);
//           }}
//           onAddStaff={handleAddOrUpdateStaff}
//           editData={editingStaff}   // 🔥 IMPORTANT
//         />
//       </div>
//     </div>
//   );
// };

// export default StaffManagement;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  photo?: string;
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
      console.log('Staff data received:', res.data);
      
      // Log each staff member's photo status
      if (res.data && res.data.length > 0) {
        res.data.forEach((staff: Staff, index: number) => {
          console.log(`Staff ${index} (${staff.name}):`, {
            hasPhoto: !!staff.photo,
            photoLength: staff.photo?.length,
            subjects: staff.subjects,
            classes: staff.classes
          });
        });
      }
      
      setStaffData(res.data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load staff');
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const handleAddOrUpdateStaff = async (staff: Staff) => {
    try {
      console.log('Sending to API:', {
        ...staff,
        photo: staff.photo ? `Photo present (length: ${staff.photo.length})` : 'No photo'
      });

      if (editingStaff) {
        // UPDATE
        const response = await api.put(`/Addstaff/${editingStaff._id}`, staff);
        console.log('Update response:', response.data);
        toast.success('Staff updated successfully');
      } else {
        // CREATE
        const response = await api.post('/Addstaff', staff);
        console.log('Create response:', response.data);
        toast.success('Staff added successfully');
      }

      setShowAddModal(false);
      setEditingStaff(null);
      fetchStaffData();
    } catch (error: any) {
      console.error('Operation failed:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Operation failed');
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

  /* ================= GET INITIALS ================= */

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Photo</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Role</th>
                  <th className="text-left py-2">Subjects</th>
                  <th className="text-left py-2">Classes</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.map(staff => (
                  <tr key={staff._id} className="border-b hover:bg-gray-50">
                    {/* Photo Column */}
                    <td className="py-3">
                      <Avatar className="h-10 w-10">
                        {staff.photo ? (
                          <AvatarImage src={staff.photo} alt={staff.name} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getInitials(staff.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </td>

                    {/* Name Column */}
                    <td className="py-3">
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.email}</div>
                    </td>

                    {/* Role Column */}
                    <td className="py-3">{staff.role}</td>

                    {/* Subjects Column */}
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {staff.subjects.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-xs rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Classes Column */}
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {staff.classes.map((c, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-xs rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 
                          staff.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {staff.status}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3">
                      <div className="flex gap-2">
                        {/* EDIT */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingStaff(staff);
                            setShowAddModal(true);
                          }}
                          className="flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>

                        {/* DELETE */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteStaff(staff._id)}
                          className="flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredStaff.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No staff members found
              </div>
            )}
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
          editData={editingStaff}
        />
      </div>
    </div>
  );
};

export default StaffManagement;
