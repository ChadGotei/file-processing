import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../api/auth";
import { SessionState } from "../features/auth/session-state";
import { currentUserQueryKey, useCurrentUser } from "../features/auth/use-current-user";
import { Button } from "../components/ui/Button";
import { formatDate } from "../utils/file-utils";
import { getInitials } from "../utils/utils";


export function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: currentUserQueryKey });
      toast.success("Signed out successfully.");
      navigate("/login", { replace: true });
    },
    onError: () => toast.error("Unable to sign out. Please try again."),
  });

  if (!user) return <SessionState message="Loading your profile" />;

  const logoutError = logoutMutation.error;
  const logoutErrorMessage = logoutError instanceof AxiosError && typeof logoutError.response?.data?.message === "string"
    ? logoutError.response.data.message
    : logoutError ? "Unable to sign out. Please try again." : null;

  return (
    <section className="mx-auto max-w-2xl flex flex-col justify-center min-h-[40vh] md:min-h-auto mt-0 md:mt-8">
      <header className="flex items-start justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-white">
            {getInitials(user.name)}
          </span>
          <div>
            <p className="text-xs font-medium text-slate-500">File Processing Platform</p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900">{user.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:cursor-pointer hover:bg-slate-50" to="/files">Files</Link>
          <Button variant="secondary" size="sm" isLoading={logoutMutation.isPending} loadingText="Signing out" onClick={() => logoutMutation.mutate()}>
            Sign out
          </Button>
        </div>
      </header>

      <p className="mb-2.5 mt-7 text-xs font-semibold uppercase tracking-wide text-slate-500">Account details</p>
      <dl className="overflow-hidden rounded-md border border-slate-200">
        <div className="flex items-baseline justify-between border-b border-slate-100 px-4.5 py-3.5">
          <dt className="text-sm font-medium text-slate-500">Name</dt>
          <dd className="text-sm font-medium text-slate-900">{user.name}</dd>
        </div>
        <div className="flex items-baseline justify-between border-b border-slate-100 px-4.5 py-3.5">
          <dt className="text-sm font-medium text-slate-500">Email address</dt>
          <dd className="text-sm font-medium text-slate-900">{user.email}</dd>
        </div>
        <div className="flex items-baseline justify-between px-4.5 py-3.5">
          <dt className="text-sm font-medium text-slate-500">Account created</dt>
          <dd className="font-mono text-sm text-slate-600">{formatDate(user.createdAt)}</dd>
        </div>
      </dl>

      {logoutErrorMessage && <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{logoutErrorMessage}</p>}
    </section>
  );
}