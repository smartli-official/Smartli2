export default function FocusLoading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl animate-pulse flex-col items-center justify-center gap-8 p-6 lg:flex-row lg:gap-16" aria-hidden="true">
      <div className="h-72 w-72 rounded-full bg-white/[0.05]" />
      <div className="w-full max-w-md space-y-4">
        <div className="h-8 w-48 rounded-lg bg-white/[0.06]" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-2xl bg-white/[0.04]" />
          <div className="h-20 rounded-2xl bg-white/[0.04]" />
          <div className="h-20 rounded-2xl bg-white/[0.04]" />
          <div className="h-20 rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}
