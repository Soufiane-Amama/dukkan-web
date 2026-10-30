"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

// ملف error.tsx يجب أن يكون Client Component. يظهر بدل الصفحة إذا حدث خطأ، مثل انقطاع الـ API
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  // reset وحده يعيد العرض في المتصفح فقط، و router.refresh يطلب بيانات الصفحة من الخادم من جديد
  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
      <p className="text-4xl" aria-hidden="true">
        🔌
      </p>
      <h1 className="mt-4 text-xl font-bold">تعذّر تحميل المنتجات</h1>
      <p className="mt-2 text-stone-500">تحقق من اتصالك بالإنترنت، ثم حاول مرة أخرى.</p>
      <button
        onClick={retry}
        className="mt-6 rounded-full bg-teal-800 px-6 py-2 text-white hover:bg-teal-700"
      >
        أعد المحاولة
      </button>
    </div>
  );
}
