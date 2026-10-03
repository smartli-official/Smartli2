export default function AILoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background" aria-hidden="true">
      <div className="h-12 w-12 animate-pulse rounded-xl bg-white/[0.08]" />
      <div className="h-6 w-56 animate-pulse rounded-full bg-white/[0.06]" />
      <div className="h-32 w-full max-w-4xl animate-pulse rounded-[32px] bg-white/[0.04]" />
    </div>
  );
}
