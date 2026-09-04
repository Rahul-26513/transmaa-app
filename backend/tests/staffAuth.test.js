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

  await mongoose.connect(process.env.MONGODB_URI);

  app = require("../server");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Staff authentication", () => {
  const adminPhone = "9999999999";
  const adminPassword = "Admin@12345";

  test("rejects bootstrap with a wrong setup key", async () => {
    const res = await request(app)
      .post("/api/staff/auth/bootstrap-admin")
      .set("x-setup-key", "wrong-key")
      .send({ name: "Admin", phone: adminPhone, password: adminPassword });

    expect(res.status).toBe(403);
  });

  test("bootstraps the first admin with the correct setup key", async () => {
    const res = await request(app)
      .post("/api/staff/auth/bootstrap-admin")
      .set("x-setup-key", process.env.STAFF_BOOTSTRAP_KEY)
      .send({ name: "Admin", phone: adminPhone, password: adminPassword });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.staff.role).toBe("admin");
    expect(res.body.staff.password).toBeUndefined();
  });

  test("refuses to bootstrap a second time even with the right key", async () => {
    const res = await request(app)
      .post("/api/staff/auth/bootstrap-admin")
      .set("x-setup-key", process.env.STAFF_BOOTSTRAP_KEY)
      .send({ name: "Someone Else", phone: "8888888888", password: "Password@123" });

    expect(res.status).toBe(409);
  });

  test("rejects login with wrong password", async () => {
    const res = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: adminPhone, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  test("rejects login for an unknown phone number", async () => {
    const res = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: "7000000000", password: adminPassword });

    expect(res.status).toBe(404);
  });

  test("logs in with correct credentials and returns a JWT", async () => {
    const res = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: adminPhone, password: adminPassword });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.staff.phone).toBe(adminPhone);
  });

  test("blocks protected routes without a token", async () => {
    const res = await request(app).get("/api/staff/auth/me");
    expect(res.status).toBe(401);
  });

  test("returns the current profile with a valid token", async () => {
    const loginRes = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: adminPhone, password: adminPassword });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/staff/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.staff.phone).toBe(adminPhone);
  });

  test("an admin can onboard a new staff member", async () => {
    const loginRes = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: adminPhone, password: adminPassword });

    const token = loginRes.body.token;

    const res = await request(app)
      .post("/api/staff/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Staff", phone: "7000000001", password: "Password@123" });

    expect(res.status).toBe(201);
    expect(res.body.staff.role).toBe("staff");
  });

  test("the new staff member can log in", async () => {
    const res = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: "7000000001", password: "Password@123" });

    expect(res.status).toBe(200);
    expect(res.body.staff.role).toBe("staff");
  });

  test("a plain staff account cannot list staff accounts (admin only)", async () => {
    const loginRes = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: "7000000001", password: "Password@123" });

    const res = await request(app)
      .get("/api/staff/auth/staff")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(403);
  });

  test("a deactivated staff account is locked out immediately", async () => {
    const adminLogin = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: adminPhone, password: adminPassword });

    const staffLogin = await request(app)
      .post("/api/staff/auth/login")
      .send({ phone: "7000000001", password: "Password@123" });

    const listRes = await request(app)
      .get("/api/staff/auth/staff")
      .set("Authorization", `Bearer ${adminLogin.body.token}`);

    const targetStaff = listRes.body.staff.find((s) => s.phone === "7000000001");

    await request(app)
      .put(`/api/staff/auth/staff/${targetStaff.id}/status`)
      .set("Authorization", `Bearer ${adminLogin.body.token}`)
      .send({ status: "inactive" });

    const res = await request(app)
      .get("/api/staff/auth/me")
      .set("Authorization", `Bearer ${staffLogin.body.token}`);

    expect(res.status).toBe(403);
  });
});
