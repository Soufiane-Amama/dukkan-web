import { Suspense } from "react";
import AdminProducts from "@/components/admin/AdminProducts";

export default function AdminProductsPage() {
  // AdminProducts يقرأ ?saved= من الرابط، و Next.js يطلب لفّه بـ Suspense
  return (
    <Suspense>
      <AdminProducts />
    </Suspense>
  );
}
