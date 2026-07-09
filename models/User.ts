import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  role: "admin" | "member" | "viewer";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "שם הוא שדה חובה"],
      trim: true,
      maxlength: [100, "שם לא יכול לעלות על 100 תווים"],
    },
    email: {
      type: String,
      required: [true, "כתובת אימייל היא שדה חובה"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "סיסמה היא שדה חובה"],
      minlength: [8, "סיסמה חייבת להכיל לפחות 8 תווים"],
      select: false,
    },
    avatarUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
