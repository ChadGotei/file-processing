import multer from "multer";

const storage = multer.memoryStorage();

// filter -> multer -> ram (buffer) -> drive (google)
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});