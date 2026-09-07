import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { AppError } from "../errors/AppError";
import { saltRounds } from "../constants";
import { eq, sql } from "drizzle-orm";
import { LoginDto, RegisterDto } from "../schemas/auth.schema";
import { generateToken } from "../utils/jwt";

export const registerUser = async (body: RegisterDto) => {
    if(body.password !== body.confirmPassword) throw new AppError("Passwords do not match", 400);

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, body.email))
        .limit(1);

    if (existingUser.length) {
        throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const [insertedUser] = await db
        .insert(users)
        .values({
            name: body.name,
            email: body.email,
            password: hashedPassword,
        })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt
        });

    const token = generateToken(insertedUser.id);

    return {
        user: insertedUser,
        token
    };
};

export const loginUser = async (body: LoginDto) => {
    const user = await db
        .select()
        .from(users)
        .where(
            eq(
                sql`lower(${users.email})`,
                body.email.toLowerCase()
            )
        )
        .limit(1);


    if (!user.length) {
        throw new AppError("This user does not exists", 404);
    }

    const isPasswordValid = await bcrypt.compare(
        body.password,
        user[0].password
    );

    if (!isPasswordValid) {
        throw new AppError("Invalid Credentials", 401);
    }

    const accessToken = generateToken(user[0].id);
    if (!accessToken) {
        console.log("Error while generating the access token");
        throw new Error("Error while logging in");
    }

    return {
        user: {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            createdAt: user[0].createdAt,
        },
        token: accessToken,
    };
}