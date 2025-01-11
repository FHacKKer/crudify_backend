
import {NextFunction,Request,Response} from "express"
import {IAccessToken} from "../../types";
import mongoose from "mongoose";

const getProfileMiddleware = async (req: Request, res: Response, next:NextFunction) => {

    const user = req.user as IAccessToken;
    const { id } = user;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(403).send({
            success: false,
            message: `Invalid User ID: ${id}`,
            timestamp:res.locals.timestamp
        });
        return
    }

    req.body = {
        userId: id,
    }

    next()

}

export default getProfileMiddleware