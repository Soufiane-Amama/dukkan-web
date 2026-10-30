// صور DummyJSON يحسّنها Next.js (النطاق مسموح في next.config.mjs).
// صور أي نطاق آخر يضيفه صاحب المتجر تُعرض كما هي: لا نفتح محسّن الصور لكل نطاقات الإنترنت.
export const optimizable = (src: string) => src.startsWith("https://cdn.dummyjson.com/");
