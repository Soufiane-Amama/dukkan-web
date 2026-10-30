// بطاقات رمادية تنبض مكان المنتجات حتى تصل
export default function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-label="جارٍ التحميل">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-white p-3 ring-1 ring-stone-200">
          <div className="aspect-square rounded-xl bg-stone-200" />
          <div className="mt-3 h-3 w-1/3 rounded bg-stone-200" />
          <div className="mt-2 h-4 w-3/4 rounded bg-stone-200" />
          <div className="mt-3 h-5 w-1/2 rounded bg-stone-200" />
        </div>
      ))}
    </div>
  );
}
