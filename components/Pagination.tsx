import Link from "next/link";
import { PAGE_SIZE } from "@/lib/config";

// basePath مثل "/" أو "/category/laptops" أو "/search?q=phone"
export default function Pagination({
  basePath,
  page,
  total,
}: {
  basePath: string;
  page: number;
  total: number;
}) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;
  const href = (n: number) => `${basePath}${basePath.includes("?") ? "&" : "?"}page=${n}`;
  const link = "rounded-full px-4 py-2 ring-1 ring-stone-200 bg-white hover:ring-teal-700";
  return (
    <nav aria-label="الصفحات" className="mt-10 flex items-center justify-center gap-3">
      {page > 1 && (
        <Link href={href(page - 1)} className={link}>
          → السابقة
        </Link>
      )}
      <span className="text-stone-600">
        صفحة {page} من {pages}
      </span>
      {page < pages && (
        <Link href={href(page + 1)} className={link}>
          التالية ←
        </Link>
      )}
    </nav>
  );
}
