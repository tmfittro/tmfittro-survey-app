export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">404 — Page Not Found</h1>
        <p className="text-sm text-slate-500">Did you forget to add the page to the router?</p>
      </div>
    </div>
  );
}
