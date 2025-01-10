// types/express.d.ts

import {IAccessToken} from "../types"

declare global {
    namespace Express {
        export interface Request {
            user?: IAccessToken
        }
        export interface Response {
            locals : {
                timestamp:string
            }
        }
    }
}

