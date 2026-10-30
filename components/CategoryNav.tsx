import Link from "next/link";
import { getCategories } from "@/lib/api";

export default async function CategoryNav({ active }: { active?: string }) {
  const categories = await getCategories();
  const chip = (selected: boolean) =>
    `shrink-0 rounded-full px-4 py-1.5 text-sm ring-1 transition ${
      selected
        ? "bg-teal-800 text-white ring-teal-800"
        : "bg-white text-stone-700 ring-stone-200 hover:ring-teal-700"
    }`;
  return (
    <nav aria-label="التصنيفات" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
      <Link href="/" className={chip(!active)} aria-current={!active ? "page" : undefined}>
        الكل
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className={chip(c.slug === active)}
          aria-current={c.slug === active ? "page" : undefined}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
