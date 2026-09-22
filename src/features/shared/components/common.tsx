import { type ReactNode } from "react";
import { Check, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTraffic } from "@/lib/traffic-store";
import nagrikLogoGreen from "@/assets/nagrik-logo-green.png";
import requesterAvatar from "@/assets/requester-avatar.png";
import marshalAvatar from "@/assets/marshal-avatar.png";

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <img
      src={nagrikLogoGreen}
      alt="Nagrik"
      className={cn("object-contain", small ? "h-11 w-[92px]" : "h-28 w-44")}
    />
  );
}

export function Avatar() {
  const marshal = useTraffic().persona === "marshal";
  return (
    <div className="avatar-mini">
      <img
        src={marshal ? marshalAvatar : requesterAvatar}
        alt={marshal ? "Riya Sharma" : "Aarav Mehta"}
        loading="lazy"
        width={768}
        height={768}
      />
      <span />
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-extrabold uppercase text-primary">{children}</p>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 mt-7 text-base font-extrabold">{children}</h2>;
}

export function Page({
  title,
  eyebrow,
  children,
  nav,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  nav?: ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-background">
      <div
        className={cn(
          "mx-auto max-w-[560px] px-4 pt-[max(24px,env(safe-area-inset-top))] sm:px-6 sm:pt-[max(32px,env(safe-area-inset-top))]",
          nav ? "pb-32" : "pb-8",
        )}
      >
        <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight">{title}</h1>
          </div>
          <div className="mt-1 shrink-0">
            <Logo small />
          </div>
        </div>
        {children}
      </div>
      {nav}
    </main>
  );
}

export function Segment({
  value,
  setValue,
  items,
}: {
  value: string;
  setValue: (v: string) => void;
  items: string[];
}) {
  return (
    <div
      className="grid rounded-2xl bg-muted p-1"
      style={{ gridTemplateColumns: `repeat(${items.length},1fr)` }}
    >
      {items.map((x) => (
        <button
          key={x}
          onClick={() => setValue(x)}
          className={cn(
            "min-h-11 rounded-xl px-3 text-xs font-bold capitalize",
            value === x && "bg-card text-primary shadow-xs",
          )}
        >
          {x}
        </button>
      ))}
    </div>
  );
}

export function Timeline({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="my-7">
      {labels.map((x, i) => (
        <div key={x} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full",
                i <= current
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {i < current ? <Check /> : i + 1}
            </span>
            {i < labels.length - 1 && <span className="h-8 w-0.5 bg-border" />}
          </div>
          <div>
            <b className="text-sm">{x}</b>
            <p className="text-xs text-muted-foreground">
              {i < current ? "Complete" : i === current ? "In progress" : "Upcoming"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Empty({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof History;
  title: string;
  text: string;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-dashed bg-cream p-8 text-center">
      <Icon className="mx-auto h-9 w-9 text-primary" />
      <b className="mt-3 block">{title}</b>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}

export function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <b className="block text-sm">{v}</b>
      <span className="text-[10px] text-muted-foreground">{l}</span>
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-3 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-right text-xs", strong && "font-extrabold text-primary")}>
        {value}
      </span>
    </div>
  );
}
