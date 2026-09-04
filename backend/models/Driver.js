const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Phone must be a 10-digit number"]
    },
    photo: { type: String },
    gender: { type: String },
    dob: { type: Date },
    bio: { type: String },

    experienceYears: { type: Number },
    vehicleType: { type: String },
    vehicleModel: { type: String },
    vehicleNumber: { type: String },
    dlNumber: { type: String },
    panNumber: { type: String },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },

    rating: { type: Number, default: 5.0 },
    tripsCompleted: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Driver", driverSchema);
