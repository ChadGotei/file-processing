import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const protectedRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.accessToken;

    if (!token) {
        console.error("Token not found");
        throw new AppError("Unauthorized", 401);
    }

    const payload = jwt.verify(
        token,
        env.jwt.secret
    ) as { userId: number };

    const userArr = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

    if (!userArr.length) {
        throw new AppError("Unauthorized", 401);
    }

    req.user = userArr[0];

    next();
};