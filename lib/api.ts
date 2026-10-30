import { API_BASE, CARD_FIELDS, PAGE_SIZE } from "./config";
import type {
  AdminOrder,
  Category,
  FieldError,
  LoginResponse,
  Order,
  OrderResponse,
  OrderStatus,
  OrdersPage,
  Product,
  ProductInput,
  ProductsPage,
  Stats,
  User,
} from "./types";

// خطأ يحمل رمز الحالة، لنعرف هل المشكلة 404 أو 401 أو غيرها، ومعه أخطاء الحقول إن وُجدت
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: FieldError[] = [],
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  const data = await res.json().catch(() => null);
  // fetch لا يعتبر 404 أو 500 خطأً، فنتحقق بأنفسنا
  if (!res.ok) throw new ApiError(res.status, data?.message ?? `HTTP ${res.status}`, data?.errors ?? []);
  return data as T;
}

// ---------- قراءة الكتالوج (GET): تُحفظ ساعة ثم تتجدد ----------
// الوسم catalog يسمح لصاحب المتجر بتحديثها فوراً بعد أي تعديل (app/api/revalidate)
const catalog = { next: { revalidate: 3600, tags: ["catalog"] } };

function pageQuery(page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  return `limit=${PAGE_SIZE}&skip=${skip}&select=${CARD_FIELDS}`;
}

export function getProducts(page: number) {
  return request<ProductsPage>(`/products?${pageQuery(page)}`, catalog);
}

export function getCategories() {
  return request<Category[]>("/products/categories", catalog);
}

export function getCategoryProducts(slug: string, page: number) {
  return request<ProductsPage>(
    `/products/category/${encodeURIComponent(slug)}?${pageQuery(page)}`,
    catalog,
  );
}

export function searchProducts(query: string, page: number) {
  return request<ProductsPage>(
    `/products/search?q=${encodeURIComponent(query)}&${pageQuery(page)}`,
    catalog,
  );
}

// null إن لم يوجد المنتج، لتعرض الصفحة 404
export async function getProduct(id: string) {
  try {
    return await request<Product>(`/products/${encodeURIComponent(id)}`, catalog);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// ---------- الحساب والطلبات ولوحة صاحب المتجر (من المتصفح، بلا تخزين) ----------
function send<T>(path: string, method: string, body?: unknown, token?: string) {
  return request<T>(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
}

export function login(username: string, password: string) {
  return send<LoginResponse>("/auth/login", "POST", { username, password, expiresInMins: 60 });
}

export function register(data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) {
  return send<LoginResponse>("/auth/register", "POST", data);
}

export function getMe(token: string) {
  return send<User>("/auth/me", "GET", undefined, token);
}

export function placeOrder(
  token: string,
  userId: number,
  items: { id: number; quantity: number }[],
) {
  return send<OrderResponse>("/carts/add", "POST", { userId, products: items }, token);
}

export function getMyOrders(token: string) {
  return send<OrdersPage>("/orders/me?limit=0", "GET", undefined, token);
}

// ---------- لوحة صاحب المتجر ----------
export const admin = {
  stats: (token: string) => send<Stats>("/admin/stats", "GET", undefined, token),
  // قائمة المنتجات بلا ذاكرة مؤقتة، حتى يرى صاحب المتجر آخر تعديلاته
  products: (page: number, q: string) => {
    const query = `limit=20&skip=${(page - 1) * 20}&select=title,price,stock,thumbnail,category`;
    const path = q ? `/products/search?q=${encodeURIComponent(q)}&${query}` : `/products?${query}`;
    return send<ProductsPage>(path, "GET");
  },
  product: (id: number) => send<Product>(`/products/${id}`, "GET"),
  categories: () => send<Category[]>("/products/categories", "GET"),
  createCategory: (token: string, name: string) =>
    send<Category>("/admin/categories", "POST", { name }, token),
  createProduct: (token: string, data: ProductInput) =>
    send<Product>("/admin/products", "POST", data, token),
  updateProduct: (token: string, id: number, data: Partial<ProductInput>) =>
    send<Product>(`/admin/products/${id}`, "PATCH", data, token),
  deleteProduct: (token: string, id: number) =>
    send<Product>(`/admin/products/${id}`, "DELETE", undefined, token),
  orders: (token: string, status: OrderStatus | "") =>
    send<{ orders: AdminOrder[]; total: number }>(
      `/admin/orders?limit=0${status ? `&status=${status}` : ""}`,
      "GET",
      undefined,
      token,
    ),
  setOrderStatus: (token: string, id: number, status: OrderStatus) =>
    send<Order>(`/admin/orders/${id}`, "PATCH", { status }, token),
};

// يطلب من خادم Next.js نفسه تحديث صفحات الكتالوج المحفوظة، بعد تعديل يغيّر ما يراه الزبائن
export async function refreshCatalog(token: string) {
  await fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
}
