import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users } from "lucide-react";
import api from "@/api/api";

const PrincipalStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);

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
                </tr>
              </thead>
              <tbody>
                {students.map(stu => (
                  <tr key={stu._id} className="border-t">
                    <td className="p-2">{stu.rollNumber}</td>
                    <td className="p-2">{stu.firstName} {stu.lastName}</td>
                    <td className="p-2">{stu.grade}{stu.section}</td>
                    <td className="p-2">
                      {new Date(stu.dateOfBirth).toLocaleDateString()}
                    </td>
                    <td className="p-2">{stu.parentName}</td>
                    <td className="p-2">{stu.parentPhone}</td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default PrincipalStudents;
