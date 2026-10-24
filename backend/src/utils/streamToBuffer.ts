import { Readable } from "node:stream";

export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
    // chunks is array of buffer, we load buffer into chunks then concate them and return
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
};