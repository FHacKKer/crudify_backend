// types/express.d.ts

import { IAccessToken } from "../types";

// Declaring global extensions to the Express framework
declare global {
    // Extending the Express.Request interface
    namespace Express {
        export interface Request {
            // Adding user property to the Request interface to hold the user data (IAccessToken) injected by authentication middleware
            user?: IAccessToken;
        }

        export interface Response {
            // Adding locals property to the Response interface to hold response-specific data like timestamps
            locals: {
                timestamp: string; // Timestamp to be used for tracking response time
            };
        }
    }
}
