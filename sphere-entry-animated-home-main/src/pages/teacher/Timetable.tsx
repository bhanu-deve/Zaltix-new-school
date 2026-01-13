// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ArrowLeft, Download, Save } from 'lucide-react';
// // import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // import {Api_url} from '../config/config.js'
// import  api  from "@/api/api";

// const Timetable = () => {
//   const navigate = useNavigate();

//   const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const subjects = [
//     'Math - Mr. Smith', 'English - Ms. Rose', 'Science - Dr. Johnson',
//     'History - Mrs. Lee', 'Geography - Mr. Kumar', 'Art - Ms. Gomez',
//     'Music - Mr. Charles', 'PE - Coach Carter', 'IT - Ms. Watson', 'Break'
//   ];

//   const classOptions = ['10A', '10B', '11A', '11B'];
//   const [selectedClass, setSelectedClass] = useState('10A');
//   const [isLoading, setIsLoading] = useState(false);
//   const [timetableData, setTimetableData] = useState({});

//   const initializeTimetable = () => {
//     const defaultTable = {};
//     days.forEach(day => {
//       defaultTable[day] = Array(timeSlots.length).fill('Break');
//     });
//     return defaultTable;
//   };

//   const normalizeTimetable = (entries = {}) => {
//     const normalized = initializeTimetable();
//     for (const day of days) {
//       if (entries[day]) {
//         const filled = entries[day].slice(0, timeSlots.length);
//         while (filled.length < timeSlots.length) {
//           filled.push('Break');
//         }
//         normalized[day] = filled;
//       }
//     }
//     return normalized;
//   };

//   useEffect(() => {
//     const fetchTimetable = async () => {
//       setIsLoading(true);
//       try {
//         const res = await api.get(`/timetable/${selectedClass}`);
//         const entries = res.data?.data?.entries;
//         const normalized = normalizeTimetable(entries);
//         setTimetableData(normalized);
//       } catch (err) {
//         console.error('Error loading timetable:', err);
//         setTimetableData(initializeTimetable());
//         toast.error('❌ Failed to fetch timetable');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTimetable();
//   }, [selectedClass]);

//   const handleSubjectChange = (day, timeIndex, subject) => {
//     setTimetableData(prev => ({
//       ...prev,
//       [day]: prev[day].map((s, i) => (i === timeIndex ? subject : s))
//     }));
//   };

//   const saveTimetable = async () => {
//     try {
//       setIsLoading(true);
//       const payload = {
//         className: selectedClass,
//         section: selectedClass.slice(-1),
//         academicYear: '2024-25',
//         entries: timetableData
//       };
//       await api.post(`/timetable`, payload);
//       toast.success('✅ Timetable saved successfully');
//     } catch (err) {
//       console.error('Error saving timetable:', err);
//       toast.error('❌ Failed to save timetable');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const exportToPDF = () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFontSize(16);
//       doc.text(`Class ${selectedClass} Timetable`, 14, 15);
//       doc.setFontSize(10);
//       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

//       const tableColumn = ['Time', ...days];
//       const tableRows = [];

//       timeSlots.forEach((slot, timeIndex) => {
//         const row = [slot];
//         days.forEach(day => {
//           row.push(timetableData[day]?.[timeIndex] || 'Break');
//         });
//         tableRows.push(row);
//       });

//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 28,
//         theme: 'grid',
//         styles: { fontSize: 8, cellPadding: 3 },
//         headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
//         columnStyles: { 0: { cellWidth: 25 } }
//       });

//       doc.save(`Timetable_${selectedClass}.pdf`);
//       toast.success('📄 PDF exported successfully');
//     } catch (error) {
//       console.error('PDF Export Error:', error);
//       toast.error('❌ Failed to export PDF');
//     }
//   };

//   if (isLoading || Object.keys(timetableData).length === 0) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-blue-50">
//         <p className="text-gray-600 text-lg">Loading timetable...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
//       <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />

//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Dashboard
//             </Button>
//             <h1 className="text-2xl font-bold text-gray-800">Timetable Management</h1>
//           </div>
//           <div className="flex space-x-2">
//             <Button onClick={saveTimetable} className="bg-blue-600 hover:bg-blue-700 text-white">
//               <Save className="w-4 h-4 mr-2" />
//               Save
//             </Button>
//             <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white">
//               <Download className="w-4 h-4 mr-2" />
//               Export PDF
//             </Button>
//           </div>
//         </div>

//         {/* Class Selector */}
//         <Card>
//           <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
//             <div className="flex items-center space-x-4">
//               <label htmlFor="class-select" className="text-gray-700 font-medium">Select Class:</label>
//               <select
//                 id="class-select"
//                 value={selectedClass}
//                 onChange={(e) => setSelectedClass(e.target.value)}
//                 className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={isLoading}
//               >
//                 {classOptions.map(cls => (
//                   <option key={cls} value={cls}>{cls}</option>
//                 ))}
//               </select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Timetable Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Class {selectedClass} Timetable</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-sm text-center">
//                 <thead>
//                   <tr>
//                     <th className="border p-3 bg-gray-100 font-semibold text-left">Time</th>
//                     {days.map(day => (
//                       <th key={day} className="border p-3 bg-gray-100 font-semibold">{day}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {timeSlots.map((slot, timeIndex) => (
//                     <tr key={slot}>
//                       <td className="border p-3 bg-gray-50 font-medium text-left">{slot}</td>
//                       {days.map(day => (
//                         <td key={`${day}-${timeIndex}`} className="border p-2">
//                           <select
//                             value={timetableData[day]?.[timeIndex] || 'Break'}
//                             onChange={(e) => handleSubjectChange(day, timeIndex, e.target.value)}
//                             className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             {subjects.map(subject => (
//                               <option key={subject} value={subject}>{subject}</option>
//                             ))}
//                           </select>
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Timetable;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ArrowLeft, Download } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from "@/api/api";

// const Timetable = () => {
//   const navigate = useNavigate();

//   const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const subjects = [
//     'Math - Mr. Smith', 'English - Ms. Rose', 'Science - Dr. Johnson',
//     'History - Mrs. Lee', 'Geography - Mr. Kumar', 'Art - Ms. Gomez',
//     'Music - Mr. Charles', 'PE - Coach Carter', 'IT - Ms. Watson', 'Break'
//   ];

//   const classOptions = ['10A', '10B', '11A', '11B'];
//   const [selectedClass, setSelectedClass] = useState('10A');
//   const [isLoading, setIsLoading] = useState(false);
//   const [timetableData, setTimetableData] = useState({});

//   const initializeTimetable = () => {
//     const defaultTable = {};
//     days.forEach(day => {
//       defaultTable[day] = Array(timeSlots.length).fill('Break');
//     });
//     return defaultTable;
//   };

//   const normalizeTimetable = (entries = {}) => {
//     const normalized = initializeTimetable();
//     for (const day of days) {
//       if (entries[day]) {
//         const filled = entries[day].slice(0, timeSlots.length);
//         while (filled.length < timeSlots.length) {
//           filled.push('Break');
//         }
//         normalized[day] = filled;
//       }
//     }
//     return normalized;
//   };

//   useEffect(() => {
//     const fetchTimetable = async () => {
//       setIsLoading(true);
//       try {
//         const res = await api.get(`/timetable/${selectedClass}`);
//         const entries = res.data?.data?.entries;
//         const normalized = normalizeTimetable(entries);
//         setTimetableData(normalized);
//       } catch (err) {
//         console.error('Error loading timetable:', err);
//         setTimetableData(initializeTimetable());
//         toast.error('❌ Failed to fetch timetable');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTimetable();
//   }, [selectedClass]);

//   const exportToPDF = () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFontSize(16);
//       doc.text(`Class ${selectedClass} Timetable`, 14, 15);
//       doc.setFontSize(10);
//       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

//       const tableColumn = ['Time', ...days];
//       const tableRows = [];

//       timeSlots.forEach((slot, timeIndex) => {
//         const row = [slot];
//         days.forEach(day => {
//           row.push(timetableData[day]?.[timeIndex] || 'Break');
//         });
//         tableRows.push(row);
//       });

//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 28,
//         theme: 'grid',
//         styles: { fontSize: 8, cellPadding: 3 },
//         headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
//         columnStyles: { 0: { cellWidth: 25 } }
//       });

//       doc.save(`Timetable_${selectedClass}.pdf`);
//       toast.success('📄 PDF exported successfully');
//     } catch (error) {
//       console.error('PDF Export Error:', error);
//       toast.error('❌ Failed to export PDF');
//     }
//   };

//   if (isLoading || Object.keys(timetableData).length === 0) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-blue-50">
//         <p className="text-gray-600 text-lg">Loading timetable...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
//       <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />

//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Dashboard
//             </Button>
//             <h1 className="text-2xl font-bold text-gray-800">Class Timetable</h1>
//           </div>
//           <div className="flex space-x-2">
//             <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white">
//               <Download className="w-4 h-4 mr-2" />
//               Export PDF
//             </Button>
//           </div>
//         </div>

//         {/* Class Selector */}
//         <Card>
//           <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
//             <div className="flex items-center space-x-4">
//               <label htmlFor="class-select" className="text-gray-700 font-medium">Select Class:</label>
//               <select
//                 id="class-select"
//                 value={selectedClass}
//                 onChange={(e) => setSelectedClass(e.target.value)}
//                 className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={isLoading}
//               >
//                 {classOptions.map(cls => (
//                   <option key={cls} value={cls}>{cls}</option>
//                 ))}
//               </select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Read-Only Timetable Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Class {selectedClass} Timetable (View Only)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-sm text-center">
//                 <thead>
//                   <tr>
//                     <th className="border p-3 bg-gray-100 font-semibold text-left">Time</th>
//                     {days.map(day => (
//                       <th key={day} className="border p-3 bg-gray-100 font-semibold">{day}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {timeSlots.map((slot, timeIndex) => (
//                     <tr key={slot}>
//                       <td className="border p-3 bg-gray-50 font-medium text-left">{slot}</td>
//                       {days.map(day => (
//                         <td key={`${day}-${timeIndex}`} className="border p-3 bg-white">
//                           <span className="block p-2 font-medium text-gray-800">
//                             {timetableData[day]?.[timeIndex] || 'Break'}
//                           </span>
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Timetable;


// src/pages/teacher/Timetable.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ArrowLeft, Download } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from '@/api/api';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const Timetable = () => {
//   const navigate = useNavigate();

//   const timeSlots = [
//     '9:00-10:00',
//     '10:00-11:00',
//     '11:00-12:00',
//     '12:00-1:00',
//     '2:00-3:00',
//     '3:00-4:00',
//   ];

//   const days = [
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//   ];

//   // 🔹 logged-in teacher name (adjust key if different)
//   const teacherName = localStorage.getItem('teacherName') || '';

//   const [isLoading, setIsLoading] = useState(false);
//   const [displaySchedule, setDisplaySchedule] = useState<any>({});

//   const initializeTimetable = () => {
//     const table: any = {};
//     days.forEach((day) => {
//       table[day] = Array(timeSlots.length).fill('Free');
//     });
//     return table;
//   };

//   const normalizeTimetable = (entries: any = {}) => {
//     const normalized = initializeTimetable();
//     for (const day of days) {
//       if (entries[day]) {
//         const filled = entries[day].slice(0, timeSlots.length);
//         while (filled.length < timeSlots.length) {
//           filled.push('Free');
//         }
//         normalized[day] = filled;
//       }
//     }
//     return normalized;
//   };

//   const fetchTeacherTimetable = async () => {
//     if (!teacherName) return;

//     setIsLoading(true);
//     try {
//       const res = await api.get(
//         `/timetable/teacher/${encodeURIComponent(teacherName)}`
//       );
//       const normalized = normalizeTimetable(res.data?.data);
//       setDisplaySchedule(normalized);
//     } catch (err) {
//       toast.error('❌ Failed to fetch teacher timetable');
//       setDisplaySchedule(initializeTimetable());
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeacherTimetable();
//   }, [teacherName]);

//   const exportToPDF = () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFontSize(16);
//       doc.text(`Teacher Timetable`, 14, 15);
//       doc.setFontSize(10);
//       doc.text(`Teacher: ${teacherName}`, 14, 22);

//       const tableColumn = ['Time', ...days];
//       const tableRows: any[] = [];

//       timeSlots.forEach((slot, timeIndex) => {
//         const row = [slot];
//         days.forEach((day) => {
//           row.push(displaySchedule[day]?.[timeIndex] || 'Free');
//         });
//         tableRows.push(row);
//       });

//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 28,
//         theme: 'grid',
//         styles: { fontSize: 8, cellPadding: 3 },
//         headStyles: {
//           fillColor: [41, 128, 185],
//           textColor: 255,
//           halign: 'center',
//         },
//         columnStyles: { 0: { cellWidth: 25 } },
//       });

//       doc.save(`Teacher_Timetable.pdf`);
//       toast.success('📄 PDF exported successfully');
//     } catch {
//       toast.error('❌ Failed to export PDF');
//     }
//   };

//   if (isLoading || Object.keys(displaySchedule).length === 0) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-blue-50">
//         <p className="text-gray-600 text-lg">Loading timetable...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar
//         theme="colored"
//       />

//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <Button
//               onClick={() => navigate('/dashboard/teacher')}
//               variant="outline"
//               size="sm"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Dashboard
//             </Button>
//             <h1 className="text-2xl font-bold text-gray-800">
//               My Timetable
//             </h1>
//           </div>
//           <Button
//             onClick={exportToPDF}
//             className="bg-red-600 hover:bg-red-700 text-white"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             Export PDF
//           </Button>
//         </div>

//         {/* Timetable */}
//         <Card>
//           <CardHeader>
//             <CardTitle>{teacherName} Timetable</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-sm text-center">
//                 <thead>
//                   <tr>
//                     <th className="border p-3 bg-gray-100 font-semibold text-left">
//                       Time
//                     </th>
//                     {days.map((day) => (
//                       <th
//                         key={day}
//                         className="border p-3 bg-gray-100 font-semibold"
//                       >
//                         {day}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {timeSlots.map((slot, timeIndex) => (
//                     <tr key={slot}>
//                       <td className="border p-3 bg-gray-50 font-medium text-left">
//                         {slot}
//                       </td>
//                       {days.map((day) => (
//                         <td
//                           key={`${day}-${timeIndex}`}
//                           className="border p-3 bg-white"
//                         >
//                           <span className="block p-2 font-medium text-gray-800">
//                             {displaySchedule[day]?.[timeIndex] || 'Free'}
//                           </span>
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Timetable;



// src/pages/teacher/Timetable.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/api/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Timetable = () => {
  const navigate = useNavigate();

  /* ================== CONFIG ================== */
  // ✅ REAL teacher name from DB (TEMPORARY – WORKING)
  // const teacherName = 'Hero';
  const teacherName = localStorage.getItem("teacherName");
  if (!teacherName) {
    toast.error("Teacher not logged in");
    navigate("/login?role=teacher");
    return null;
  }



  const timeSlots = [
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-1:00',
    '2:00-3:00',
    '3:00-4:00',
  ];

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  /* ================== STATE ================== */
  const [isLoading, setIsLoading] = useState(true);
  const [displaySchedule, setDisplaySchedule] = useState(() => {
    const table: any = {};
    days.forEach(day => {
      table[day] = Array(timeSlots.length).fill('Break');
    });
    return table;
  });

  /* ================== FETCH ================== */
  useEffect(() => {
    setIsLoading(true);

    api
      .get(`/timetable/teacher/${encodeURIComponent(teacherName)}`)
      .then(res => {
        if (res.data?.data) {
          setDisplaySchedule(res.data.data);
        } else {
          toast.info('No classes assigned');
        }
      })
      .catch(() => {
        toast.error('Failed to fetch timetable');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /* ================== PDF ================== */
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Teacher Timetable`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Teacher: ${teacherName}`, 14, 22);

    const tableColumn = ['Time', ...days];
    const tableRows: any[] = [];

    timeSlots.forEach((slot, index) => {
      const row = [slot];
      days.forEach(day => {
        row.push(displaySchedule[day]?.[index] || 'Break');
      });
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save(`Teacher_${teacherName}_Timetable.pdf`);
  };

  /* ================== LOADING ================== */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-lg text-gray-600">Loading timetable...</p>
      </div>
    );
  }

  /* ================== UI ================== */
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard/teacher')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              My Timetable
            </h1>
          </div>
          <Button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Timetable */}
        <Card>
          <CardHeader>
            <CardTitle>{teacherName} Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-center">
                <thead>
                  <tr>
                    <th className="border p-3 bg-gray-100 text-left">Time</th>
                    {days.map(day => (
                      <th key={day} className="border p-3 bg-gray-100">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, index) => (
                    <tr key={slot}>
                      <td className="border p-3 bg-gray-50 text-left font-medium">
                        {slot}
                      </td>
                      {days.map(day => (
                        <td key={`${day}-${index}`} className="border p-3">
                          {displaySchedule[day]?.[index] || 'Break'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timetable;
