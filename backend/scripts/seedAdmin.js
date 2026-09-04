require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

async function seedAdmin() {
  const name = process.env.SEED_ADMIN_NAME || "Admin";
  const phone = process.env.SEED_ADMIN_PHONE || "9999999999";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

  await connectDB();

  const existing = await User.findOne({ phone });

  if (existing) {
    console.log(`A user with phone ${phone} already exists (role: ${existing.role}). Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    phone,
    password: hashedPassword,
    role: "admin",
    status: "active"
  });

  console.log("Admin account created:");
  console.log(`  phone:    ${phone}`);
  console.log(`  password: ${password}`);

  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
