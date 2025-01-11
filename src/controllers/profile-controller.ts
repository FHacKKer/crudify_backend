import {Request, Response, NextFunction} from "express"
import {UserModel} from "../models/User-Model";
import {IEditableUserFields} from "../types";



export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.body

        const userProfile = await UserModel.findById(userId).select("-password");

        if(!userProfile) {
            res.status(401).send({
                success:false,
                message: `Failed To Fetch Profile: ${userId}`,
                timestamp:res.locals.timestamp
            })
            return
        }

        res.status(200).send({
            success: true,
            profile: userProfile,
            message: "Profile found",
        })

    }catch (error) {
        next(error);
    }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body as {
            userId:string,
            data:IEditableUserFields
        };

        const users = await UserModel.findByIdAndUpdate(payload.userId, payload.data);
        if (!users) {
            res.status(401).json({
                success:false,
                message:`No User Found with ID : ${payload.userId}`,
            })
            return
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            timestamp:res.locals.timestamp
        })
    }catch (error) {
        next(error);
    }
}