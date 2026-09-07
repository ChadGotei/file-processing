import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center justify-center py-8 sm:min-h-[calc(100vh-6rem)]">
      <div className="w-full border-l-4 border-slate-900 bg-white px-7 py-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">This page does not exist.</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">The address may be incorrect, or the page may have moved.</p>
        <Link className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" to="/">
          Return to your account
        </Link>
      </div>
    </section>
  );
}
