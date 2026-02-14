import { AddStaff } from "../models/AddStaff.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";



export const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await AddStaff.find().lean().exec();

    const formattedStaff = staffMembers.map(s => ({
      ...s,
      id: s._id.toString(),
    }));

    res.status(200).json(formattedStaff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ADD new staff member + CREATE LOGIN
 */
export const addStaff = async (req, res) => {
  try {
    const {
      name,
      role,
      subjects,
      classes,
      joinDate,
      email,
      phone,
      status,
      password
    } = req.body;

    if (!name || !role || !subjects || !classes || !joinDate || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Login already exists for this email" });
    }

    // ✅ SAVE STAFF (NO PASSWORD HERE)
    const savedStaff = await AddStaff.create({
      name,
      role,
      subjects,
      classes,
      joinDate,
      email,
      phone,
      status: status || "Active"
    });

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ SAVE LOGIN USER
    await User.create({
      email,
      password: hashedPassword,
      role: "teacher",
      staffId: savedStaff._id
    });

    res.status(201).json({
      message: "Staff added and login created",
      staff: {
        ...savedStaff.toObject(),
        id: savedStaff._id.toString()
      }
    });

  } catch (err) {
    console.error("ADD STAFF ERROR:", err); // 🔴 KEEP THIS
    res.status(500).json({ error: err.message });
  }
};




/**
 * DELETE staff member + DELETE LOGIN
 */
export const deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await AddStaff.findByIdAndDelete(req.params.id).exec();

    if (!deletedStaff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    await User.findOneAndDelete({ staffId: deletedStaff._id });

    res.status(200).json({ message: "Staff and login deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * UPDATE staff member
 */
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      role,
      subjects,
      classes,
      joinDate,
      email,
      phone,
      status
    } = req.body;

    const updatedStaff = await AddStaff.findByIdAndUpdate(
      id,
      {
        name,
        role,
        subjects,
        classes,
        joinDate,
        email,
        phone,
        status
      },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      staff: {
        ...updatedStaff.toObject(),
        id: updatedStaff._id.toString()
      }
    });

  } catch (err) {
    console.error("UPDATE STAFF ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

