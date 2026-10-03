// Instant skeleton so navigation never shows a blank 9s stall.
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6 p-6" aria-hidden="true">
      <div className="h-10 w-64 rounded-xl bg-white/[0.06]" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="h-32 rounded-2xl bg-white/[0.04]" />
        <div className="h-32 rounded-2xl bg-white/[0.04] md:col-span-3" />
      </div>
      <div className="h-48 rounded-2xl bg-white/[0.04]" />
    </div>
  );
}
