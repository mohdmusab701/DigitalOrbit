import mongoose, { Schema, type Document, type Model } from "mongoose";

/**
 * Example Mongoose model — replace or delete this once you create your own models.
 * Demonstrates the pattern for defining models safely in Next.js (avoiding
 * re-compilation errors during HMR).
 */

export interface IExample extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema<IExample>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

/**
 * Check if the model already exists (HMR safety) before compiling.
 */
const Example: Model<IExample> =
  mongoose.models.Example ?? mongoose.model<IExample>("Example", ExampleSchema);

export default Example;
