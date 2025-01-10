import {Request,Response,NextFunction} from "express"
import {IUser} from "../../types";
import {validateUser} from "../../util/validate-user";
import {isUserExist} from "../../util/isUserExist";

async function createUserMiddleware(req:Request,res:Response, next:NextFunction) {
    try {

    const payload = req.body as IUser;

    if(!payload || !payload.name || !payload.username || !payload.email || !payload.password) {
        const requiredFields = ["name","username","email","password"]
        res.status(400).json({
            success:false,
            message:`Bad Request: Following fields are required. ${requiredFields.join(", ")}.`,
            timestamp:res.locals.timestamp
        })
        return
    }

    const normalizedUserResult = validateUser(payload);
    if(!normalizedUserResult.success) {
        res.status(400).json({
            success:false,
            message:normalizedUserResult.message,
            timestamp:res.locals.timestamp
        })
        return;
    }

    const {user:validatedUser} = normalizedUserResult;

    const userExistenceResult = await isUserExist(validatedUser.email, validatedUser.username);

    if(userExistenceResult.exists) {
        res.status(400).json({
            success:false,
            message:userExistenceResult.message,
            timestamp:res.locals.timestamp
        })
        return;
    }

    req.body = validatedUser;
    next()

    }catch (e) {
        next(e)
    }

}

export default createUserMiddleware;