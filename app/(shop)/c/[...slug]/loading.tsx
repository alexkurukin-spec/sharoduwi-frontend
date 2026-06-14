// Скелетон каталога через Suspense (спека §7).
export default function CategoryLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 h-9 w-56 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square animate-pulse rounded-xl bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
