import {NextFunction,Request,Response} from "express";
import {EditableUserFieldsArray, IAccessToken, IEditableUserFields} from "../../types";

const updateProfileMiddleware = async (req:Request, res:Response, next:NextFunction) => {

    const payload = req.body as {
        data:IEditableUserFields
    };

    if(!payload || !payload.data) {
        res.status(400).json({
            success: false,
            message: "No data provided",
            timestamp:res.locals.timestamp
        });
        return
    }

    const user = req.user as IAccessToken;

    const { id } = user;

    const {data} = payload;

    for (const key of Object.keys(data)) {
        if(!EditableUserFieldsArray.includes(key)) {
            delete data[key as keyof IEditableUserFields];
        }
    }


    req.body = {
        userId:id,
        data:data
    }
    next()
}

export default updateProfileMiddleware;