import { AxiosError } from "axios";
import { Navigate, Outlet } from "react-router-dom";
import { SessionState } from "./session-state";
import { useCurrentUser } from "./use-current-user";

function isUnauthorized(error: Error | null) {
  return error instanceof AxiosError && error.response?.status === 401;
}

function SessionCheckError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">Unable to verify your account</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Please check your internet connection, or try again later.</p>
      <button className="mt-5 rounded-md bg-slate-900 px-4 hover:cursor-pointer py-2 text-sm font-medium text-white hover:bg-slate-800" onClick={onRetry} type="button" >
        Try again
      </button>
    </section>
  );
}

export function ProtectedRoute() {
  const { data: user, error, isPending, refetch } = useCurrentUser();

  if (isPending) return <SessionState message="Fetching user details" />;
  if (isUnauthorized(error) || !user && !error) return <Navigate replace to="/login" />;
  if (error) return <SessionCheckError onRetry={() => void refetch()} />;

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { data: user, error, isPending, refetch } = useCurrentUser();

  if (isPending) return <SessionState message="Fetching user details" />;
  if (error && !isUnauthorized(error)) return <SessionCheckError onRetry={() => void refetch()} />;
  if (user) return <Navigate replace to="/profile" />;

  return <Outlet />;
}
