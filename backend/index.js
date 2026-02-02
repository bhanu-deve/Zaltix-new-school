import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import AddStaffRoute from './routes/AddStaffRoute.js';
import AddStockRoute from './routes/AddStockRoute.js';
import AddSubjectRoute from './routes/AddSubjectRoute.js';
import AddDiaryRoute from './routes/AddDiaryRoute.js';
import AddProjectRoute from './routes/AddProjectRoute.js';
import AddMockTestRoute from './routes/AddmockTestRoute.js';
import AddNotificationRoute from './routes/AddNotificationRoute.js';
import AddFeedbackRoute from './routes/AddFeedbackRoute.js';
import AddEbookRouter from './routes/AddEbookRouter.js';
import AchievementRoutes from "./routes/AddAchievementRoute.js";
import AddGrade from "./routes/AddGradeRoute.js";
import Videos from "./routes/AddVideoRoute.js";
import AddPayroll from "./routes/AddPayrollRoute.js";
import AddAttendence from './routes/AddAttendenceRoute.js';
import AddBus from "./routes/AddbusRoute.js";
import AddStudentBus from "./routes/AddStudentBusRoute.js";
import StudentFeedback from './routes/AddStudentFeedbackRoute.js';
import AuthRoute from "./routes/authRoute.js";
import AddStudent from "./routes/AddStudentRoute.js";
import studentAuthRoute from "./routes/studentAuthRoute.js";
import ReportSubjectRoute from "./routes/ReportSubjectRoute.js";

import http from 'http';
import { Server } from 'socket.io';
import BusLocation from "./models/BusLocation.js";

import DriverAuthRoute from "./routes/driverAuthRoute.js";
import SubmitProjectRoute from "./routes/SubmitProjectRoute.js";
import ProjectSubmissionRoute from "./routes/ProjectSubmissionRoute.js";
import AddTimetableRoute from './routes/AddTimetableRoute.js';
import staffRoutes from './routes/staffRoutes.js';

import feeManagementRoutes from "./routes/feeManagementRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";








import { Db } from './config/db.js';

const app = express();

/* CREATE HTTP SERVER */
const server = http.createServer(app);

/* INITIALIZE SOCKET.IO */
export const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket"]
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-class", (classSection) => {
    socket.join(classSection);
  });

  socket.on("join-bus", (busId) => {
    socket.join(`bus-${busId}`);
  });

  socket.on("bus-location", async ({ busId, latitude, longitude }) => {
    if (!busId || !latitude || !longitude) return;

    await BusLocation.findOneAndUpdate(
      { busId },
      { latitude, longitude, updatedAt: new Date() },
      { upsert: true }
    );

    io.to(`bus-${busId}`).emit("bus-location", {
      busId,
      latitude,
      longitude,
      updatedAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ DOCKER HEALTHCHECK (SERVER ONLY) */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ✅ OPTIONAL READINESS CHECK (DB STATUS) */
app.get("/ready", (req, res) => {
  const dbState = Db.readyState === 1 ? "Connected" : "Disconnected";

  if (dbState !== "Connected") {
    return res.status(500).json({ status: "NOT_READY", database: dbState });
  }

  res.status(200).json({ status: "READY", database: dbState });
});

/* STATIC FILES */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads/achievements', express.static(path.join(process.cwd(), 'uploads/achievements')));

/* ROUTES */
app.use("/api/auth", AuthRoute);
app.use("/student-auth", studentAuthRoute);
app.use('/staff', staffRoutes);
app.use("/report-subjects", ReportSubjectRoute);
app.use('/timetable', AddTimetableRoute);

app.use("/api/fees", feeManagementRoutes);

app.use("/api/payment", paymentRoutes);





// /* ===== STATIC FILES ===== */
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// app.use('/uploads/achievements', express.static(path.join(process.cwd(), 'uploads/achievements')));



app.use("/Addstaff", AddStaffRoute);
app.use("/Addstock", AddStockRoute);
app.use("/subjects", AddSubjectRoute);
app.use("/AddDiary", AddDiaryRoute);
app.use("/AddProject", AddProjectRoute);
app.use("/AddTest", AddMockTestRoute);
app.use("/AddNotification", AddNotificationRoute);
app.use("/AddFeedback", AddFeedbackRoute);
app.use("/AddEbook", AddEbookRouter);
app.use('/achievements', AchievementRoutes);
app.use('/grades', AddGrade);
app.use('/videos', Videos);
app.use("/payroll", AddPayroll);
app.use('/attendance', AddAttendence);
app.use("/addbus", AddBus);
app.use('/addstudentbus', AddStudentBus);
app.use('/studentfeedback', StudentFeedback);
app.use("/students", AddStudent);
app.use("/driver", DriverAuthRoute);
app.use("/submitProject", SubmitProjectRoute);
app.use("/project-submissions", ProjectSubmissionRoute);

/* DB ERROR HANDLER */
Db.on('error', (err) => console.error('MongoDB error:', err));

/* START SERVER */
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
