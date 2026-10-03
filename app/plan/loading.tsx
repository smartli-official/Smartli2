export default function PlanLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6 px-4 pt-16 md:pt-24" aria-hidden="true">
      <div className="mx-auto h-10 w-72 rounded-xl bg-white/[0.06]" />
      <div className="h-32 rounded-3xl bg-white/[0.04]" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="h-96 rounded-3xl bg-white/[0.04]" />
        <div className="h-96 rounded-3xl bg-white/[0.04]" />
        <div className="h-96 rounded-3xl bg-white/[0.04]" />
      </div>
    </div>
  );
}
