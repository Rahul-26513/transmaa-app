const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in the environment");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected:", mongoose.connection.host);
}

module.exports = connectDB;
