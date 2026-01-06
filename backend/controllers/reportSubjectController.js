import ReportSubject from "../models/ReportSubject.js";

export const saveReportSubjects = async (req, res) => {
  try {
    const { className, examType } = req.params;
    const { subjects } = req.body;

    const data = await ReportSubject.findOneAndUpdate(
      { className, examType },
      { className, examType, subjects },
      { upsert: true, new: true }
    );

    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to save report subjects" });
  }
};

export const getReportSubjects = async (req, res) => {
  try {
    const { className, examType } = req.params;

    const data = await ReportSubject.findOne({ className, examType });

    res.json(data || { subjects: [] });
  } catch {
    res.status(500).json({ error: "Failed to fetch report subjects" });
  }
};
