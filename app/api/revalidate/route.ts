import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getMe } from "@/lib/api";

// صفحات المتجر تحفظ بيانات الكتالوج ساعة. بعد أن يعدّل صاحب المتجر منتجاً، تطلب لوحته هذا المسار
// فتُحدَّث كل الصفحات فوراً. نتأكد من الخادم أن صاحب الرمز صاحب متجر، حتى لا يستعمله أي أحد.
export async function POST(request: Request) {
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  try {
    const me = await getMe(token);
    if (me.role !== "admin") return NextResponse.json({ message: "لصاحب المتجر فقط" }, { status: 403 });
  } catch {
    return NextResponse.json({ message: "سجّل الدخول أولاً" }, { status: 401 });
  }
  revalidateTag("catalog");
  return NextResponse.json({ revalidated: true });
}
