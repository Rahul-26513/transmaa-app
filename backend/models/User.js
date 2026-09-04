const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be a 10-digit number"]
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      select: false
    },

    role: {
      type: String,
      enum: ["customer", "driver", "staff", "admin"],
      default: "customer"
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected"],
      default: "active"
    },

    employeeId: {
      type: String,
      trim: true
    },

    department: {
      type: String,
      trim: true
    },

    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
