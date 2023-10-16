import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

interface UserData extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  passwordConfirm?: string; // Add this line
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  changedPasswordAt?: Date;

  createPasswordResetToken: () => string;
}

interface UserModel extends Model<UserData> {
  hashPasswordResetToken: (token: string) => string;
}

const userSchema = new Schema<UserData>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    passwordConfirm: String, // Add this line
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
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetToken = bcrypt.hashSync(resetToken, 12);
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes
  return resetToken;
};

userSchema.statics.hashPasswordResetToken = function (token: string): string {
  return bcrypt.hashSync(token, 12);
};

// Middleware to handle password changes
userSchema.pre<UserData>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.changedPasswordAt = new Date();
  next();
});

const UsersModel = mongoose.model<UserData, UserModel>("User", userSchema);

export default UsersModel;
