/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";

interface UserData extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  photo?: string;
  passwordConfirm?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  changedPasswordAt?: Date;

  createPasswordResetToken: () => string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

interface UserModel extends Model<UserData> {
  hashPasswordResetToken: (token: string) => string;
  comparePasswordResetToken: (
    inputToken: string,
    hashedToken: string
  ) => boolean;
}

const validRoles = ["user", "waiter", "customer", "chef", "manager", "admin"];

const userSchema = new Schema<UserData>(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: validRoles, default: "user" },
    photo: String,
    passwordConfirm: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    changedPasswordAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

userSchema.statics.hashPasswordResetToken = function (token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
};

userSchema.statics.comparePasswordResetToken = function (
  inputToken: string,
  hashedToken: string
): boolean {
  return bcrypt.compareSync(inputToken, hashedToken);
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre<UserData>("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.changedPasswordAt = new Date();
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update: any = this.getUpdate();
  if (update?.$set?.password) {
    update.$set.changedPasswordAt = new Date();
  }

  next();
});

const UsersModel = mongoose.model<UserData, UserModel>("User", userSchema);

export default UsersModel;
