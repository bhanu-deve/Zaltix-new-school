import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Crown, GraduationCap } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "@/api/api";
const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!role || (role !== 'principal' && role !== 'teacher')) {
      navigate('/');
    }
  }, [role, navigate]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("❌ Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "teacher") {
        localStorage.setItem("teacherName", res.data.user.name);
      }



      toast.success("✅ Login successful!");

      setTimeout(() => {
        // navigate(`/dashboard/${res.data.user.role}`);
        // ✅ NEW
        if (res.data.user.firstLogin) {
          navigate("/principal/change-password");
        } else {
          navigate(`/dashboard/${res.data.user.role}`);
        }


      }, 1000);

    } catch (err) {
      toast.error("❌ Invalid credentials");
    } finally {
      setIsLoading(false);
    }
    };

  const handleBackToHome = () => navigate('/');

  if (!role) return null;

  const isPrincipal = role === 'principal';
  const roleTitle = isPrincipal ? 'Principal' : 'Teacher';
  const roleIcon = isPrincipal ? <Crown className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />;
  const cardGradient = isPrincipal
    ? 'bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50'
    : 'bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
          onClick={handleBackToHome}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Login Card */}
        <Card className={`${cardGradient} border-0 shadow-xl backdrop-blur-sm`}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-white/30 backdrop-blur-sm">
              {roleIcon}
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {roleTitle} Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Welcome back! Please sign in to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-300"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-300"
                  required
                />
              </div>
              {role === "principal" && (
                <button
                  type="button"
                  onClick={() => navigate("/principal/forgot-password")}
                  style={{ color: "blue", marginTop: "10px" }}
                >
                  Forgot Password?
                </button>
              )}
              {role === "teacher" && (
                <button
                  type="button"
                  onClick={() => navigate("/teacher/forgot-password")}
                  style={{ color: "blue", marginTop: "10px" }}
                >
                  Forgot Password?
                </button>
              )}



              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : `Sign In as ${roleTitle}`}
              </Button>
            </form>

            {/* Demo Credentials */}
            {/* <div className="mt-6 text-center">
              <div className="text-xs text-gray-500 bg-white/50 p-2 rounded">
                <p><strong>Demo Credentials:</strong></p>
                <p>Principal: principal@school.com</p>
                <p>Password: admin123</p>

              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
