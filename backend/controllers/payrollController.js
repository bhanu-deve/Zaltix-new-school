import { Payroll } from '../models/Payroll.js';

// CREATE payroll
export const createPayroll = async (req, res) => {
  try {
    const { name, position, department, baseSalary, allowances, deductions, status } = req.body;

    if (!name || !position || !department || baseSalary == null || allowances == null || deductions == null) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const netSalary = baseSalary + allowances - deductions;

    const newEntry = new Payroll({
      name,
      position,
      department,
      baseSalary,
      allowances,
      deductions,
      netSalary,
      status: status || 'Pending'
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all payrolls
export const getPayrolls = async (req, res) => {
  try {
    const entries = await Payroll.find().exec();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE payroll
export const updatePayroll = async (req, res) => {
  try {
    const { name, position, department, baseSalary, allowances, deductions, status } = req.body;
    const netSalary = baseSalary + allowances - deductions;

    const updated = await Payroll.findByIdAndUpdate(
      req.params.id,
      { name, position, department, baseSalary, allowances, deductions, netSalary, status },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) return res.status(404).json({ error: 'Payroll not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE payroll
export const deletePayroll = async (req, res) => {
  try {
    const deleted = await Payroll.findByIdAndDelete(req.params.id).exec();
    if (!deleted) return res.status(404).json({ error: 'Payroll not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
