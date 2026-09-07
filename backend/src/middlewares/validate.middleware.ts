// takes the zod schema and validates the incoming request against it

import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // validate the req.body
        const result = schema.safeParse(req.body);
        
        if(!result.success) {
            return res.status(400).json({
                message: "Validation Error",
                errors: result.error.issues
            })
        }

        req.body = result.data;

        next();
    }
}