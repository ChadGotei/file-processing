import { Router } from "express";
import { compressFile, deleteSingleFile, getAllUserFiles, getDownloadSingleFile, getSingleFile, renameSingleFile, uploadFile } from "../controllers/files.controller";
import { protectedRoute } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { validate } from "../middlewares/validate.middleware";
import { fileSchema } from "../schemas/files.schema";
import { validateFileId, validateFileType } from "../middlewares/files.middleware";

const router = Router();

router.post("/upload-file",
    protectedRoute,
    upload.single("file"),
    validateFileType,   // to prevent uploading weird files such as .mp4, .bin etc
    validate(fileSchema.uploadFileSchema),
    uploadFile);

router.get("/my-files", protectedRoute, getAllUserFiles);

router.post("/:fileId/compress", protectedRoute, validate(fileSchema.compressImageSchema), compressFile);

router.route("/:fileId")
    .get(protectedRoute, validateFileId, getDownloadSingleFile)
    .delete(protectedRoute, validateFileId, deleteSingleFile)
    // same schema would work as this also just needs filename
    .patch(protectedRoute, validateFileId, validate(fileSchema.uploadFileSchema), renameSingleFile)

router.get("/:fileId/res", protectedRoute, getSingleFile);


export default router;