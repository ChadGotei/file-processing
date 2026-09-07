import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 text-slate-900 sm:px-8 sm:py-12">
      <Outlet />
    </main>
  );
}
