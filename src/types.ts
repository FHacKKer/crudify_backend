import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

// Interface for User Model
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;
  role: "admin" | "user" | "moderator";
  createdAt?: Date;
  updateAt?: Date;
}

// Interface for jwt token(Access Token)
export interface IAccessToken extends JwtPayload {
  id: string;
  name: string;
  role: "admin" | "user" | "moderator";
}

// Interface for refresh token(Refresh Token)
export interface IRefreshToken extends JwtPayload {
  id: string;
}
