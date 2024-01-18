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

describe("userRoutes", () => {
  it("should sign up a new user", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      username: "testuser13",
      email: "test45@example.com",
      password: "test45@example.com",
      passwordConfirm: "test45@example.com",
      role: "user",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
  });

  it("should log in an existing user", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      username: "testuser13",
      password: "test45@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });

  it("should log out an existing user", async () => {
    const response = await request(app).post("/api/v1/users/logout").send({
      username: "testuser13",
      password: "test45@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });

  it("should not log in an existing user with wrong password", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      username: "testuser13",
      password: "test@example.com1",
    });

    expect(response.status).toBe(401);
  });

  it("should not log in an existing user with wrong username", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      username: "testuser131",
      password: "<PASSWORD>",
    });

    expect(response.status).toBe(401);
  });

  afterAll(() => {});
});
