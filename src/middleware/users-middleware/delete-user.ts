import {Request,Response,NextFunction} from "express"
import mongoose from "mongoose";


function deleteUserMiddleware(req:Request,res:Response,next:NextFunction) {

    const payload = req.body as {userId:string};
    if(!payload || !payload.userId) {
        res.status(400).send({
            success:false,
            message:"User id not found",
            timestamp:res.locals.timestamp,
        });
        return
    }
    const {userId} = payload;
    if(mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).send({
            success:false,
            message:`Invalid User ID : "${userId}"`
        })
        return;
    }

    req.body = {
        userId: userId.toString().trim()
    }
    next()
}

export default deleteUserMiddleware