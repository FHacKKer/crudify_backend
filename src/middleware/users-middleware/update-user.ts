import {Request,Response,NextFunction} from "express"
import {EditableUserFieldsArray, IAccessToken, IEditableUserFields, IUser} from "../../types";
import mongoose from "mongoose";
import {AppError} from "../../util/AppError";


export const updateUserMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const payload = req.body as { userId:string, data: IEditableUserFields};
    const currentUser = req.user as IAccessToken;



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

    if(currentUser.id === payload.userId){
        res.status(400).json({
            success: false,
            message: "Oops! You can't update your own information here. Please visit your profile page to make changes.",
            timestamp:res.locals.timestamp
        });
        return;
    }

    if(!payload.data) {
        res.status(403).json({
            success:false,
            message:`Access denied: Please provide the fields you want to update.`,
            timestamp:res.locals.timestamp
        })
        return
    }

    /*
    * Checking the length of data fields that admin want to change
    * */
    const dataFieldsLength = Object.keys(payload.data).length;
    if(dataFieldsLength === 0) {
        /*
        * if there are no fields to update , return error!
        * */
        res.status(403).json({
            success:false,
            message: `Access Denied: No fields to update were provided. Please include at least one valid field to modify.`,
            timestamp:res.locals.timestamp
        })
        return;
    }

    // deleting extra key value pairs that are extra added by any tester
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

