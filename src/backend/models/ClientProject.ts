import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IClientProject extends Document {
  projectName: string;
  clientId: mongoose.Types.ObjectId;
  description: string;
  budget?: number;
  startDate?: Date;
  deadline?: Date;
  status: "Planning" | "In Progress" | "Testing" | "Completed" | "On Hold";
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClientProjectSchema = new Schema<IClientProject>(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [150, "Project name cannot exceed 150 characters"],
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client ID is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    startDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Testing", "Completed", "On Hold"],
      default: "Planning",
    },
    technologies: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient admin queries
ClientProjectSchema.index({ status: 1, deadline: 1 });
ClientProjectSchema.index({ clientId: 1 });

const ClientProject: Model<IClientProject> =
  mongoose.models.ClientProject ??
  mongoose.model<IClientProject>("ClientProject", ClientProjectSchema);

export default ClientProject;
