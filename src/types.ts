import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";
import {Key} from "node:readline";

export type UserRole = "admin" | "user" | "moderator";

// Interface for User Model
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  role: UserRole;
  createdAt?: Date;
  updateAt?: Date;
}

// Interface for jwt token(Access Token)
export interface IAccessToken extends JwtPayload {
  id: string;
  name: string;
  role: UserRole;
}

// Interface for refresh token(Refresh Token)
export interface IRefreshToken extends JwtPayload {
  id: string;
}


// Fields that are editable by admin of any user
export interface IEditableUserFields {
  name?:string;
  username?:string;
  role?:UserRole;
  isActive?: boolean;
  isVerified?: boolean;
}

export const EditableUserFieldsArray = ["name", "username", "role", "isActive", "isVerified"]



