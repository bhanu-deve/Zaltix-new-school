import Holiday from "../models/Holiday.js";


// ✅ CREATE Holiday
export const createHoliday = async (req, res) => {
  try {
    const { name, date, type, description } = req.body;

    if (!name || !date || !type) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const holiday = await Holiday.create({
      name,
      date,
      type,
      description,
    });

    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET All Holidays
export const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ UPDATE Holiday
export const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedHoliday = await Holiday.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedHoliday) {
      return res.status(404).json({ message: "Holiday not found" });
    }

    res.status(200).json(updatedHoliday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ DELETE Holiday
export const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await Holiday.findByIdAndDelete(id);

    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }

    res.status(200).json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
