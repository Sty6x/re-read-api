import { Schema, SchemaTypes, model } from "mongoose";

const noteSchema = new Schema({
  user: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  book: { type: SchemaTypes.ObjectId, ref: "Book", required: true },
  dateCreated: { type: SchemaTypes.Date, required: true, default: new Date() },
  lastUpdated: { type: SchemaTypes.Date, required: true, default: new Date() },
  page: { type: Number, required: true },
  noteNumber: { type: Number, required: true },
  contents: { type: String },
});

export default model("Note", noteSchema);
