import AddBus from '../models/AddBus.js';
import Student from '../models/AddStudentBus.js';

// GET all buses
export const getAllBuses = async (req, res) => {
  try {
    const data = await AddBus.find().exec();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD new bus
export const createBus = async (req, res) => {
  try {
    const entry = new AddBus(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET students by busId (enriched data)
export const getBusStudents = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await AddBus.findOne({ busId }).exec();
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const students = await Student.find({ busId }).exec();

    const enriched = students.map(student => ({
      studentId: student._id.toString(),
      studentName: student.studentName,
      class: student.class,
      pickupPoint: student.pickupPoint,
      vehicle: student.vehicle,
      routeName: bus.routeName,
      routeId: bus.busId,
      driverName: bus.driver.name,
      phoneNumber: bus.driver.license,
      vehicleNumber: bus.driver.license,
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE bus
export const deleteBus = async (req, res) => {
  try {
    const deletedBus = await AddBus.findByIdAndDelete(req.params.id).exec();
    if (!deletedBus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json({ message: 'Bus deleted successfully', bus: deletedBus });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
};
