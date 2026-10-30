import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-6xl font-bold text-teal-800" dir="ltr">
        404
      </p>
      <h1 className="mt-4 text-xl font-bold">لم نجد هذه الصفحة</h1>
      <p className="mt-2 text-stone-500">ربما حُذف المنتج، أو الرابط فيه خطأ.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-teal-800 px-6 py-2 text-white hover:bg-teal-700"
      >
        العودة إلى المتجر
      </Link>
    </div>
  );
}
