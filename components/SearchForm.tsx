"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q")?.toString().trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    // الشكل البيضاوي على النموذج نفسه: الحقل dir="auto" يغيّر اتجاهه حسب النص، فلا نضع عليه زوايا
    <form
      role="search"
      onSubmit={handleSubmit}
      className="order-last flex w-full overflow-hidden rounded-full bg-white focus-within:ring-2 focus-within:ring-amber-400 sm:order-none sm:w-auto sm:flex-1"
    >
      <label htmlFor="q" className="sr-only">
        ابحث عن منتج
      </label>
      <input
        id="q"
        name="q"
        type="search"
        dir="auto"
        defaultValue={params.get("q") ?? ""}
        placeholder="ابحث عن منتج..."
        className="w-full border-0 bg-transparent px-5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none"
      />
      <button className="bg-amber-400 px-5 font-semibold text-teal-950 hover:bg-amber-300">
        ابحث
      </button>
    </form>
  );
}
