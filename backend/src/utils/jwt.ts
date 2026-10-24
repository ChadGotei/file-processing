import jwt from "jsonwebtoken";
import { env } from "../config/env";

const secret = env.jwt.secret;
const expiresIn = env.jwt.expires_in;

export const generateToken = (userId: number) => {
    return jwt.sign(
        { userId },
        secret,
        {
            expiresIn: expiresIn,
            // algorithm: "HS256"
        }
    );
};