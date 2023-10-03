import mongoose, { Document, Schema } from "mongoose";

interface UserData extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema({
  _id: { type: Schema.Types.Mixed, required: true }, // ID can be either number or string
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const UsersModel = mongoose.model<UserData>("User", userSchema);

export default UsersModel;
