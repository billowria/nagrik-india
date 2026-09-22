import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  FileCheck2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTraffic } from "@/lib/traffic-store";
import { Avatar, Eyebrow, Page, SectionTitle, Stat } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { RequesterNav } from "@/features/shared/components/navigation";
import { TrackLink } from "@/features/shared/components/sos-dock";
import { cn } from "@/lib/utils";

export function TrustPanel() {
  const s = useTraffic();
  return (
    <div className="mt-5">
      <div className="trust-hero">
        <div className="min-w-0">
          <Eyebrow>Civic trust score</Eyebrow>
          <div className="mt-1 text-4xl font-extrabold">{s.trustScore}</div>
          <p className="text-xs font-bold text-primary">{s.trustTier}</p>
        </div>
        <span className="trust-badge-icon">
          <Award />
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 divide-x rounded-2xl bg-cream p-3 text-center">
        <Stat v={String(s.reportsFiled)} l="Reports" />
        <Stat v={String(s.supportsGiven)} l="Vouches" />
        <Stat v={String(s.safeWalksDone)} l="SafeWalks" />
      </div>
      <SectionTitle>Civic honours</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {s.badges.map((b) => (
          <div key={b.id} className={cn("badge-card", b.earned && "earned")}>
            <span className="badge-ic">{b.earned ? <BadgeCheck /> : <Award />}</span>
            <b className="mt-2 block text-[11px] leading-tight">{b.title}</b>
            <small className="mt-1 block leading-snug text-muted-foreground">{b.detail}</small>
            <small
              className={cn(
                "mt-1 block font-extrabold",
                b.earned ? "text-safe" : "text-muted-foreground",
              )}
            >
              {b.earned ? "Earned" : "Locked"}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmergencyCircle() {
  const s = useTraffic();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="mt-6">
      <SectionTitle>Trusted emergency circle</SectionTitle>
      <div className="grid gap-2">
        {s.emergencyContacts.map((c) => (
          <div key={c.id} className="contact-row">
            <span className="contact-icon">
              <UserRound />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-sm">{c.name}</b>
              <small className="block truncate text-muted-foreground">
                {c.relation} · {c.phone}
              </small>
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${c.name}`}
              onClick={() => s.removeEmergencyContact(c.id)}
            >
              <Trash2 className="text-danger" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-2 grid gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name and relationship"
          className="h-12 bg-card"
        />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="Phone number"
            className="h-12 bg-card"
          />
          <Button
            size="icon"
            aria-label="Add trusted contact"
            disabled={!name.trim() || !phone.trim()}
            className="h-12 w-12 rounded-xl"
            onClick={() => {
              const [n, ...r] = name.split(",");
              s.addEmergencyContact({
                name: (n ?? name).trim(),
                relation: r.join(",").trim() || "Trusted contact",
                phone: phone.trim(),
              });
              setName("");
              setPhone("");
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>
      <TrackLink />
    </div>
  );
}

export function RequesterProfilePage() {
  const s = useTraffic();
  const nav = useNavigate();

  return (
    <Page title="Your profile" eyebrow="Account" nav={<RequesterNav />}>
      <div className="flex items-center gap-4 rounded-3xl bg-orange-soft p-5">
        <Avatar />
        <div>
          <h2 className="text-xl font-extrabold">Aarav Mehta</h2>
          <p className="text-xs text-muted-foreground">Requester · Delhi</p>
        </div>
      </div>

      <TrustPanel />

      <div className="mt-5 grid gap-1">
        {["Emergency support", "Preferences", "Notification controls"].map((x) => (
          <button
            key={x}
            className="flex min-h-13 items-center gap-3 border-b py-3 text-left text-sm font-bold"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-soft text-primary">
              <FileCheck2 />
            </span>
            {x}
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <EmergencyCircle />

      <button
        onClick={s.toggleNotifications}
        className="mt-5 flex w-full items-center justify-between rounded-2xl bg-cream p-4 text-sm font-bold"
      >
        Notifications{" "}
        {s.notificationsEnabled ? <ToggleRight className="text-safe" /> : <ToggleLeft />}
      </button>

      <Button
        variant="outline"
        className="mt-5 h-12 w-full rounded-2xl"
        onClick={() => nav({ to: "/onboarding/role-select" })}
      >
        Switch role / Log out
      </Button>

      <DevConsole />
    </Page>
  );
}
