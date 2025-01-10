import mongoose, { Model } from "mongoose";
import { IUser } from "../types";

// Define the schema for the User model
const UserModelSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String, // User's full name
      required: true, // Name is mandatory
    },
    username: {
      type: String, // Unique username for the user
      required: true, // Username is mandatory
      unique: true, // Ensures no two users have the same username
    },
    email: {
      type: String, // User's email address
      required: true, // Email is mandatory
      unique: true, // Ensures no duplicate email addresses
    },
    password: {
      type: String, // Hashed password for the user
      required: true, // Password is mandatory
    },
    role: {
      type: String, // Role assigned to the user
      enum: ["admin", "user", "moderator"], // Allowed roles
      default: "user", // Default role is "user"
    },
    isActive: {
      type: Boolean, // Indicates if the user account is active
      default: true, // Default is active
      required: false, // Optional field
    },
    isVerified: {
      type: Boolean, // Indicates if the user has verified their account
      default: true, // Default is verified
      required: false, // Optional field
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    versionKey: false, // Disable the `__v` version key in documents
  }
);

// Create the User model if it doesn't already exist in the database
const UserModel: Model<IUser> =
  mongoose.models.user || mongoose.model<IUser>("user", UserModelSchema);

export { UserModel };
