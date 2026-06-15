import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IChatMessage {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  sessionId: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  messages: IChatMessage[];
  status: "active" | "closed" | "converted";
  leadCaptured: boolean;
  pageUrl?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
  {
    sessionId: {
      type: String,
      required: [true, "Session ID is required"],
      index: true,
    },
    visitorName: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    visitorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, "Email cannot exceed 255 characters"],
    },
    visitorPhone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone cannot exceed 20 characters"],
    },
    messages: {
      type: [ChatMessageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "closed", "converted"],
      default: "active",
    },
    leadCaptured: {
      type: Boolean,
      default: false,
    },
    pageUrl: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient admin queries
ConversationSchema.index({ status: 1, createdAt: -1 });
ConversationSchema.index({ leadCaptured: 1 });
ConversationSchema.index({ visitorEmail: 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ??
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
