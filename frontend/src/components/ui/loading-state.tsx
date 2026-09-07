type LoadingStateProps = {
  message?: string;
  compact?: boolean;
};

export function LoadingState({ message = "Loading", compact = false }: LoadingStateProps) {
  if (compact) {
    return (
      <span aria-label={message} className="inline-flex items-center" role="status">
        <span className="relative inline-block h-6 w-6">
          <span className="absolute inset-0 rounded-full border-2 border-white/25" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-white" />
        </span>
      </span>
    );
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center"  role="status">
      <div className="flex flex-col items-center gap-4 border border-slate-200 bg-white px-10 py-8 shadow-lg rounded-sm">
        <span className="relative inline-block h-10 w-10">
          <span className="absolute inset-0 rounded-full border-[3px] border-slate-200" />
          <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-slate-900 hover:border-t-amber-500" />
        </span>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500">{message}</p>
      </div>
    </div>
  );
}