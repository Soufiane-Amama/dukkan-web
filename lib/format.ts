const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatPrice = (value: number) => usd.format(value);

// السعر بعد الخصم، كما يحسبه DummyJSON في السلة
export const finalPrice = (price: number, discountPercentage: number) =>
  Math.round(price * (1 - discountPercentage / 100) * 100) / 100;

const productsCount = new Intl.PluralRules("ar");
const WORDS: Record<string, string> = {
  zero: "لا منتجات",
  one: "منتج واحد",
  two: "منتجان",
  few: "منتجات",
  many: "منتجاً",
  other: "منتج",
};

// «لا منتجات»، «منتج واحد»، «منتجان»، «3 منتجات»، «95 منتجاً»
export function countProducts(n: number) {
  const rule = productsCount.select(n);
  return ["zero", "one", "two"].includes(rule) ? WORDS[rule] : `${n} ${WORDS[rule]}`;
}

// تاريخ الطلب بأرقام لاتينية مثل الأسعار: «29 أكتوبر 2026»
const date = new Intl.DateTimeFormat("ar-u-nu-latn", { day: "numeric", month: "long", year: "numeric" });
export const formatDate = (iso: string) => date.format(new Date(iso));
