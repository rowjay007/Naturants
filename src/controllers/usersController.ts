import express from "express";
import UsersModel from "../models/usersModel";

export async function parseUserId(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const id = req.params.id;
  req.userId = id,
  next();
}

export async function getAllUsers(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const usersData = await UsersModel.find();
    res.json({
      status: "success",
      results: usersData.length,
      data: { usersData },
    });
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    next(err);
  }
}

export async function createUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const newUser = new UsersModel(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({
      status: "success",
      data: savedUser,
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    next(err);
  }
}

export async function getUserById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { userId } = req;
    const selectedUser = await UsersModel.findById(userId);

    if (!selectedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      status: "success",
      data: selectedUser,
    });
  } catch (err) {
    console.error("Error in getUserById:", err);
    next(err);
  }
}

export async function updateUserById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { userId } = req;
    const updatedUser = req.body;
    const updatedDoc = await UsersModel.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    if (!updatedDoc) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      status: "success",
      data: updatedDoc,
    });
  } catch (err) {
    console.error("Error in updateUserById:", err);
    next(err);
  }
}

export async function updateUserPartially(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { userId } = req;
    const updatedFields = req.body;
    const updatedDoc = await UsersModel.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedDoc) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      status: "success",
      data: updatedDoc,
    });
  } catch (err) {
    console.error("Error in updateUserPartially:", err);
    next(err);
  }
}


export async function deleteUserById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { userId } = req;
    const deletedUser = await UsersModel.findByIdAndRemove(userId);

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      status: "success",
      data: deletedUser,
    });
  } catch (err) {
    console.error("Error in deleteUserById:", err);
    next(err);
  }
}
