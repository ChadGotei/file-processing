import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

export const env = {
    port: Number(process.env.PORT) || 5000,

    db: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "task_manager",
    },

    jwt: {
        expires_in: (process.env.JWT_EXPIRES_IN || "1d") as StringValue,
        secret: process.env.JWT_SECRET || ""
    },

    node_env: process.env.NODE_ENV,

    drive_folder_id: process.env.DRIVE_FOLDER_ID || ""
};