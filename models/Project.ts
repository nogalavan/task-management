import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  status: "active" | "archived" | "completed";
  color?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "שם הפרויקט הוא שדה חובה"],
      trim: true,
      maxlength: [200, "שם הפרויקט לא יכול לעלות על 200 תווים"],
    },
    description: {
      type: String,
      maxlength: [1000, "תיאור לא יכול לעלות על 1000 תווים"],
    },
    status: {
      type: String,
      enum: ["active", "archived", "completed"],
      default: "active",
    },
    color: {
      type: String,
      default: "#d4a373",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
