import { api } from "./http";

export type FileTypeFilter = "pdf" | "docs" | "img";

export type UserFile = {
  id: number;
  filename: string;
  mimeType: string;
  size: number;
  driveFileId: string;
  createdAt: string;
};

type FilesResponse = {
  message: string;
  metadata: {
    total: number;
    page: number;
    limit: number;
  };
  data: UserFile[];
};

export type FileListParams = {
  page: number;
  limit: number;
  search?: string;
  type?: FileTypeFilter;
};

export async function getFiles(params: FileListParams) {
  const response = await api.get<FilesResponse>("/file/my-files", { params });
  return response.data;
}

export async function uploadFile(file: File, fileName: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);

  await api.post("/file/upload-file", formData);
}

export async function renameFile(fileId: number, fileName: string) {
  await api.patch(`/file/${fileId}`, { fileName });
}

export async function deleteFile(fileId: number) {
  await api.delete(`/file/${fileId}`);
}

export function getFileStreamUrl(fileId: number, mode: "view" | "download") {
  const baseUrl = api.defaults.baseURL?.replace(/\/$/, "") ?? "";
  return `${baseUrl}/file/${fileId}?mode=${mode}`;
}
