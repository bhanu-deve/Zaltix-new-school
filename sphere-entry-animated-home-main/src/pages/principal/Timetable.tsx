import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, Calendar, Save, Plus, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from "@/api/api";

const TimetableView = () => {
  const navigate = useNavigate();
  const [viewBy, setViewBy] = useState('class');
  const [selectedClass, setSelectedClass] = useState('10A');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [displaySchedule, setDisplaySchedule] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState(['10A', '10B', '11A', '11B']);
  // const [teachers, setTeachers] = useState(['Ms. Rose', 'Mr. Smith', 'Dr. Johnson', 'Mr. Kumar', 'Ms. Watson', 'Coach Carter', 'Mrs. Lee', 'Mr. Charles', 'Ms. Gomez']);
  const [newClassName, setNewClassName] = useState('');
  
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [teachers, setTeachers] = useState<string[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<
    { subject: string; teacher: string }[]
  >([]);
  const subjectColors = {
  Math: 'bg-blue-100 text-blue-800',
  English: 'bg-yellow-100 text-yellow-800',
  Science: 'bg-purple-100 text-purple-800',
  History: 'bg-green-100 text-green-800',
  Geography: 'bg-pink-100 text-pink-800',
  Art: 'bg-red-100 text-red-800',
  Music: 'bg-indigo-100 text-indigo-800',
  PE: 'bg-teal-100 text-teal-800',
  IT: 'bg-orange-100 text-orange-800',
  Break: 'bg-gray-200 text-gray-600',
};



  const getColorClass = (slot) => {
    if (!slot || typeof slot !== 'string') return subjectColors['Break'];
    const subject = slot.split(' - ')[0]?.trim();
    return subjectColors[subject] || 'bg-gray-100 text-gray-800';
  };

  // Initialize empty timetable
  const initializeTimetable = () => {
    const defaultTable = {};
    days.forEach(day => {
      defaultTable[day] = Array(timeSlots.length).fill('Break');
    });
    return defaultTable;
  };

  // Normalize timetable data
  const normalizeTimetable = (entries = {}) => {
    const normalized = initializeTimetable();
    for (const day of days) {
      if (entries[day]) {
        const filled = entries[day].slice(0, timeSlots.length);
        while (filled.length < timeSlots.length) {
          filled.push('Break');
        }
        normalized[day] = filled;
      }
    }
    return normalized;
  };

  // Fetch class timetable
  const fetchClassTimetable = async () => {
    try {
      const res = await api.get(`/timetable/${selectedClass}`);
      const entries = res.data?.data?.entries;
      const normalized = normalizeTimetable(entries);
      setDisplaySchedule(normalized);
    } catch (err) {
      console.error('Error fetching class timetable:', err);
      setDisplaySchedule(initializeTimetable());
      toast.error('❌ Failed to fetch timetable');
    }
  };

  // Fetch teacher timetable
  const fetchTeacherTimetable = async () => {
    try {
      const res = await api.get(`/timetable`);
      const timetables = res.data?.data || [];

      const schedule = {};
      days.forEach(day => {
        schedule[day] = Array(timeSlots.length).fill('Break');
      });

      timetables.forEach(({ className, entries }) => {
        days.forEach(day => {
          const daySlots = entries[day] || [];
          timeSlots.forEach((_, index) => {
            const slot = daySlots[index] ?? 'Break';
            if (
              typeof slot === 'string' &&
              selectedTeacher &&
              slot.toLowerCase().includes(selectedTeacher.toLowerCase().trim())
            ) {
              schedule[day][index] = `${slot} (${className})`;
            }
          });
        });
      });

      setDisplaySchedule(schedule);
    } catch (err) {
      console.error('Error fetching teacher timetable:', err);
      setDisplaySchedule({});
      toast.error('❌ Failed to fetch teacher schedule');
    }
  };

  // Fetch classes from API
  const fetchClasses = async () => {
    try {
      const res = await api.get('/timetable'); // get all timetables
      const classList = res.data.data.map((t: any) => t.className);
      setClasses([...new Set(classList)]);
    } catch (err) {
      console.error('Error fetching classes:', err);
      toast.error('❌ Failed to fetch classes');
    }
  };


  // Fetch teachers from API
  const fetchTeachers = async () => {
    try {
      const res = await api.get('/Addstaff');

      const onlyTeachers = res.data.filter(
        (t: any) => t.role.toLowerCase().includes('teacher')
      );

      setTeachers(onlyTeachers.map((t: any) => t.name));

      const mapping = onlyTeachers.flatMap((t: any) =>
        t.subjects.map((sub: string) => ({
          subject: sub,
          teacher: t.name,
        }))
      );

      setTeacherSubjects(mapping);
    } catch {
      toast.error('❌ Failed to fetch teachers');
    }
  };



  // Handle subject change for editing
  const handleSubjectChange = (day, timeIndex, subject) => {
    setDisplaySchedule(prev => ({
      ...prev,
      [day]: prev[day].map((s, i) => (i === timeIndex ? subject : s))
    }));
  };

  // Save timetable
  const saveTimetable = async () => {
    try {
      setIsLoading(true);
      const payload = {
        className: selectedClass,
        section: selectedClass.slice(-1),
        academicYear: '2024-25',
        entries: displaySchedule
      };
      await api.put(`/timetable/${selectedClass}`, payload);
      toast.success('✅ Timetable saved successfully');
    } catch (err) {
      console.error('Error saving timetable:', err);
      toast.error('❌ Failed to save timetable');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new class
  const addNewClass = async () => {
    if (!newClassName.trim()) {
      toast.error('❌ Please enter a class name');
      return;
    }
    
    try {
      const newClass = newClassName.trim();
      const payload = {
        className: newClass,
        section: newClass.slice(-1),
        academicYear: '2024-25',
        entries: initializeTimetable()
      };
      
      await api.post('/timetable', payload);
      
      setClasses([...classes, newClass]);
      setSelectedClass(newClass);
      setNewClassName('');
      setDisplaySchedule(initializeTimetable());
      toast.success(`✅ Class ${newClass} added successfully`);
    } catch (err) {
      console.error('Error adding class:', err);
      toast.error('❌ Failed to add new class');
    }
  };

  // Delete class
  const deleteClass = async () => {
    if (!window.confirm(`Are you sure you want to delete class ${selectedClass}?`)) return;
    
    try {
      await api.delete(`/timetable/${selectedClass}`);
      const updatedClasses = classes.filter(c => c !== selectedClass);
      setClasses(updatedClasses);
      if (updatedClasses.length > 0) {
        setSelectedClass(updatedClasses[0]);
      } else {
        setSelectedClass('');
      }
      toast.success(`✅ Class ${selectedClass} deleted successfully`);
    } catch (err) {
      console.error('Error deleting class:', err);
      toast.error('❌ Failed to delete class');
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Class ${selectedClass} Timetable`, 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

      const tableColumn = ['Time', ...days];
      const tableRows = [];

      timeSlots.forEach((slot, timeIndex) => {
        const row = [slot];
        days.forEach(day => {
          row.push(displaySchedule[day]?.[timeIndex] || 'Break');
        });
        tableRows.push(row);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 28,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
        columnStyles: { 0: { cellWidth: 25 } }
      });

      doc.save(`Timetable_${selectedClass}.pdf`);
      toast.success('📄 PDF exported successfully');
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('❌ Failed to export PDF');
    }
  };

  // Excel Export
  const exportTimetableExcel = () => {
    try {
      const exportData = [];

      timeSlots.forEach((slot, index) => {
        const row = { Time: slot };
        days.forEach(day => {
          row[day] = displaySchedule[day]?.[index] || 'Break';
        });
        exportData.push(row);
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Timetable');

      const filename =
        viewBy === 'teacher' && selectedTeacher
          ? `${selectedTeacher.replace(/\s+/g, '_').toLowerCase()}_timetable.xlsx`
          : `${selectedClass.toLowerCase()}_timetable.xlsx`;

      XLSX.writeFile(wb, filename);
      toast.success('📊 Excel exported successfully');
    } catch (error) {
      console.error('Excel Export Error:', error);
      toast.error('❌ Failed to export Excel');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  // Load timetable when view changes
  useEffect(() => {
    setIsLoading(true);
    if (viewBy === 'class') {
      fetchClassTimetable().finally(() => setIsLoading(false));
    } else if (viewBy === 'teacher') {
      fetchTeacherTimetable().finally(() => setIsLoading(false));
    }
  }, [viewBy, selectedClass, selectedTeacher]);

  if (isLoading && Object.keys(displaySchedule).length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-pink-50">
        <p className="text-gray-600 text-lg">Loading timetable...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/principal')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Master Timetable</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {viewBy === 'class' && (
              <>
                <Button 
                  onClick={saveTimetable} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Timetable
                </Button>
                <Button 
                  onClick={() => {
                    const newClass = prompt('Enter new class name (e.g., 12A):');
                    if (newClass) {
                      setNewClassName(newClass);
                      addNewClass();
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
                <Button 
                  onClick={deleteClass}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Class
                </Button>
              </>
            )}
            <Button onClick={exportTimetableExcel} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* View Selector and Filters */}
        <Card>
          <CardContent className="flex flex-col md:flex-row md:items-center gap-4 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="view-select" className="text-gray-700 font-medium">View By:</label>
                <select
                  id="view-select"
                  value={viewBy}
                  onChange={(e) => setViewBy(e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="class">By Class</option>
                  <option value="teacher">By Teacher</option>
                </select>
              </div>

              {viewBy === 'class' ? (
                <div className="flex items-center space-x-4">
                  <label htmlFor="class-select" className="text-gray-700 font-medium">Select Class:</label>
                  <select
                    id="class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <label htmlFor="teacher-select" className="text-gray-700 font-medium">Select Teacher:</label>
                  <select
                    id="teacher-select"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timetable Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {viewBy === 'teacher' && selectedTeacher 
                ? `${selectedTeacher}'s Schedule` 
                : `${selectedClass} Timetable (Editable)`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-600">Loading timetable...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm text-center">
                  <thead>
                    <tr>
                      <th className="border p-3 bg-gray-100 font-semibold text-left">Time</th>
                      {days.map(day => (
                        <th key={day} className="border p-3 bg-gray-100 font-semibold">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, timeIndex) => (
                      <tr key={slot}>
                        <td className="border p-3 bg-gray-50 font-medium text-left">{slot}</td>
                        {days.map(day => (
                          <td key={`${day}-${timeIndex}`} className="border p-2">
                            {viewBy === 'class' ? (
                              <select
                                value={displaySchedule[day]?.[timeIndex] || 'Break'}
                                onChange={(e) => handleSubjectChange(day, timeIndex, e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                              >
                                <option value="Break">Break</option>

                                {teacherSubjects.map((t, i) => (
                                  <option key={i} value={`${t.subject} - ${t.teacher}`}>
                                    {t.subject} - {t.teacher}
                                  </option>
                                ))}
                              </select>

                            ) : (
                              <div className={`p-2 rounded text-center font-medium ${getColorClass(displaySchedule[day]?.[timeIndex])}`}>
                                {displaySchedule[day]?.[timeIndex] || 'Break'}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        {viewBy === 'class' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-blue-800 font-medium">📝 Editing Instructions:</p>
              <ul className="text-blue-700 text-sm mt-2 space-y-1">
                <li>• Select a class from the dropdown above</li>
                <li>• Use the dropdowns in each cell to assign subjects</li>
                <li>• Click "Save Timetable" to save changes</li>
                <li>• Use "Add Class" to create a new timetable</li>
                <li>• Use "Delete Class" to remove a class timetable</li>
                <li>• Export options available for Excel and PDF formats</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TimetableView;