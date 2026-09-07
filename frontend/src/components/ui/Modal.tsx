import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
      role="dialog"
    >
      <div
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className="text-[15px] font-semibold text-slate-900">{title}</p>
        {description && <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{description}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}