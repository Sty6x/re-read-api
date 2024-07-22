import { Schema, SchemaTypes, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  role: { type: String, enum: ["admin", "user"], required: true },
  dateCreated: { type: SchemaTypes.Date, required: true },
});

export default model("User", userSchema);
