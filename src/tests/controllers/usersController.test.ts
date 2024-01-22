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

beforeEach(() => {
  (RedisService.getInstance as jest.Mock).mockReturnValue({
    getClient: jest.fn(),
  });
});

describe("Users Controller", () => {
  it("should create a new user", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "user",
    };

    const response = await request(app).post("/api/v1/users").send(newUser);

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("username", newUser.username);
  });

  afterAll(() => {});
});
