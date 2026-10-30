export default function Rating({ value }: { value: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-sm text-stone-600"
      title={`التقييم ${value} من 5`}
    >
      <span className="text-amber-500" aria-hidden="true">
        ★
      </span>
      <bdi>{value.toFixed(1)}</bdi>
    </span>
  );
}
