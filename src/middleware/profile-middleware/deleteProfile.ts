
import {Request,Response,NextFunction} from "express"
import {IAccessToken} from "../../types";
import mongoose from "mongoose";

const deleteProfileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { id:userId } = req.user as IAccessToken;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        res.status(403).send({
            success:false,
            message:`Invalid user with id "${userId}"`,
            timestamp:res.locals.timestamp
        })
        return
    }

    req.body = {
        userId: userId
    }

    next()
}

export default deleteProfileMiddleware