import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, UserPlus, Calendar, Eye, EyeOff, Copy } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import api from "@/api/api";


interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  grade: string;
  section: string;
  dateOfBirth: string;
  password: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
}

const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    rollNumber: '',
    grade: '',
    section: '',
    dateOfBirth: '',
    password: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: ''
  });

  // Generate password from date of birth
  const generatePasswordFromDOB = (dob: string): string => {
    // dob format: YYYY-MM-DD
    const [year, month, day] = dob.split("-");
    return `${day}${month}${year}`;
  };


  // Handle date of birth change
  const handleDateOfBirthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      dateOfBirth: value,
      password: generatePasswordFromDOB(value)
    }));
    setIsPasswordGenerated(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for date of birth
    if (name === 'dateOfBirth') {
      handleDateOfBirthChange(e as ChangeEvent<HTMLInputElement>);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password)
        .then(() => {
          alert('Password copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy password: ', err);
        });
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.dateOfBirth || !formData.password) {
    alert("Please enter date of birth to generate password.");
    return;
  }

  try {
    const response = await api.post("/students", formData);

    alert(
      `Student added successfully!\n\n` +
      `Name: ${formData.firstName} ${formData.lastName}\n` +
      `Roll Number: ${formData.rollNumber}\n` +
      `Password: ${formData.password}`
    );

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      rollNumber: '',
      grade: '',
      section: '',
      dateOfBirth: '',
      password: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: ''
    });

    setIsPasswordGenerated(false);

  } catch (error: any) {
    alert(error.response?.data?.message || "Failed to add student");
  }
 };


  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/principal')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-rose-100">
                <UserPlus className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Add Student</h1>
                <p className="text-sm text-gray-600">Register new students to the system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Information Alert */}
        {isPasswordGenerated && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong className="font-semibold">Password Generated!</strong>
                <p className="text-sm mt-1">
                  Password is automatically generated from Date of Birth (DDMMYYYY format).
                  Share this with the student for initial login.
                </p>
                {formData.dateOfBirth && (
                  <p className="text-sm mt-1">
                    <strong>Date of Birth:</strong> {formatDateForDisplay(formData.dateOfBirth)}
                  </p>
                )}
              </div>
              {formData.password && (
                <div className="flex items-center space-x-2">
                  <code className="px-3 py-1 bg-white border rounded text-sm font-mono">
                    {formData.password}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPassword}
                    className="flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Student Registration Form</CardTitle>
            <p className="text-sm text-gray-500">Fill in the details to add a new student</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Student Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                  />
                  <p className="text-xs text-gray-500">Optional - for communication</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number *</Label>
                  <Input
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Class *</Label>
                  <Input
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="e.g., 10th"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g., A, B, C"
                  />
                </div>
                
                {/* Date of Birth and Password Section */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500">Password will be generated automatically</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center justify-between">
                    <span>Generated Password *</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-6 px-2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="DDMMYYYY format"
                      readOnly
                      className="bg-gray-50"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs text-gray-500 font-mono">DDMMYYYY</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600">
                    Format: Day(2) + Month(2) + Year(4) = 8 digit password
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent Name *</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter parent's name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Parent Phone *</Label>
                    <Input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Parent Email</Label>
                    <Input
                      id="parentEmail"
                      name="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      placeholder="parent@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Student's initial password is their Date of Birth in DDMMYYYY format.
                    They should change it upon first login.
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard/principal')
}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                    disabled={!formData.password}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddStudent;