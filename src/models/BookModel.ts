import { Schema, SchemaTypes, model } from "mongoose";

const bookSchema = new Schema({
  title: { type: String, require: true },
  notes: [{ type: SchemaTypes.ObjectId, ref: "Note" }], // array of not id's
  user: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  author: { type: String, require: true },
  dateCreated: { type: SchemaTypes.Date, required: true, default: new Date() },
  lastUpdated: { type: SchemaTypes.Date, required: true, default: new Date() },
  pages: { type: Number, required: true, default: 0 },
  // create an image link to a cdn
});

export default model("Book", bookSchema);
