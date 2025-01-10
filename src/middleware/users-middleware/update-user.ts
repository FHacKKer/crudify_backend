import {Request,Response,NextFunction} from "express"
import {EditableUserFieldsArray, IEditableUserFields, IUser} from "../../types";
import mongoose from "mongoose";
import {AppError} from "../../util/AppError";


export const updateUserMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const payload = req.body as { userId:string, data: IEditableUserFields};

    if(!payload || !payload.userId) {
        res.status(403).json({
            success:false,
            message:`Access denied: User ID is required to proceed. Please provide a valid User ID.`,
            timestamp:res.locals.timestamp
        })
        return
    }

    if(!mongoose.Types.ObjectId.isValid(payload.userId.toString().trim())) {
        throw new AppError(`Invalid user ID: "${payload.userId.toString().trim()}".`, 400);
    }

    if(!payload.data) {
        res.status(403).json({
            success:false,
            message:`Access denied: Please provide the fields you want to update.`,
            timestamp:res.locals.timestamp
        })
        return
    }

    const dataFieldsLength = Object.keys(payload.data).length;
    if(dataFieldsLength === 0) {
        res.status(403).json({
            success:false,
            message: `Access Denied: No fields to update were provided. Please include at least one valid field to modify.`,
            timestamp:res.locals.timestamp
        })
        return;
    }

    for (const field of Object.keys(payload.data)) {
        if(!EditableUserFieldsArray.includes(field as keyof IEditableUserFields)){
            delete payload.data[field as keyof IEditableUserFields]
        }
    }


    req.body = {
        userId:payload.userId.toString().trim(),
        data:payload.data
    }

    next()
}

