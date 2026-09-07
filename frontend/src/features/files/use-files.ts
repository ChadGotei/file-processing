import { useQuery } from "@tanstack/react-query";
import { getFiles, type FileListParams } from "../../api/files";

export function filesQueryKey(params: FileListParams) {
  return ["files", params] as const;
}

export function useFiles(params: FileListParams) {
  return useQuery({
    queryKey: filesQueryKey(params),
    queryFn: () => getFiles(params),
    placeholderData: (previousData) => previousData,
  });
}
