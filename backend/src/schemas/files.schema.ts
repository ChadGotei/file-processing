import z from "zod";

const uploadFileSchema = z.object({
    fileName: z.string()
})

const compressImageSchema = z.object({
    quality: z.number().min(5).max(95),
    format: z.enum(["jpeg", "png", "webp"]).optional(),
})

export const fileSchema = {
    uploadFileSchema,
    compressImageSchema
};

export type uploadFileDto = z.infer<typeof uploadFileSchema>