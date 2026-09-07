import express from "express";
import morgan from "morgan";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "File Processing API is running"
    });
});

// centralized routes
app.use("/api", routes)

// not found -> place at the end so if no matches then automatically goes to this
app.use(notFoundHandler);
// since it has 4 params so express auto detects it as error middleware and sends error to this 
app.use(errorHandler);


export default app;