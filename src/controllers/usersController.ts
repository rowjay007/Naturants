import express from "express";
import { readFile, writeFile } from "fs/promises";

// Define User interface here
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

// Create a custom interface that extends express.Request
interface CustomRequest extends express.Request {
  userId?: number;
}

// Param middleware to parse the 'id' parameter
export async function parseUserId(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const id = req.params.id;
  req.userId = parseInt(id, 10); // Store the parsed ID in the request object
  next();
}

// Controller function to get all users
export async function getAllUsers(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // Implement code for getting all users
    const userData = await readFile("src/data/users.json", "utf-8");
    const users: User[] = JSON.parse(userData);

    res.json({
      status: "success",
      data: users,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to create a new user
export async function createUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const newUser: User = req.body as User; // Type assertion
    const users = await readUserData();

    // Generate a unique ID for the new user
    const maxId = Math.max(...users.map((user) => user.id));
    newUser.id = maxId + 1;

    users.push(newUser);

    // Write the updated user data back to users.json
    await writeFile(
      "src/data/users.json",
      JSON.stringify(users, null, 2),
      "utf-8"
    );

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to get a user by ID
export async function getUserById(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (req.userId === undefined) {
      res.status(400).json({ error: "Invalid or missing user ID" });
      return;
    }

    const userId = req.userId;
    const users = await readUserData();

    const selectedUser = users.find((user) => user.id === userId);

    if (!selectedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      status: "success",
      data: selectedUser,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to update a user by ID
export async function updateUserById(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (req.userId === undefined) {
      res.status(400).json({ error: "Invalid or missing user ID" });
      return;
    }

    const userId = req.userId;
    const updatedUser: User = req.body as User; // Type assertion
    const users = await readUserData();

    const existingUserIndex = users.findIndex((user) => user.id === userId);

    if (existingUserIndex === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    updatedUser.id = userId;
    users[existingUserIndex] = updatedUser;

    // Write the updated user data back to users.json
    await writeFile(
      "src/data/users.json",
      JSON.stringify(users, null, 2),
      "utf-8"
    );

    res.json({
      status: "success",
      data: updatedUser,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}


// Controller function to delete a user by ID
export async function deleteUserById(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const userId = req.userId as number; // Type assertion
    const users = await readUserData();

    const existingUserIndex = users.findIndex((user) => user.id === userId);

    if (existingUserIndex === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const deletedUser = users.splice(existingUserIndex, 1)[0];

    // Write the updated user data back to users.json
    await writeFile(
      "src/data/users.json",
      JSON.stringify(users, null, 2),
      "utf-8"
    );

    res.json({
      status: "success",
      data: deletedUser,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to partially update a user by ID
export async function updateUserByIdPatch(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const userId = req.userId as number; // Type assertion
    const updatedFields: Partial<User> = req.body as Partial<User>; // Type assertion
    const users = await readUserData();

    const existingUserIndex = users.findIndex((user) => user.id === userId);

    if (existingUserIndex === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = { ...users[existingUserIndex], ...updatedFields };
    users[existingUserIndex] = updatedUser;

    // Write the updated user data back to users.json
    await writeFile(
      "src/data/users.json",
      JSON.stringify(users, null, 2),
      "utf-8"
    );

    res.json({
      status: "success",
      data: updatedUser,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

async function readUserData() {
  const userData = await readFile("src/data/users.json", "utf-8");
  return JSON.parse(userData) as User[];
}
