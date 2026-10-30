import { Suspense } from "react";
import AdminOrders from "@/components/admin/AdminOrders";

export default function AdminOrdersPage() {
  // AdminOrders يقرأ ?status= من الرابط، و Next.js يطلب لفّه بـ Suspense
  return (
    <Suspense>
      <AdminOrders />
    </Suspense>
  );
}
