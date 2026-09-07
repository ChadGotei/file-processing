import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadFile } from "../../api/files";
import { Button } from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/loading-state";

const supportedExtensions = [
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
  "webp",
];

const maxFileSize = 10 * 1024 * 1024;

function fileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function FileUpload({ onUploaded }: { onUploaded: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: ({
      selectedFile,
      name,
    }: {
      selectedFile: File;
      name: string;
    }) => uploadFile(selectedFile, name),

    onSuccess: () => {
      setFile(null);
      setFileName("");
      setError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploaded();
      toast.success("File uploaded successfully.");
    },

    onError: () => {
      toast.error("Unable to upload this file. Please try again.");
    },
  });

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    setError(null);
    setFile(selectedFile);
    setFileName(selectedFile?.name ?? "");

    if (
      selectedFile &&
      !supportedExtensions.includes(fileExtension(selectedFile.name))
    ) {
      setError(
        "Choose a PDF, Word document, JPEG, PNG, or WebP file.",
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Choose a file to upload.");
      return;
    }

    if (!supportedExtensions.includes(fileExtension(file.name))) {
      setError(
        "Choose a PDF, Word document, JPEG, PNG, or WebP file.",
      );
      return;
    }

    if (file.size > maxFileSize) {
      setError("The selected file must be 10 MB or smaller.");
      return;
    }

    if (!fileName.trim()) {
      setError("Enter a file name.");
      return;
    }

    setError(null);

    uploadMutation.mutate({
      selectedFile: file,
      name: fileName.trim(),
    });
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_auto] lg:items-end">
        {/* File selection */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Select file
          </span>

          <input
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp"
            className="
              mt-1.5 block w-full cursor-pointer
              rounded-md border border-slate-300 bg-white
              text-sm text-slate-600
              transition
              file:mr-3 file:cursor-pointer file:border-0
              file:border-r file:border-slate-200
              file:bg-slate-50 file:px-3 file:py-2.5
              file:text-sm file:font-medium file:text-slate-700
              hover:border-slate-400
              hover:file:bg-slate-100
              focus:outline-none
              focus:ring-2 focus:ring-blue-100
            "
            onChange={selectFile}
            ref={fileInputRef}
            type="file"
          />

          <span className="mt-1.5 block text-xs text-slate-500">
            PDF, Word, JPEG, PNG or WebP · Max 10 MB
          </span>
        </label>

        {/* File name */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            File name
          </span>

          <input
            className="
              mt-1.5 block w-full rounded-md
              border border-slate-300 bg-white
              px-3 py-2.5 text-sm text-slate-900
              outline-none transition
              placeholder:text-slate-400
              hover:border-slate-400
              focus:border-blue-600
              focus:ring-2 focus:ring-blue-100
            "
            onChange={(event) => setFileName(event.target.value)}
            placeholder="Enter file name"
            value={fileName}
          />

          <span className="mt-1.5 block text-xs text-slate-500">
            You can rename the file before uploading.
          </span>
        </label>

        {/* Upload */}
        <Button
          disabled={uploadMutation.isPending}
          type="submit"
          className="my-auto"
        >
          {uploadMutation.isPending && (
            <LoadingState compact message="Uploading file" />
          )}

          {uploadMutation.isPending ? "Uploading" : "Upload file"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
    </form>
  );
}