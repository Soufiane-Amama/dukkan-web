"use client";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";

// الـ Context يعمل في Client Components فقط، فنجمع المزوّدين هنا ونلفّ بهم الموقع في layout.tsx
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
