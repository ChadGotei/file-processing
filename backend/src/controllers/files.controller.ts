import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../errors/AppError";
import { deleteSingleUserFile, getSingleUserFile, getUserFiles, renameSingleUserFile, uploadFileService } from "../services/file.services";
import { downloadFromDrive } from "../services/googleDrive.services";
import { getFileExtension } from "../utils/misc";
import { getPagination } from "../utils/pagination";

export const uploadFile = asyncHandler(async (req, res) => {
    const file = req.file;
    const body = req.body;
    const currentUser = req.user;

    if (!file) throw new AppError("File is a required field", 400);

    const data = await uploadFileService(body, file, currentUser.id);
    console.log(data);

    res.status(201).json({
        message: "File uploaded successfully",
        data
    });
});

// get all files with all the required params
export const getAllUserFiles = asyncHandler(async (req, res) => {
    const paginationQuery = getPagination(req.query);
    const searchQuery =
        typeof req.query.search === "string"
            ? req.query.search
            : null;

    const fileType = ["pdf", "docs", "img"];

    const typeQuery =
        (typeof req.query.type === "string" && fileType.includes(req.query.type)) ? req.query.type : null;

    const files = await getUserFiles(
        req.user!.id,
        paginationQuery,
        searchQuery,
        typeQuery
    );

    res.status(200).json({
        message: "User files fetched successfully",

        metadata: {
            total: files.length,
            page: paginationQuery.page,
            limit: paginationQuery.limit
        },

        data: files,
    });
});


export const getSingleFile = asyncHandler(async (req, res) => {
    const fileId = req.params.fileId ?? "";
    const file = await getSingleUserFile(req.user!.id, +fileId);


    res.status(200).json({
        message: "User files fetched successfully",
        data: file,
    });

})

export const getDownloadSingleFile = asyncHandler(async (req, res) => {
    const mode = req.query.mode;

    const fileData = await getSingleUserFile(
        req.user!.id,
        +req.params.fileId
    );

    const response = await downloadFromDrive(fileData.driveFileId);
    const extension = getFileExtension(fileData.mimeType);

    res.setHeader("Content-Type", fileData.mimeType);
    res.setHeader("Content-Length", fileData.size);

    if (mode === "download") {
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileData.filename}.${extension}"`
        );

        response.data.pipe(res);
        return;
    }

    if (mode === "view") {
        res.setHeader("Content-Disposition", "inline");

        response.data.pipe(res);
        return;
    }

    res.status(400).json({
        message: "Invalid mode. Use 'view' or 'download'."
    });

});


export const deleteSingleFile = asyncHandler(async (req, res) => {
    await deleteSingleUserFile(req.user!.id, +req.params.fileId);

    res.status(204).send();
})


export const renameSingleFile = asyncHandler(async (req, res) => {
    const body = req.body;
    const response = await renameSingleUserFile(req.user!.id, +req.params.fileId, body.fileName);

    res.status(200).json({
        message: "Filename updated successfully",
        data: response
    });
});