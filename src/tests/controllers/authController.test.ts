// authController.test.ts

import request from "supertest";
import { app } from "../../app";
import RedisService from "../../utils/redisService";
import { closeDatabase, setupDatabase } from "../setup";

jest.mock("../../utils/redisService");

beforeAll(async () => {
  await setupDatabase();

  (RedisService.getInstance as jest.Mock).mockReturnValue({
    getClient: jest.fn(),
  });
});

afterAll(async () => {
  await closeDatabase();
});

describe("AuthController", () => {
  it("should sign up a new user", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "user",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data.user).toHaveProperty("id");
    expect(response.body.data.user).toHaveProperty("username");
    expect(response.body.data.user).toHaveProperty("email");
    expect(response.body.data.user).toHaveProperty("role");
  });

  it("should log in an existing user", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      username: "testuser",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data).toHaveProperty("token");
  });

  it("should logout out existing user", async () => {
    const response = await request(app).post("/api/v1/users/logout");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
  });

  afterAll(() => {});
});
