// routes/usersRoutes.ts

import express from "express";
import { readFile, writeFile } from "fs/promises";

const router = express.Router();

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

// Middleware to read user data
async function readUserData() {
  const userData = await readFile("src/data/users.json", "utf-8");
  return JSON.parse(userData) as User[];
}

// Controller to get all users
async function getAllUsers(req: express.Request, res: express.Response) {
  try {
    const users = await readUserData();
    res.json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to create a new user
async function createUser(req: express.Request, res: express.Response) {
  try {
    const newUser: User = req.body;
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to get a user by ID
async function getUserById(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const users = await readUserData();
    const selectedUser = users.find((user) => user.id === parseInt(id));

    if (!selectedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      status: "success",
      data: selectedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to update a user by ID (PUT)
async function updateUserById(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const updatedUser: User = req.body;
    const users = await readUserData();

    const existingUserIndex = users.findIndex(
      (user) => user.id === parseInt(id)
    );

    if (existingUserIndex === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    updatedUser.id = parseInt(id);
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to update a user by ID (PATCH)
async function updateUserByIdPatch(
  req: express.Request,
  res: express.Response
) {
  try {
    const { id } = req.params;
    const updatedFields: Partial<User> = req.body;
    const users = await readUserData();

    const existingUserIndex = users.findIndex(
      (user) => user.id === parseInt(id)
    );

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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to delete a user by ID
async function deleteUserById(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const users = await readUserData();

    const existingUserIndex = users.findIndex(
      (user) => user.id === parseInt(id)
    );

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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Define routes using the controller functions
router.route("/").get(getAllUsers).post(createUser);

router
  .route("/:id")
  .get(getUserById)
  .put(updateUserById)
  .patch(updateUserByIdPatch)
  .delete(deleteUserById);

export default router;
