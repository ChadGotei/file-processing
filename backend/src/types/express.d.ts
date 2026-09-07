import { User } from "../db/schema";

// to add the user type in the global Request type
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export {};