// شكل البيانات كما يرسلها خادم «دُكّان» (نفس شكل DummyJSON، مع إضافات الحسابات والطلبات)
export type ProductCard = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail: string;
  brand?: string; // بعض المنتجات بلا علامة تجارية
  category: string;
};

export type Review = {
  rating: number;
  comment: string;
  reviewerName: string;
};

export type Product = ProductCard & {
  description: string;
  stock: number;
  images: string[];
  warrantyInformation: string;
  shippingInformation: string;
  reviews: Review[];
};

export type ProductsPage = {
  products: ProductCard[];
  total: number;
  skip: number;
  limit: number;
};

export type Category = {
  slug: string;
  name: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  role: "customer" | "admin";
};

export type LoginResponse = User & {
  accessToken: string;
  refreshToken?: string;
};

export type CartItem = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  quantity: number;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderLine = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  quantity: number;
  total: number;
  discountedTotal: number;
  thumbnail: string;
};

export type Order = {
  id: number;
  userId: number;
  products: OrderLine[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  status: OrderStatus;
  createdAt: string;
};

// ما ترجعه /carts/add عند إتمام الطلب
export type OrderResponse = Order;

export type OrdersPage = { orders: Order[]; total: number; skip: number; limit: number };

export type AdminOrder = Order & { customer: { name: string; email: string } | null };

export type Stats = {
  products: number;
  customers: number;
  orders: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenue: number;
  lowStock: { id: number; title: string; stock: number }[];
};

// حقول نموذج المنتج في لوحة صاحب المتجر
export type ProductInput = {
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
};

// أخطاء التحقق من الخادم: حقل لكل رسالة
export type FieldError = { field: string; message: string };
