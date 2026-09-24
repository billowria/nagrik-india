import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  Flame,
  Phone,
  QrCode,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trophy,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTraffic } from "@/lib/traffic-store";
import { Avatar, Eyebrow, Page, Stat } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { MarshalNav } from "@/features/shared/components/navigation";
import { cn } from "@/lib/utils";

export function MarshalLevelPanel() {
  const s = useTraffic();
  const prev = [0, 1600, 3200][s.marshalLevel] ?? 0;
  const pct = Math.min(100, Math.round(((s.marshalXp - prev) / (s.marshalNextXp - prev)) * 100));

  return (
    <div className="mt-5">
      <div className="trust-hero">
        <div className="min-w-0">
          <Eyebrow>{`Marshal level ${s.marshalLevel + 1}`}</Eyebrow>
          <div className="mt-1 text-2xl font-extrabold">{s.marshalLevelTitle}</div>
          <p className="text-xs font-bold text-primary">
            {s.marshalXp.toLocaleString("en-IN")} XP ·{" "}
            {(s.marshalNextXp - s.marshalXp).toLocaleString("en-IN")} to next level
          </p>
        </div>
        <span className="trust-badge-icon">
          <Flame />
        </span>
      </div>
      <div className="xp-track mt-3">
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="badge-card earned">
          <span className="badge-ic">
            <Flame />
          </span>
          <b className="mt-2 block text-[11px] leading-tight">{s.marshalStreak}-day streak</b>
          <small className="mt-1 block leading-snug text-muted-foreground">
            Responded every day this fortnight
          </small>
        </div>
        <div className={cn("badge-card", s.topResponder && "earned")}>
          <span className="badge-ic">
            <Trophy />
          </span>
          <b className="mt-2 block text-[11px] leading-tight">Top responder</b>
          <small className="mt-1 block leading-snug text-muted-foreground">
            Fastest marshal in your ward
          </small>
          <small
            className={cn(
              "mt-1 block font-extrabold",
              s.topResponder ? "text-primary" : "text-muted-foreground",
            )}
          >
            {s.topResponder ? "Earned" : "Locked"}
          </small>
        </div>
      </div>
    </div>
  );
}

export function MarshalCredential() {
  return (
    <div className="credential mt-5">
      <div className="min-w-0">
        <Eyebrow>Verified marshal credential</Eyebrow>
        <b className="mt-1 block text-sm">Riya Sharma · NG-DL-2841</b>
        <small className="block text-muted-foreground">
          Background verified · First aid & CPR certified
        </small>
        <div className="mt-2 flex flex-wrap gap-1">
          {["Civic honours ×4", "Safety trained", "96% response"].map((x) => (
            <span
              key={x}
              className="rounded-full bg-accent px-2 py-1 text-[9px] font-extrabold text-primary"
            >
              {x}
            </span>
          ))}
        </div>
      </div>
      <span className="credential-qr">
        <QrCode />
      </span>
    </div>
  );
}

export function MarshalProfilePage() {
  const s = useTraffic();
  const nav = useNavigate();
  const [support, setSupport] = useState(false);

  return (
    <Page title="Marshal profile" eyebrow="Verified partner" nav={<MarshalNav />}>
      <div className="flex items-center gap-4 rounded-3xl bg-orange-soft p-5">
        <Avatar />
        <div>
          <h2 className="text-xl font-extrabold">Riya Sharma</h2>
          <p className="text-xs text-muted-foreground">Marshal NG-DL-2841</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-primary">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </span>
        </div>
      </div>

      <MarshalLevelPanel />
      <MarshalCredential />

      <div className="my-5 grid grid-cols-4 divide-x text-center">
        <Stat v="4.9" l="Rating" />
        <Stat v="284" l="Jobs" />
        <Stat v="₹42k" l="Earned" />
        <Stat v="96%" l="Response" />
      </div>

      <div className="mt-5 grid gap-1">
        {[
          "Documents & KYC",
          "Safety Training",
          "Payment Details",
          "Job History",
          "Help & Support",
        ].map((x) => (
          <button
            key={x}
            onClick={() => x === "Help & Support" && setSupport(true)}
            className="flex min-h-13 items-center gap-3 border-b py-3 text-left text-sm font-bold"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-soft text-primary">
              {x.includes("Training") ? (
                <ShieldCheck />
              ) : x.includes("Payment") ? (
                <Wallet />
              ) : (
                <FileCheck2 />
              )}
            </span>
            {x}
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <button
        onClick={() => s.setOnline(!s.marshalOnline)}
        className="mt-4 flex w-full items-center justify-between rounded-2xl bg-cream p-4 text-sm font-bold"
      >
        Availability {s.marshalOnline ? <ToggleRight className="text-primary" /> : <ToggleLeft />}
      </button>

      <Button
        variant="outline"
        className="mt-5 h-12 w-full rounded-2xl"
        onClick={() => nav({ to: "/onboarding/role-select" })}
      >
        Switch role / Log out
      </Button>

      <Drawer open={support} onOpenChange={setSupport}>
        <DrawerContent className="mx-auto max-w-md rounded-t-3xl">
          <DrawerHeader>
            <DrawerTitle>Marshal support</DrawerTitle>
            <DrawerDescription>Choose a topic or contact the safety desk.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-2 px-5 pb-8">
            {["Unsafe civic situation", "Requester or payment issue", "KYC and training help"].map(
              (x) => (
                <button key={x} className="rounded-xl border p-3 text-left text-sm font-bold">
                  {x}
                </button>
              ),
            )}
            <Button className="mt-2">
              <Phone />
              Call safety desk
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <DevConsole />
    </Page>
  );
}
