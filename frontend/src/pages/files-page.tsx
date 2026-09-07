import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { type FileTypeFilter } from "../api/files";
import { LoadingState } from "../components/ui/loading-state";
import { FileUpload } from "../features/files/file-upload";
import { useFiles } from "../features/files/use-files";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { pageLimits } from "../constant";
import { fileTypeLabel, formatDate, formatFileSize } from "../utils/file-utils";
import FileActions from "../components/files/FileActions";
import { Button } from "../components/ui/Button";

// helpers -> cant think of anywhere else to put them
const typeBadgeClasses: Record<FileTypeFilter, string> = {
  pdf: "bg-red-50 text-red-700",
  img: "bg-blue-50 text-blue-700",
  docs: "bg-green-50 text-green-700",
};

function TypeBadge({ mimeType, type }: { mimeType: string; type?: FileTypeFilter }) {
  const classes = type ? typeBadgeClasses[type] : "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 font-mono md:text-[13px] text-[10.5px] font-medium ${classes}`}>
      {fileTypeLabel(mimeType)}
    </span>
  );
}

// naive mime->filter mapping just for badge coloring; adjust if fileTypeLabel already encodes this differently
function inferTypeFilter(mimeType: string): FileTypeFilter | undefined {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.startsWith("image/")) return "img";
  if (mimeType.includes("word") || mimeType.includes("document") || mimeType.includes("text")) return "docs";
  return undefined;
}

export function FilesPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [type, setType] = useState<FileTypeFilter | undefined>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const search = useDebouncedValue(searchInput.trim());
  const params = useMemo(() => ({ page, limit, ...(search ? { search } : {}), ...(type ? { type } : {}) }), [page, limit, search, type]);
  const { data, error, isFetching, isPending, refetch } = useFiles(params);

  function refreshFiles() {
    void queryClient.invalidateQueries({ queryKey: ["files"] });
  }

  function changeSearch(value: string) {
    setSearchInput(value);
    setPage(1);
  }

  function changeType(value: string) {
    setType(value ? value as FileTypeFilter : undefined);
    setPage(1);
  }

  function changeLimit(value: number) {
    setLimit(value);
    setPage(1);
  }

  const files = data?.data ?? [];
  const total = data?.metadata.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const canGoNext = files.length === limit && page < totalPages;
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = total === 0 ? 0 : rangeStart + files.length - 1;

  return (
    <section className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium text-slate-500">File Processing Platform</p>
          <div className="mt-1 flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Your files</h1>
            {total > 0 && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-700">
                {total} {total === 1 ? "file" : "files"}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">Upload, find, and manage files in one place.</p>
        </div>
        <Link className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:cursor-pointer hover:bg-slate-100" to="/profile">Profile</Link>
      </header>

      <div className="mt-6"><FileUpload onUploaded={refreshFiles} /></div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block w-full sm:max-w-sm">
          <span className="text-sm font-medium text-slate-700">Search files</span>
          <input
            className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => changeSearch(event.target.value)}
            placeholder="Search by filename"
            value={searchInput}
          />
        </label>

        <div className="flex gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Type</span>
            <select
              className={`mt-1.5 hover:cursor-pointer block rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 
                ${type === "pdf" && "border-red-600 bg-red-50 font-medium text-red-700"}
                ${type === "docs" && "border-green-600 bg-green-50 font-medium text-green-700"}
                ${type === "img" && "border-blue-600 bg-blue-50 font-medium text-blue-700"}
                `}
              onChange={(event) => changeType(event.target.value)}
              value={type ?? ""}
            >
              <option value="">All types</option>
              <option value="pdf">PDF</option>
              <option value="docs">Documents</option>
              <option value="img">Images</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Per page</span>
            <select className="mt-1.5 block rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" onChange={(event) => changeLimit(Number(event.target.value))} value={limit}>
              {pageLimits.map((pageLimit) => <option key={pageLimit} value={pageLimit}>{pageLimit}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isPending ? <LoadingState message="Loading files" /> : error ? (
          <div className="p-8 text-center"><p className="text-sm text-slate-600">Unable to load your files.</p><button className="mt-3 text-sm font-medium text-slate-900 underline underline-offset-4 hover:cursor-pointer" onClick={() => void refetch()} type="button">Try again</button></div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center"><p className="text-sm font-medium text-slate-800">No files found</p><p className="mt-1 text-sm text-slate-600">Upload a supported file or adjust your search and filters.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Filename</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Size</th>
                <th className="px-5 py-3">Uploaded</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {files.map((file) => (
                  <tr className="transition-colors hover:bg-blue-50/60" key={file.id}>
                    <td className="max-w-xs truncate px-5 py-4 text-sm font-medium text-slate-900" title={file.filename}>{file.filename}</td>
                    <td className="px-5 py-4"><TypeBadge mimeType={file.mimeType} type={inferTypeFilter(file.mimeType)} /></td>
                    <td className="px-5 py-4 font-mono  text-xs text-slate-600">{formatFileSize(file.size)}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-600">{formatDate(file.createdAt)}</td>
                    <td className="px-5 py-4">
                      <FileActions file={file} onChanged={refreshFiles} />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {total > 0 ? <>Showing {rangeStart}–{rangeEnd} of <span className="font-mono font-semibold text-blue-700">{total}</span></> : "No files"}
          {isFetching && !isPending ? " · Refreshing" : ""}
        </p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500">
            page <span className="font-semibold text-blue-700">{page}</span> / {totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={page === 1 || isFetching} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button variant="secondary" size="sm" disabled={!canGoNext || isFetching} onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}