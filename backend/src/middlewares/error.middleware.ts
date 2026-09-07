import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import jwt from "jsonwebtoken";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    // dont send 500 - internal server error on user created errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message || "Something went wrong"
        })
    }

    if (
        err instanceof jwt.TokenExpiredError ||
        err instanceof jwt.JsonWebTokenError
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid of expired  token"
        })
    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};