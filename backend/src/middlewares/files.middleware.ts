import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { allowedMimeTypes } from "../utils/misc";

export const validateFileType = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
        throw new AppError("No file uploaded", 400);
    }

    if (!allowedMimeTypes[file.mimetype]) {
        throw new AppError("Unsupported file type", 400);
    }

    next();
};

// validating fileId
export const validateFileId = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const fileId = Number(req.params.fileId);

    if (!Number.isInteger(fileId) || fileId <= 0) {
        throw new AppError("Invalid file ID", 400);
    }

    next();
};
