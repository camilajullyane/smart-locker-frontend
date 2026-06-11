export function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 border-b border-neutral-800 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={
          mono
            ? "text-muted-foreground font-mono text-xs"
            : "text-muted-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
