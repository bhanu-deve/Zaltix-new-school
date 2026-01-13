// import User from "../models/User.js";
// import bcrypt from "bcrypt";


// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


import User from "../models/User.js";
import { AddStaff } from "../models/AddStaff.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let staff = null;

    // ✅ IF TEACHER → FETCH STAFF DETAILS
    if (user.role === "teacher" && user.staffId) {
      staff = await AddStaff.findById(user.staffId).select("name subjects classes");
    }

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: staff?.name || null,   // ✅ THIS FIXES EVERYTHING
        staffId: user.staffId || null
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
