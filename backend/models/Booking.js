const mongoose = require("mongoose");

const GOODS_TYPES = [
  "Timber/Plywood/Laminate",
  "Electrical/Electronics/Home Appliances",
  "General",
  "Building/Construction",
  "Catering/Restaurant/Event Management",
  "Machines/Equipments/Spare Parts/Metals",
  "Textile/Garments/Fashion Accessories",
  "Furniture/Home Furnishing",
  "House Shifting",
  "Ceramics/Sanitary/Hardware",
  "Paper/Packaging/Printed Material"
];

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },

    fromLocation: { type: String, required: true },
    toLocation: { type: String, required: true },

    shiftingDate: { type: Date },
    shiftingTime: { type: String },
    goodsType: { type: String },

    truckType: { type: String },
    truckCapacity: { type: String },

    loadWeight: { type: String },
    description: { type: String },
    specialInstructions: { type: String },
    distanceKm: { type: Number },
    customerExpectedCost: { type: Number },

    price: { type: Number },

    deliveryName: { type: String },
    deliveryPhone: { type: String },
    deliveryAddress: { type: String },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null
    },
    driverName: { type: String },
    driverPhone: { type: String },
    driverVehicle: { type: String },

    status: {
      type: String,
      enum: [
        "waiting",
        "accepted",
        "rejected",
        "driver_accepted",
        "on_the_way",
        "delivered"
      ],
      default: "waiting"
    },

    rejectionReason: { type: String },
    completedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
module.exports.GOODS_TYPES = GOODS_TYPES;
