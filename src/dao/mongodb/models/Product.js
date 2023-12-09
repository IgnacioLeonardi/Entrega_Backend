import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
const productSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    category: { type: String, default: "Otros" },
    thumbnail: { type: [String], default: [] },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

export const manager = model("products", productSchema);
