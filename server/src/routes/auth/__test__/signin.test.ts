import request from "supertest";
import { app } from "../../../app";

it("returns a 200 after a successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(200);
});

it("returns a cookie after a successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 400 with missing email and password", async () => {
  await request(app).post("/api/users/signin").send({}).expect(400);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com" })
    .expect(400);

  await request(app)
    .post("/api/users/signin")
    .send({ password: "test123" })
    .expect(400);
});

it("returns a 400 with an email that does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "test123" })
    .expect(400);
});

it("returns a 400 when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "gfdsgdfgdsg",
    })
    .expect(400);
});
