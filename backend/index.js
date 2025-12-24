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
import AddFee from "./routes/AddFeeRoute.js";
import AddAttendence from './routes/AddAttendenceRoute.js';
import Timetable from "./routes/AddTimetableRoute.js";
import AddBus from "./routes/AddbusRoute.js";
import AddStudentBus from "./routes/AddStudentBusRoute.js";
import StudentFeedback from './routes/AddStudentFeedbackRoute.js';
import AuthRoute from "./routes/authRoute.js";
import AddStudent from "./routes/AddStudentRoute.js";


import { Db } from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoute);


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads/achievements', express.static(path.join(process.cwd(), 'uploads/achievements')));

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
app.use("/fee", AddFee);
app.use('/attendance', AddAttendence);
app.use('/timetable', Timetable);
app.use("/addbus", AddBus);
app.use('/addstudentbus', AddStudentBus);
app.use('/studentfeedback', StudentFeedback);
app.use("/students", AddStudent);
app.use(express.urlencoded({ extended: true }));


Db.on('error', (err) => console.error('MongoDB error:', err));

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
