// includes all the general/misc utils functions

export const allowedMimeTypes: Record<string, string> = {
    // Images
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",

    // Documents
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const getFileExtension = (mimeType: string): string => {
    const mimeMap: Record<string, string> = allowedMimeTypes;

    return mimeMap[mimeType] ?? "bin";
};

// matching object only 
export const mimeToType = {
    jpg: "image/jpeg",
    png: "image/png",
    wepb: "image/webp",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

export { getFileExtension };