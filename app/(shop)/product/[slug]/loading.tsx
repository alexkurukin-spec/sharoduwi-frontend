// Скелетон PDP через Suspense (спека §7).
export default function ProductLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
        <div className="flex flex-col gap-4">
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-10 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-12 w-full max-w-sm animate-pulse rounded bg-muted" />
        </div>
      </div>
    </main>
  );
}
