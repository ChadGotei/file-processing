// src/components/files/FileActions.tsx
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { deleteFile, getFileStreamUrl, renameFile, type UserFile } from "../../api/files";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { ViewIcon, DownloadIcon, RenameIcon, DeleteIcon } from "../icons";
import { isViewable } from "../../utils/utils";

const iconButtonClasses = "inline-flex md:w-9 md:h-9 h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:cursor-pointer hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent";
const iconButtonDangerClasses = "hover:bg-red-50 hover:text-red-700 disabled:hover:bg-transparent";

function ActionLink({ href, label, children, download }: { href: string; label: string; children: ReactNode; download?: boolean }) {
  return (
    <a
      aria-label={label}
      className={iconButtonClasses}
      href={href}
      rel={download ? undefined : "noreferrer"}
      target={download ? undefined : "_blank"}
      title={label}
    >
      {children}
    </a>
  );
}

function ActionButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      className={`${iconButtonClasses} ${danger ? iconButtonDangerClasses : ""}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export default function FileActions({ file, onChanged }: { file: UserFile; onChanged: () => void }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [name, setName] = useState(file.filename);
  const [renameError, setRenameError] = useState<string | null>(null);

  const renameMutation = useMutation({
    mutationFn: () => renameFile(file.id, name.trim()),
    onSuccess: () => {
      setIsRenaming(false);
      setRenameError(null);
      onChanged();
      toast.success("File renamed.");
    },
    onError: () => {
      setRenameError("Unable to rename this file.");
      toast.error("Unable to rename this file.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteFile(file.id),
    onSuccess: () => {
      setIsConfirmingDelete(false);
      onChanged();
      toast.success("File deleted.");
    },
    onError: () => toast.error("Unable to delete this file. Please try again."),
  });

  function submitRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setRenameError("Enter a file name.");
      return;
    }
    setRenameError(null);
    renameMutation.mutate();
  }

  function openRename() {
    setName(file.filename);
    setRenameError(null);
    setIsRenaming(true);
  }

  function closeRename() {
    setName(file.filename);
    setRenameError(null);
    setIsRenaming(false);
  }

  return (
    <>
      <div className="flex items-center justify-end gap-0.5">
        {isViewable(file.mimeType) && (
          <ActionLink href={getFileStreamUrl(file.id, "view")} label="View">
            <ViewIcon />
          </ActionLink>
        )}

        <ActionLink download href={getFileStreamUrl(file.id, "download")} label="Download">
          <DownloadIcon />
        </ActionLink>
        <ActionButton label="Rename" onClick={openRename}>
          <RenameIcon />
        </ActionButton>
        <ActionButton danger disabled={deleteMutation.isPending} label="Delete" onClick={() => setIsConfirmingDelete(true)}>
          <DeleteIcon />
        </ActionButton>
      </div>

      <Modal isOpen={isRenaming} onClose={closeRename} title="Rename file" description="Choose a new name for this file.">
        <form className="space-y-3" onSubmit={submitRename}>
          <input
            aria-label="New file name"
            autoFocus
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
          {renameError && <p className="text-xs text-red-700">{renameError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button onClick={closeRename} type="button" variant="secondary">
              Cancel
            </Button>
            <Button isLoading={renameMutation.isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        description={`Are you sure you want to delete “${file.filename}”? This cannot be undone.`}
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        title="Delete file"
      >
        <div className="flex justify-end gap-2">
          <Button onClick={() => setIsConfirmingDelete(false)} type="button" variant="secondary">
            Cancel
          </Button>
          <Button isLoading={deleteMutation.isPending} onClick={() => deleteMutation.mutate()} type="button" variant="danger">
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}