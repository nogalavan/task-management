import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  project: Types.ObjectId;
  assignee?: Types.ObjectId;
  dueDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "כותרת המשימה היא שדה חובה"],
      trim: true,
      maxlength: [500, "כותרת לא יכולה לעלות על 500 תווים"],
    },
    description: {
      type: String,
      maxlength: [5000, "תיאור לא יכול לעלות על 5000 תווים"],
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignee: 1 });

const Task: Model<ITask> =
  mongoose.models.Task ?? mongoose.model<ITask>("Task", TaskSchema);

export default Task;
