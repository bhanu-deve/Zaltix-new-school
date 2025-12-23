import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: [
        'Mathematics Teacher',
        'English Teacher',
        'Science Teacher',
        'Art Teacher',
        'Physical Education Teacher',
        'Librarian',
        'Lab Assistant'
      ]
    },
    subjects: {
      type: [String],
      required: true
    },
    classes: {
      type: [String],
      default: ['TBD']
    },
    joinDate: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

export const AddStaff = mongoose.model("Staff", StaffSchema);
