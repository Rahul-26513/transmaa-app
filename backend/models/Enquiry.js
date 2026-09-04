const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String },
    rcNumber: { type: String },

    enquiryType: {
      type: String,
      enum: ["Finance", "Insurance"],
      required: true
    },

    loanAmountRequested: { type: String },
    notes: { type: String },

    status: {
      type: String,
      enum: ["pending", "contacted"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
