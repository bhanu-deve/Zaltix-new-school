import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

// Teacher module imports
import Attendance from "./pages/teacher/Attendance";
import Timetable from "./pages/teacher/Timetable";
import Subjects from "./pages/teacher/Subjects";
import Diary from "./pages/teacher/Diary";
import Projects from "./pages/teacher/Projects";
import Videos from "./pages/teacher/Videos";
import Tests from "./pages/teacher/Tests";
import Reports from "./pages/teacher/Reports";
import EBooks from "./pages/teacher/EBooks";
import Achievements from "./pages/teacher/Achievements";
import Notifications from "./pages/teacher/Notifications";
import Bus from "./pages/teacher/Bus";
import Feedback from "./pages/teacher/Feedback";
// import AddStudent from "./pages/principal/AddStudent"; // Import the new component

// Principal module imports
import AttendanceAnalytics from "./pages/principal/Attendance";
import TimetableView from "./pages/principal/Timetable";
import StaffManagement from "./pages/principal/StaffManagement";
import Payroll from "./pages/principal/Payroll";
import AcademicReports from "./pages/principal/AcademicReports";
import FeeReports from "./pages/principal/FeeReports";
import Inventory from "./pages/principal/Inventory";
import PrincipalNotifications from "./pages/principal/Notifications";
import PrincipalAchievements from "./pages/principal/Achievements";
import PrincipalFeedback from "./pages/principal/Feedback";
import AddBus from './pages/principal/BusTracking'
import PrincipalStudents from "./pages/principal/PrincipalStudents";
import ChangePrincipalPassword from "./pages/ChangePrincipalPassword";
import PrincipalForgotPassword from "./pages/PrincipalForgotPassword";
import TeacherForgotPassword from "./pages/TeacherForgotPassword";
import TeacherChangePassword from "./pages/teacher/ChangePassword";
import RequireAuth from "./routes/RequireAuth";
import AddStudent from "./pages/principal/AddStudent";
import Holidays from "./pages/principal/Holidays";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard/principal" element={<PrincipalDashboard />} /> */}
          <Route
            path="/dashboard/principal"
            element={
              <RequireAuth role="principal">
                <PrincipalDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/teacher"
            element={
              <RequireAuth role="teacher">
                <TeacherDashboard />
              </RequireAuth>
            }
          />
          
          {/* Teacher Module Routes */}
          {/* <Route path="/dashboard/teacher/attendance" element={<Attendance />} /> */}
          <Route
            path="/dashboard/teacher/attendance"
            element={
              <RequireAuth role="teacher">
                <Attendance />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/timetable" element={<Timetable />} /> */}
          <Route
            path="/dashboard/teacher/timetable"
            element={
              <RequireAuth role="teacher">
                <Timetable />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/subjects" element={<Subjects />} /> */}
          <Route
            path="/dashboard/teacher/subjects"
            element={
              <RequireAuth role="teacher">
                <Subjects />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/diary" element={<Diary />} /> */}
          <Route
            path="/dashboard/teacher/diary"
            element={
              <RequireAuth role="teacher">
                <Diary />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/projects" element={<Projects />} /> */}
          <Route
            path="/dashboard/teacher/projects"
            element={
              <RequireAuth role="teacher">
                <Projects />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/videos" element={<Videos />} /> */}
          <Route
            path="/dashboard/teacher/videos"
            element={
              <RequireAuth role="teacher">
                <Videos />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/tests" element={<Tests />} /> */}
          <Route
            path="/dashboard/teacher/tests"
            element={
              <RequireAuth role="teacher">
                <Tests />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/reports" element={<Reports />} /> */}
          <Route
            path="/dashboard/teacher/reports"
            element={
              <RequireAuth role="teacher">
                <Reports />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/ebooks" element={<EBooks />} /> */}
          <Route
            path="/dashboard/teacher/ebooks"
            element={
              <RequireAuth role="teacher">
                <EBooks />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/achievements" element={<Achievements />} /> */}
          <Route
            path="/dashboard/teacher/achievements"
            element={
              <RequireAuth role="teacher">
                <Achievements />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/notifications" element={<Notifications />} /> */}
          <Route
            path="/dashboard/teacher/notifications"
            element={
              <RequireAuth role="teacher">
                <Notifications />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/bus" element={<Bus />} /> */}
          <Route
            path="/dashboard/teacher/bus"
            element={
              <RequireAuth role="teacher">
                <Bus />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/teacher/feedback" element={<Feedback />} /> */}
          <Route
            path="/dashboard/teacher/feedback"
            element={
              <RequireAuth role="teacher">
                <Feedback />
              </RequireAuth>
            }
          />

          {/* <Route path="/dashboard/teacher/add-student" element={<AddStudent />} /> */}
          {/* <Route
            path="/dashboard/teacher/add-student"
            element={
              <RequireAuth role="teacher">
                <AddStudent />
              </RequireAuth>
            }
          /> */}
          
          {/* Principal Module Routes */}
          {/* <Route path="/dashboard/principal/attendance" element={<AttendanceAnalytics />} /> */}
          <Route
            path="/dashboard/principal/attendance"
            element={
              <RequireAuth role="principal">
                <AttendanceAnalytics />
              </RequireAuth>
            }
          />
          {/* <Route path="/dashboard/principal/timetable" element={<TimetableView />} /> */}
          <Route
            path="/dashboard/principal/timetable"
            element={
              <RequireAuth role="principal">
                <TimetableView />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/staff" element={<StaffManagement />} /> */}
          <Route
            path="/dashboard/principal/staff"
            element={
              <RequireAuth role="principal">
                <StaffManagement />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/payroll" element={<Payroll />} /> */}
          <Route
            path="/dashboard/principal/payroll"
            element={
              <RequireAuth role="principal">
                <Payroll />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/reports" element={<AcademicReports />} /> */}
          <Route
            path="/dashboard/principal/reports"
            element={
              <RequireAuth role="principal">
                <AcademicReports />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/fees" element={<FeeReports />} /> */}
          <Route
            path="/dashboard/principal/fees"
            element={
              <RequireAuth role="principal">
                <FeeReports />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/inventory" element={<Inventory />} /> */}
          <Route
            path="/dashboard/principal/inventory"
            element={
              <RequireAuth role="principal">
                <Inventory />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/notifications" element={<PrincipalNotifications />} /> */}
          <Route
            path="/dashboard/principal/notifications"
            element={
              <RequireAuth role="principal">
                <PrincipalNotifications />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/achievements" element={<PrincipalAchievements />} /> */}
          <Route
            path="/dashboard/principal/achievements"
            element={
              <RequireAuth role="principal">
                <PrincipalAchievements />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/feedback" element={<PrincipalFeedback />} /> */}
          <Route
            path="/dashboard/principal/feedback"
            element={
              <RequireAuth role="principal">
                <PrincipalFeedback />
              </RequireAuth>
              
            }
          />
          {/* <Route path="/dashboard/principal/bus" element={<AddBus />} /> */}
          <Route
            path="/dashboard/principal/bus"
            element={
              <RequireAuth role="principal">
                <AddBus />
              </RequireAuth>
              
            }
          />
          {/* <Route
            path="/dashboard/principal/students"
            element={<PrincipalStudents />}
          /> */}
          <Route
            path="/dashboard/principal/students"
            element={
              <RequireAuth role="principal">
                <PrincipalStudents />
              </RequireAuth>
              
            }
          />
          <Route
            path="/dashboard/principal/add-student"
            element={
              <RequireAuth role="principal">
                <AddStudent />
              </RequireAuth>
            }
          />

          

          <Route
            path="/principal/forgot-password"
            element={<PrincipalForgotPassword />}
          />
          <Route
            path="/dashboard/principal/holidays"
            element={
              <RequireAuth role="principal">
                <Holidays />
              </RequireAuth>
            }
          />


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="/principal/change-password"
            element={<ChangePrincipalPassword />}
          />
          <Route
            path="/teacher/forgot-password"
            element={<TeacherForgotPassword />}
          />
          <Route
            path="/dashboard/teacher/change-password"
            element={<TeacherChangePassword />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;