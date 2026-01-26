// export const teacherSubjectOnly = (subjectName) => {
//   return (req, res, next) => {
//     if (req.user.role !== "teacher") return res.sendStatus(403);
//     if (!req.user.subject.includes(subjectName)) return res.sendStatus(403);
//     next();
//   };
// };