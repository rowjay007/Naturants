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

// Create a User
router.post("/", async (req, res) => {
  try {
    const newUser: User = req.body;

    // Read the user data from users.json
    const userData = await readFile("src/data/users.json", "utf-8");
    const users: User[] = JSON.parse(userData);

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
});

// Get All Users
router.get("/", async (req, res) => {
  try {
    // Read the user data from users.json
    const userData = await readFile("src/data/users.json", "utf-8");
    const users: User[] = JSON.parse(userData);

    res.json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a User by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser: User = req.body;
    const userData = await readFile("src/data/users.json", "utf-8");
    const users: User[] = JSON.parse(userData);

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
});

// Delete a User by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await readFile("src/data/users.json", "utf-8");
    const users: User[] = JSON.parse(userData);

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
});

export default router;
