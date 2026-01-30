import ClassFee from "../models/ClassFee.js";
import StudentFee from "../models/StudentFee.js";

/* ================= CLASS FEE ================= */

export const createClassFee = async (req, res) => {
  try {
    const fee = new ClassFee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= STUDENT FEE ================= */

export const createStudentFee = async (req, res) => {
  try {
    const fee = new StudentFee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= GET FEES FOR LOGGED STUDENT ================= */

export const getFeesForStudent = async (req, res) => {
  try {
    const { rollNo, className } = req.query;

    if (!rollNo || !className) {
      return res.status(400).json({ error: "Missing student data" });
    }

    // Student-specific fees
    const studentFees = await StudentFee.find({ studentId: rollNo });

    // Class-specific fees
    const classFees = await ClassFee.find({ className });

    const formattedStudentFees = studentFees.map(fee => ({
      feeType: fee.feeType,
      amount: fee.amount,
      paidAmount: fee.paidAmount || 0,
      dueDate: fee.dueDate,
      source: "STUDENT"
    }));

    const formattedClassFees = classFees.map(fee => ({
      feeType: fee.feeType,
      amount: fee.amount,
      paidAmount: 0,
      dueDate: fee.dueDate,
      source: "CLASS"
    }));

    res.json([...formattedStudentFees, ...formattedClassFees]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fees" });
  }
};
