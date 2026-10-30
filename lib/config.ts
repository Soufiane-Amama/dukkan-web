// رابط خادم «دُكّان»: من متغير البيئة إن وُجد (في .env.local)، وإلا الخادم المحلي
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

// عدد المنتجات في الصفحة الواحدة
export const PAGE_SIZE = 12;

// الحقول التي تحتاجها بطاقة المنتج فقط، حتى يصل رد أصغر
export const CARD_FIELDS = "title,price,discountPercentage,rating,thumbnail,brand,category";
