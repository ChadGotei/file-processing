import z from "zod";

const uploadFileSchema = z.object({
    fileName: z.string()
})

export const fileSchema = {
    uploadFileSchema
};

export type uploadFileDto = z.infer<typeof uploadFileSchema>