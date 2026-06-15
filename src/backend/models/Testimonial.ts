import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Client role is required"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    content: {
      type: String,
      required: [true, "Testimonial content is required"],
    },
    avatar: {
      type: String,
      required: [true, "Avatar image path is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
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

const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial ?? mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
export default Testimonial;
