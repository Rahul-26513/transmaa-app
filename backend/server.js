require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({ message: "Transmaa Backend is running" });
});

app.use("/api/staff/auth", require("./routes/staffAuthRoutes"));
app.use("/api/staff/bookings", require("./routes/staffBookingRoutes"));
app.use("/api/staff/drivers", require("./routes/staffDriverRoutes"));
app.use("/api/staff/vehicles", require("./routes/staffVehicleRoutes"));
app.use("/api/staff/enquiries", require("./routes/staffEnquiryRoutes"));

app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/driver", require("./routes/driverRoutes"));

app.use(notFound);
app.use(errorHandler);

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment");
  }

  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Transmaa Backend running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}

module.exports = app;
