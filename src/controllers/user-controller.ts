import {NextFunction, Request, Response} from "express";
import {UserModel} from "../models/User-Model";
import {IAccessToken, IEditableUserFields, IUser, UserRole} from "../types";
import {AppError} from "../util/AppError";
import bcrypt from "bcrypt";

// function to mask users email for normal user
function maskData(users: IUser[], role: UserRole): IUser[] {
  if (role === "user") {
    const processedData = users.map((user) => {
      // implement logic here
      const maskedEmail =
        user.email.substring(0, 3) +
        `*`.repeat(10) +
        user.email.substring(user.email.length - 3);

      const maskedUsername =
        user.username.substring(0, 2) +
        `*`.repeat(5) +
        user.username.substring(user.username.length - 2);

      return {
        name: user.name,
        username: maskedUsername,
        email: maskedEmail,
        isActive: user.isActive,
        _id: user.id,
        role: user.role,
        createdAt: user.createdAt,
      } as IUser;
    });

    return processedData;
  }

  return users;
}

// Controller for get users route
export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role: userRole, id: currentUserId } = req.user as IAccessToken;

    // retrieving users from database
    const rawUsers = await UserModel.find({
      _id: {
        $ne: currentUserId,
      },
    }).select("name username email isActive role createdAt");

    if (rawUsers.length === 0) {
      res.json({
        success: true,
        message: "User Fetched Successfully!",
        users: [],
      });
      return;
    }

    let maskedUsers: IUser[] = [];
    if (userRole === "user") {
      // Masked User email for "user" role client
      maskedUsers = maskData(rawUsers, userRole);
    }

    // returning users
    res.status(200).json({
      timestamp: res.locals.timestamp,
      success: true,
      message: "User Fetched Successfully!",
      users: userRole === "user" ? maskedUsers : rawUsers,
    });
  } catch (error) {
    // getting error message if error is instance of Error class
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    next(new AppError(message, 400));
  }
};


export const updateUserController = async (req:Request, res:Response, next:NextFunction) => {
  try {

    const { userId, data:dataFields } = req.body as {userId: string, data:IEditableUserFields}

    const updatedUser = await UserModel.findByIdAndUpdate(userId,dataFields,{new:true}).exec();

    if(!updatedUser) {
      throw new AppError(`User not found with ID: "${userId}".`, 404);
    }

    res.status(200).json({
      success:true,
      message:`Updated fields for user "${updatedUser?.name || "John Doe"}": ${Object.keys(dataFields).join(", ")}.`,
      timestamp:res.locals.timestamp
    })

  }catch (e) {
    next(e)
  }


}


export const createUserController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const user:IUser = req.body;

    user.password = await bcrypt.hash(user.password, 10);
    
    const newUser = new UserModel(user)
    await newUser.save();

    res.status(201).json({
      success:true,
      message:`New User Created Successfully!`,
      timestamp:res.locals.timestamp,
      user:newUser
    })
  }catch (e) {
    next(e)
  }
}


export const deleteUserController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { userId } = req.body;

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if(!deletedUser) {
      res.status(400).json({
        success: false,
        message: "User not found with ID: "+userId,
        timestamp:res.locals.timestamp
      })
      return
    }

    // Send a success response after the user has been deleted
    res.status(200).json({
      success:true,
      message:`The user has been successfully deleted!`,
      timestamp:res.locals.timestamp
    })
  }catch (e) {
    next(e)
  }
}