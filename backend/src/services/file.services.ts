import { and, eq, ilike, or, SQL, sql } from "drizzle-orm";
import { db } from "../db";
import { files } from "../db/schema";
import { AppError } from "../errors/AppError";
import { uploadFileDto } from "../schemas/files.schema";
import { deleteFromDrive, downloadFromDrive, renameFilenameFromDrive, uploadToDrive, uploadToDriveViaBuffer } from "./googleDrive.services";
import { paginationMetadata } from "../utils/pagination";
import { mimeToType } from "../utils/misc";
import sharp from "sharp";
import { streamToBuffer } from "../utils/streamToBuffer";

type imageFormats = "jpeg" | "png" | "webp";
const mimeToFormat: Record<string, imageFormats> = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
};

export const uploadFileService = async (
    body: uploadFileDto,
    file: Express.Multer.File,
    userId: number,
) => {
    const uploadedFile = await uploadToDrive(
        file,
        body.fileName
    );

    console.log(uploadedFile);

    if (
        !uploadedFile.id ||
        !uploadedFile.name ||
        !uploadedFile.mimeType ||
        !uploadedFile.size
    ) {
        throw new AppError(
            "Invalid response from Google Drive",
            500
        );
    }

    const [data] = await db
        .insert(files)
        .values({
            ownerId: userId,
            driveFileId: uploadedFile.id,
            filename: uploadedFile.name,
            mimeType: uploadedFile.mimeType,
            size: Number(uploadedFile.size),
        }).returning({
            id: files.id,
            userId: files.ownerId,
            driveFileId: files.driveFileId,
            name: files.filename,
            mimeType: files.mimeType,
            size: files.size,
            createdAt: files.createdAt,
        })

    // return uploadedFile;
    return data;
};

//! v important
export const getUserFiles = async (
    userId: number,
    paginatedQuery: paginationMetadata,
    searchQuery: string | null,
    typeQuery: string | null
) => {
    const { offset, limit } = paginatedQuery;

    const conditions: SQL[] = [
        eq(files.ownerId, userId)
    ];

    if (searchQuery) {
        conditions.push(
            ilike(files.filename, `%${searchQuery}%`)
        );
    }

    // searching via types 🥀🥀
    const typeCondition = getTypeCondition(typeQuery);
    if (typeCondition) {
        conditions.push(typeCondition);
    }

    return await db
        .select({
            id: files.id,
            filename: files.filename,
            mimeType: files.mimeType,
            size: files.size,
            driveFileId: files.driveFileId,
            createdAt: files.createdAt,
        })
        .from(files)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);
};


export const getSingleUserFile = async (userId: number, file_id: number) => {
    const [file] = await db
        .select({
            id: files.id,
            userId: files.ownerId,
            filename: files.filename,
            mimeType: files.mimeType,
            size: files.size,
            driveFileId: files.driveFileId,
            createdAt: files.createdAt,
        })
        .from(files)
        .where(eq(files.id, file_id));

    if (!file) throw new AppError("Invalid file id", 400);
    // console.log(file.userId, userId);
    if (file.userId !== userId) throw new AppError("Unauthorized access", 403);

    return file;
}

export const deleteSingleUserFile = async (
    userId: number,
    file_id: number
) => {
    // searching then deleting in case that the file doesnt even exists or some error occuered
    const [file] = await db
        .select({
            id: files.id,
            filename: files.filename,
            driveId: files.driveFileId,
        })
        .from(files)
        .where(
            and(
                eq(files.id, file_id),
                eq(files.ownerId, userId)
            )
        )
        .limit(1);

    if (!file) {
        throw new AppError("Invalid file", 400);
    }

    await deleteFromDrive(file.driveId);

    await db
        .delete(files)
        .where(eq(files.id, file.id));
};


export const renameSingleUserFile = async (
    userId: number,
    file_id: number,
    newFileName: string,
) => {
    const file = await getSingleUserFile(userId, file_id);

    await renameFilenameFromDrive(
        file.driveFileId,
        newFileName
    );

    await db
        .update(files)
        .set({ filename: newFileName })
        .where(eq(files.id, file_id));
};


//? image processing
export const compressImage = async (
    buffer: Buffer,
    quality: number,
    outputFormat: imageFormats
): Promise<Buffer> => {

    switch (outputFormat) {

        case "jpeg":
            return sharp(buffer)
                .jpeg({ quality })
                .toBuffer();

        case "png":
            return sharp(buffer)
                .png({ quality })
                .toBuffer();

        case "webp":
            return sharp(buffer)
                .webp({ quality })
                .toBuffer();

        default:
            throw new AppError("Unsupported image type", 400);
    }
};

export const compressSingleFile = async (
    fileId: number,
    userId: number,
    quality: number,
    format: imageFormats | undefined
) => {

    const file = await getSingleUserFile(userId, fileId);

    if (!file.mimeType.startsWith("image")) {
        throw new AppError(
            "This functionality is only for images",
            400
        );
    }

    // to change the type of the file -> png to webp etc
    const outputFormat = format ?? mimeToFormat[file.mimeType];     

    const downloadedFile = await downloadFromDrive(file.driveFileId);

    const buffer = await streamToBuffer(downloadedFile.data);

    // main thingy
    const compressedBuffer = await compressImage(
        buffer,
        quality,
        outputFormat
    );

    const driveUploadedFile = await uploadToDriveViaBuffer(
        compressedBuffer,
        file.filename,
        file.mimeType
    );

    if (!driveUploadedFile.id || !driveUploadedFile.size) {
        throw new AppError("Failed to upload compressed file", 500);
    }

    const [newCompressedFile] = await db
        .insert(files)
        .values({
            ownerId: userId,
            driveFileId: driveUploadedFile.id,
            filename: file.filename,
            mimeType: file.mimeType,
            size: Number(driveUploadedFile.size),
        })
        .returning();

    return newCompressedFile;
};




//? Helpers -> adding an abstraction layer to make service function smaller
const getTypeCondition = (type: string | null): SQL | undefined => {
    if (type === "img") {
        return or(
            eq(files.mimeType, mimeToType.jpg),
            eq(files.mimeType, mimeToType.png),
            eq(files.mimeType, mimeToType.wepb)
        );
    }

    if (type === "pdf") {
        return eq(files.mimeType, mimeToType.pdf);
    }

    if (type === "docs") {
        return or(
            eq(files.mimeType, mimeToType.docx),
            eq(files.mimeType, mimeToType.doc)
        );
    }

    return undefined;
};