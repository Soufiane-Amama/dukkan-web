import Link from "next/link";
import { Suspense } from "react";
import CartLink from "./CartLink";
import SearchForm from "./SearchForm";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="bg-teal-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
            <path d="M4 12 7 5h18l3 7Z" fill="#fbbf24" />
            <path
              d="M4 12h6v1.5a3 3 0 0 1-6 0Zm6 0h6v1.5a3 3 0 0 1-6 0Zm6 0h6v1.5a3 3 0 0 1-6 0Zm6 0h6v1.5a3 3 0 0 1-6 0Z"
              fill="#f59e0b"
            />
            <path d="M6 17h20v10H6Z" fill="#ccfbf1" />
            <path d="M13 20h6v7h-6Z" fill="#134e4a" />
          </svg>
          دُكّان
        </Link>
        {/* SearchForm يقرأ ?q= من الرابط، و Next.js يطلب لفّه بـ Suspense */}
        <Suspense>
          <SearchForm />
        </Suspense>
        <nav className="ms-auto flex items-center gap-2">
          <UserMenu />
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
