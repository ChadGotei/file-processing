import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../errors/AppError.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { loginUser, registerUser } from "../services/auth.services.js";
import { env } from "../config/env.js";

export const saveAccessTokenToCookie = (token: string, res: Response) => {
    return res.cookie("accessToken", token, {
        httpOnly: true,     // javascript cannot access - only http
        secure: env.node_env === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,    // 1 day
    });
}

//? validated data is already in the req.body now thanks to validate middleware
export const register = asyncHandler(async (req, res) => {
    const { user, token } = await registerUser(req.body);

    if (!user) throw new AppError("Error while creating user.", 400);

    saveAccessTokenToCookie(token, res);

    res.status(201).json({
        message: "User registered successfully",
        data: user,
        // accessToken: token   //? development only
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await loginUser(req.body);

    saveAccessTokenToCookie(token, res);
    
    res.status(200).json({
        message: "User logged in successfully",
        data: user,
        // accessToken: token
    });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");

    res.status(204).json({
        message: "User logged out successfully",
    });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    
    res.status(200).json({
        message: "Current user",
        user
    });
});

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const data = await db.select({
        id: users.id,
        name: users.name,
        hashedPassword: users.password,
        email: users.email,
        createdAt: users.createdAt
        // users
    }).from(users)

    res.status(200).json({
        message: "All users darling - dev only",
        total: data.length,
        data
    })
})