/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { signup } from "../../controllers/authController";
import { catchAsync } from "../../utils/catchAsync";

describe("Auth Controller", () => {
  // Mock Express Request and Response objects
  const req = {} as Request;
  const res = {} as Response;

  // Mock Express response methods
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  // Reset the mock status and json methods before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should return a 201 status code and a JSON response", async () => {
      // Mock the necessary request body
      req.body = {
        username: "testuser08",
        email: "test08@example.com",
        password: "testpassword",
        passwordConfirm: "testpassword",
        role: "user",
      };

      // Use catchAsync to handle asynchronous errors in the signup function
      await catchAsync(signup as any)(req, res, jest.fn() as any);
      // Assert that the status function was called with the expected argument
      expect(res.status).toHaveBeenCalledWith(201);

      // Assert that the json function was called
      expect(res.json).toHaveBeenCalled();
    });
  });
});
