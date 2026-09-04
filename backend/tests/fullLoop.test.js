process.env.NODE_ENV = "test";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = "test_secret";
  process.env.STAFF_BOOTSTRAP_KEY = "test_bootstrap_key";
  delete process.env.RESEND_API_KEY;

  await mongoose.connect(process.env.MONGODB_URI);

  app = require("../server");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Full customer -> staff -> driver loop", () => {
  const customerPhone = "9000000010";
  const driverPhone = "9000000011";
  const staffPhone = "9000000012";

  let customerToken;
  let staffToken;
  let driverToken;
  let bookingId;
  let driverId;

  test("customer can register without a password", async () => {
    const res = await request(app).post("/api/customer/auth/register").send({
      name: "Test Customer",
      phone: customerPhone,
      email: "customer@example.com"
    });

    expect(res.status).toBe(201);
  });

  test("customer logs in with the static prototype OTP", async () => {
    const res = await request(app)
      .post("/api/customer/auth/verify-otp")
      .send({ phone: customerPhone, otp: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    customerToken = res.body.token;
  });

  test("customer creates a booking", async () => {
    const res = await request(app)
      .post("/api/customer/bookings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        fromLocation: "Sircilla",
        toLocation: "Hitech City, Hyderabad",
        shiftingDate: "2026-10-01",
        shiftingTime: "10:00 AM",
        goodsType: "House Shifting",
        truckType: "Open",
        truckCapacity: "7-11 Tons"
      });

    expect(res.status).toBe(201);
    expect(res.body.booking.status).toBe("waiting");
    bookingId = res.body.booking._id;
  });

  test("customer can see their own booking in history", async () => {
    const res = await request(app)
      .get("/api/customer/bookings")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  test("bootstraps a staff admin and logs in", async () => {
    await request(app)
      .post("/api/staff/auth/bootstrap-admin")
      .set("x-setup-key", "test_bootstrap_key")
      .send({ name: "Admin", phone: staffPhone, password: "Admin@12345" });

    const res = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: staffPhone, password: "Admin@12345" });

    expect(res.status).toBe(200);
    staffToken = res.body.token;
  });

  test("staff accepts the booking", async () => {
    const res = await request(app)
      .put(`/api/staff/bookings/${bookingId}/accept`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ price: 6500 });

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe("accepted");
  });

  test("driver registration is rejected without prior account when logging in", async () => {
    const res = await request(app)
      .post("/api/driver/auth/verify-otp")
      .send({ phone: driverPhone, otp: "123456" });

    expect(res.status).toBe(404);
  });

  test("driver registers and gets a pending-verification response on login", async () => {
    const registerRes = await request(app).post("/api/driver/auth/register").send({
      name: "Test Driver",
      phone: driverPhone,
      email: "driver@example.com",
      experienceYears: 5,
      vehicleType: "Open",
      vehicleModel: "Tata 1109",
      vehicleNumber: "TS 09 AB 1234",
      dlNumber: "DL123",
      panNumber: "PAN123"
    });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post("/api/driver/auth/verify-otp")
      .send({ phone: driverPhone, otp: "123456" });

    expect(loginRes.status).toBe(202);
  });

  test("staff approves the driver", async () => {
    const listRes = await request(app)
      .get("/api/staff/drivers?verificationStatus=pending")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(listRes.body.count).toBe(1);
    driverId = listRes.body.drivers[0]._id;

    const approveRes = await request(app)
      .put(`/api/staff/drivers/${driverId}/approve`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(approveRes.status).toBe(200);
  });

  test("driver can now log in successfully", async () => {
    const res = await request(app)
      .post("/api/driver/auth/verify-otp")
      .send({ phone: driverPhone, otp: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    driverToken = res.body.token;
  });

  test("driver sees the accepted booking as an available load", async () => {
    const res = await request(app)
      .get("/api/driver/loads/available")
      .set("Authorization", `Bearer ${driverToken}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.loads[0]._id).toBe(bookingId);
  });

  test("driver accepts the load", async () => {
    const res = await request(app)
      .put(`/api/driver/loads/${bookingId}/accept`)
      .set("Authorization", `Bearer ${driverToken}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe("driver_accepted");
  });

  test("staff sends confirmation, moving the booking on the way", async () => {
    const res = await request(app)
      .put(`/api/staff/bookings/${bookingId}/send-confirmation`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe("on_the_way");
  });

  test("driver marks the load delivered", async () => {
    const res = await request(app)
      .put(`/api/driver/loads/${bookingId}/deliver`)
      .set("Authorization", `Bearer ${driverToken}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe("delivered");
  });

  test("customer sees the booking as delivered", async () => {
    const res = await request(app)
      .get(`/api/customer/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe("delivered");
  });

  test("customer submits a vehicle for sale, staff approves, marketplace shows it live", async () => {
    const submitRes = await request(app)
      .post("/api/customer/vehicles")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        makeModel: "Tata Ace Gold",
        year: 2022,
        rcNumber: "TS 08 EX 1111",
        price: "3,50,000",
        kmDriven: "20,000 km",
        fuelType: "Diesel",
        location: "Hyderabad"
      });

    expect(submitRes.status).toBe(201);
    const vehicleId = submitRes.body.vehicle._id;

    const approveRes = await request(app)
      .put(`/api/staff/vehicles/${vehicleId}/approve`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(approveRes.status).toBe(200);

    const liveRes = await request(app).get("/api/customer/vehicles/live");
    expect(liveRes.status).toBe(200);
    expect(liveRes.body.count).toBe(1);

    const interestRes = await request(app)
      .post(`/api/customer/vehicles/${vehicleId}/interest`)
      .send({ name: "Interested Buyer", phone: "9999900000" });

    expect(interestRes.status).toBe(200);
    expect(interestRes.body.vehicle.interestedBuyers.length).toBe(1);
  });

  test("customer submits a finance enquiry and staff sees it", async () => {
    const res = await request(app)
      .post("/api/customer/enquiries")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        name: "Test Customer",
        phone: customerPhone,
        type: "finance",
        vehicleType: "Pickup Truck",
        rcNumber: ""
      });

    expect(res.status).toBe(201);
    expect(res.body.enquiry.enquiryType).toBe("Finance");

    const staffList = await request(app)
      .get("/api/staff/enquiries")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(staffList.body.count).toBe(1);
  });
});
