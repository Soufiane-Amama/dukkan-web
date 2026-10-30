// يظهر تلقائياً بينما يجلب Next.js بيانات المنتج
export default function Loading() {
  return (
    <div className="grid animate-pulse gap-10 md:grid-cols-2" aria-label="جارٍ التحميل">
      <div className="aspect-square rounded-3xl bg-stone-200" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-stone-200" />
        <div className="h-8 w-3/4 rounded bg-stone-200" />
        <div className="h-10 w-40 rounded bg-stone-200" />
        <div className="h-12 w-72 rounded-full bg-stone-200" />
      </div>
    </div>
  );
}
