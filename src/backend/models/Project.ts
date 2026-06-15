import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  client: string;
  category: string;
  image: string;
  gallery: string[];
  tags: string[];
  projectUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    client: {
      type: String,
      required: [true, "Client name is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Main image is required"],
    },
    gallery: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    projectUrl: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> = mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
