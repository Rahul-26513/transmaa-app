require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Enquiry = require("../models/Enquiry");

async function seedDemoData() {
  await connectDB();

  let customer = await User.findOne({ phone: "7093124579" });

  if (!customer) {
    customer = await User.create({
      name: "Sai Teja",
      phone: "7093124579",
      email: "saiteja.demo@example.com",
      role: "customer",
      status: "active"
    });
  }

  await Booking.deleteMany({});
  await Driver.deleteMany({});
  await Vehicle.deleteMany({});
  await Enquiry.deleteMany({});
  await User.deleteMany({ role: "driver" });

  const driverUser1 = await User.create({
    name: "Mahesh Yadav",
    phone: "9848011223",
    email: "mahesh.driver.demo@example.com",
    role: "driver",
    status: "active"
  });

  const driverUser2 = await User.create({
    name: "Ramesh Chander",
    phone: "9849567123",
    email: "ramesh.driver.demo@example.com",
    role: "driver",
    status: "active"
  });

  const drivers = await Driver.insertMany([
    {
      userId: driverUser1._id,
      name: "Mahesh Yadav",
      phone: "9848011223",
      experienceYears: 8,
      vehicleType: "Container",
      vehicleModel: "Tata LPT 1109",
      vehicleNumber: "TS 09 EU 4812",
      dlNumber: "TS0920140089123",
      panNumber: "APPRC9812K",
      verificationStatus: "approved",
      status: "Active",
      rating: 4.9,
      tripsCompleted: 142
    },
    {
      userId: driverUser2._id,
      name: "Ramesh Chander",
      phone: "9849567123",
      experienceYears: 10,
      vehicleType: "Open Truck (6-Wheeler)",
      vehicleModel: "Tata 1109 LPT",
      vehicleNumber: "TS 07 UA 4821",
      dlNumber: "TS0920140089999",
      panNumber: "APPRC9812X",
      verificationStatus: "pending"
    }
  ]);

  await Booking.insertMany([
    {
      customerId: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      fromLocation: "Sircilla, Sircilla mandal, Rajanna Sircilla District, Telangana, 505301, India",
      toLocation: "Hitech City, Hitec - Kukatpally Main Road, Hyderabad, Telangana, 500081, India",
      shiftingDate: new Date("2026-09-25T13:00:00Z"),
      shiftingTime: "1:00 PM",
      goodsType: "House Shifting",
      truckType: "Open",
      truckCapacity: "7-11 Tons",
      status: "waiting"
    },
    {
      customerId: customer._id,
      customerName: "Priya Varma",
      customerPhone: "9121467890",
      fromLocation: "Textile Hub, General Bazaar, Secunderabad, TS",
      toLocation: "Retail Outlet, KPHB Colony, Hyderabad, TS",
      shiftingDate: new Date("2026-09-03T13:15:00Z"),
      shiftingTime: "1:15 PM",
      goodsType: "Textile/Garments/Fashion Accessories",
      truckType: "Container",
      truckCapacity: "7-11 Tons",
      price: 11000,
      status: "driver_accepted",
      driverId: drivers[0]._id,
      driverName: drivers[0].name,
      driverPhone: drivers[0].phone,
      driverVehicle: "TS 09 EU 4812 (Container 14ft)"
    },
    {
      customerId: customer._id,
      customerName: "Kishan Reddy",
      customerPhone: "9849012345",
      fromLocation: "Flat 402, Royal Palms, Madhapur, Hyderabad, TS",
      toLocation: "Plot 88, Sunrise Township, Gachibowli, Hyderabad, TS",
      shiftingDate: new Date("2026-09-05T09:30:00Z"),
      shiftingTime: "9:30 AM",
      goodsType: "House Shifting",
      truckType: "LCV",
      truckCapacity: "2-4 Tons",
      price: 6500,
      status: "accepted"
    }
  ]);

  await Vehicle.insertMany([
    {
      sellerName: "Pradeep Kurapati",
      sellerPhone: "9849188223",
      makeModel: "Tata 407 Gold 33 SFC",
      year: 2022,
      rcNumber: "TS 08 EX 9102",
      price: "8,50,000",
      kmDriven: "42,000 km",
      fuelType: "Diesel",
      location: "Kukatpally, Hyderabad",
      description: "Single owner vehicle, non-accidental, updated insurance and fitness certificates.",
      photos: [],
      status: "pending"
    },
    {
      sellerName: "Venkata Raman Logistics",
      sellerPhone: "9700122334",
      makeModel: "Mahindra Bolero Maxi Truck Plus",
      year: 2021,
      rcNumber: "TS 09 EC 3321",
      price: "5,80,000",
      kmDriven: "55,000 km",
      fuelType: "Diesel",
      location: "Uppal, Hyderabad",
      description: "Mint condition, newly fitted heavy duty radial tires, clear title.",
      photos: [],
      status: "live",
      publishedAt: new Date()
    }
  ]);

  await Enquiry.insertMany([
    {
      name: "Karthik Varma",
      phone: "9849233110",
      vehicleType: "Container 32ft Heavy Duty",
      rcNumber: "TS 09 EX 4421",
      enquiryType: "Finance",
      loanAmountRequested: "12,00,000",
      notes: "Requires fast-track loan approval for fleet expansion.",
      status: "pending"
    }
  ]);

  console.log("Demo data seeded successfully.");
  console.log("Demo customer phone: 7093124579 (use OTP 123456)");
  console.log("Demo approved driver phone: 9848011223 (use OTP 123456)");
  console.log("Demo pending driver phone: 9849567123 (use OTP 123456)");

  await mongoose.disconnect();
}

seedDemoData().catch((error) => {
  console.error(error);
  process.exit(1);
});
