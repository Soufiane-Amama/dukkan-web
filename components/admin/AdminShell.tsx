"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const TABS = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/orders", label: "الطلبات" },
];

// اللوحة تظهر لصاحب المتجر فقط. هذا للعرض فقط: الحماية الحقيقية في الخادم، الذي يرفض أي طلب من غيره
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const path = usePathname();

  if (!ready) return <p className="text-stone-500">جارٍ التحقق من حسابك...</p>;
  if (!user) {
    return (
      <p>
        لوحة المتجر لصاحب المتجر.{" "}
        <Link href={`/login?next=${path}`} className="text-teal-800 underline">
          سجّل الدخول
        </Link>
      </p>
    );
  }
  if (user.role !== "admin") return <p role="alert">هذه الصفحة لصاحب المتجر فقط.</p>;

  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <span className="me-4 text-xl font-bold">لوحة المتجر</span>
        <nav aria-label="أقسام اللوحة" className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active(tab.href) ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm ${active(tab.href) ? "bg-teal-800 text-white" : "hover:bg-stone-200"}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
