const mongoose = require("mongoose");

const interestedBuyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const vehicleSchema = new mongoose.Schema(
  {
    sellerName: { type: String, required: true },
    sellerPhone: { type: String, required: true },

    makeModel: { type: String, required: true },
    vehicleType: { type: String },
    year: { type: Number },
    rcNumber: { type: String, required: true },
    price: { type: String },
    kmDriven: { type: String },
    fuelType: { type: String },
    location: { type: String },
    description: { type: String },
    photos: [{ type: String }],

    status: {
      type: String,
      enum: ["pending", "live", "rejected", "sold"],
      default: "pending"
    },

    publishedAt: { type: Date },
    interestedBuyers: [interestedBuyerSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
