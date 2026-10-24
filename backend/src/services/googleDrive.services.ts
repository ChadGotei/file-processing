// related to google drive api and stuff
import fs from "fs";
import { google } from "googleapis";
import { env } from "../config/env";
import { Readable } from "stream";

//? client_secret.json → identifies your application to Google.
//? token.json → contains credentials proving that authorization has already been granted for the Google account/scopes used by your app.

const credentials = JSON.parse(
    fs.readFileSync("./client_secret.json", "utf-8")
);

const token = JSON.parse(
    fs.readFileSync("./token.json", "utf-8")
);

const { client_secret, client_id } = credentials.installed;

const auth = new google.auth.OAuth2(
    client_id,
    client_secret
);

auth.setCredentials(token);

const drive = google.drive({
    version: "v3",
    auth,
});

// responsible for actual upload to google drive here
export const uploadToDrive = async (file: Express.Multer.File, fileName: string) => {
    const response = await drive.files.create({
        requestBody: {
            name: fileName ?? file.originalname,  // ask the user for the filename as well
            parents: [env.drive_folder_id]
        },
        media: {
            body: Readable.from(file.buffer),
            // tells google drive wot type of file, .jpg, .pdf etc
            mimeType: file.mimetype
        },
        fields: "id, name, mimeType, size",
    })

    // console.log(response);
    return response.data;
}

// asking for the content of the file -> response is readable stream
export const downloadFromDrive = async (driveFileId: string) => {
    return await drive.files.get(
        {
            fileId: driveFileId,
            alt: "media",
        },
        {
            responseType: "stream"
        }
    )
}

export const deleteFromDrive = async (driveFileId: string) => {
    return await drive.files.delete(
        {
            fileId: driveFileId,
        }
    )
}

export const renameFilenameFromDrive = async (driveFileId: string, newFileName: string) => {
    return await drive.files.update(
        {
            fileId: driveFileId,
            requestBody: {
                name: newFileName
            },
            fields: "id, name"
        },
    )
}


// upload to drive via buffer
export const uploadToDriveViaBuffer = async (
    buffer: Buffer,
    fileName: string,
    mimeType: string
) => {

    const response = await drive.files.create({

        requestBody: {
            name: fileName,
            parents: [env.drive_folder_id]
        },

        media: {
            body: Readable.from(buffer),
            mimeType
        },

        fields: "id, name, mimeType, size",
    });

    return response.data;
};