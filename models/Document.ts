import mongoose, { Schema, Document as MongoDocument, Model } from "mongoose";

export interface IDocument extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  name: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: "processing" | "ready" | "error";
  extractedText?: string;
  pageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Document name is required"],
      trim: true,
      maxlength: [255, "Name cannot be more than 255 characters"],
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, "File path is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
      enum: ["application/pdf"],
    },
    status: {
      type: String,
      enum: ["processing", "ready", "error"],
      default: "processing",
    },
    extractedText: {
      type: String,
      default: "",
    },
    pageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for user's documents sorted by date
DocumentSchema.index({ userId: 1, createdAt: -1 });

const DocumentModel: Model<IDocument> =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
