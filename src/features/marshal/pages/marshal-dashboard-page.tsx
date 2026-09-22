import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  LocateFixed,
  MoonStar,
  Radar,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { patrolShifts, stageCopy, useTraffic } from "@/lib/traffic-store";
import { Eyebrow, Stat } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { Header } from "@/features/shared/components/header";
import { MapView } from "@/features/shared/components/map-view";
import { MarshalNav } from "@/features/shared/components/navigation";
import { Incoming, Mission } from "../components/mission-workflow";
import { cn } from "@/lib/utils";

export function PatrolBoard() {
  const s = useTraffic();

  return (
    <div className="mt-5">
      <div className="radar-head">
        <span className="radar-icon">
          <MoonStar />
        </span>
        <div className="min-w-0">
          <b className="block text-sm">Scheduled patrols</b>
          <small className="text-muted-foreground">
            Joined patrols show your live presence on the citizen map
          </small>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        {patrolShifts.map((p) => {
          const joined = s.patrolsJoined.includes(p.id);
          return (
            <div key={p.id} className={cn("patrol-card", joined && "joined")}>
              <div className="min-w-0 flex-1">
                <b className="block truncate text-sm">{p.area}</b>
                <small className="block text-muted-foreground">
                  {p.time} · {p.marshals} marshals · {p.need} spots open
                </small>
              </div>
              <Button
                variant={joined ? "secondary" : "outline"}
                size="sm"
                className="shrink-0 rounded-xl"
                disabled={joined}
                onClick={() => s.joinPatrol(p.id)}
              >
                {joined ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Joined
                  </>
                ) : (
                  "Join"
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MarshalIdle() {
  const s = useTraffic();
  return (
    <div className="px-5 pb-5">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Marshal NG-DL-2841</Eyebrow>
          <h1 className="mt-1 text-xl font-extrabold">Ready to help nearby?</h1>
        </div>
        <button
          onClick={() => s.setOnline(!s.marshalOnline)}
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold",
            s.marshalOnline ? "bg-safe-soft text-safe" : "bg-muted text-muted-foreground",
          )}
        >
          {s.marshalOnline ? <ToggleRight /> : <ToggleLeft />}
          {s.marshalOnline ? "Online" : "Offline"}
        </button>
      </div>
      <div className="mt-5 grid grid-cols-3 divide-x rounded-2xl bg-cream p-3 text-center">
        <Stat v="₹1,280" l="Today" />
        <Stat v="7" l="Jobs" />
        <Stat v="4.9" l="Rating" />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <LocateFixed className="inline h-4 w-4 text-safe" /> Accuracy 8 m
        </span>
        <span>96% response rate</span>
      </div>
      <PatrolBoard />
    </div>
  );
}

export function CollapsedMarshalDock({
  active,
  onExpand,
}: {
  active: boolean;
  onExpand: () => void;
}) {
  const s = useTraffic();
  return (
    <Button
      variant="ghost"
      onClick={onExpand}
      aria-label="Show marshal dashboard"
      className="collapsed-map-dock"
    >
      <span className={cn("collapsed-map-icon", active && "active")}>
        {active ? <ShieldCheck /> : <Radar />}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <b className="block truncate">{active ? stageCopy[s.stage].title : "Marshal standby"}</b>
        <small className="block truncate">
          {active ? s.verificationState : "Online · Ready for local missions"}
        </small>
      </span>
      <ChevronDown className="rotate-180" />
    </Button>
  );
}

export function MarshalDashboardPage() {
  const s = useTraffic();
  const active = !["none", "finding", "incoming"].includes(s.stage);
  const shared = s.activeJob?.kind === "community";
  const [panelOpen, setPanelOpen] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [celebrateMsg, setCelebrateMsg] = useState("");
  const prevStageRef = useRef(s.stage);
  const lastPayoutRef = useRef(s.activeJob?.payout ?? 450);

  if (s.activeJob?.payout) {
    lastPayoutRef.current = s.activeJob.payout;
  }

  useEffect(() => {
    const prev = prevStageRef.current;
    prevStageRef.current = s.stage;

    if ((prev === "resolved" || prev === "evidence") && s.stage === "none") {
      setCelebrating(true);
      setCelebrateMsg(`₹${lastPayoutRef.current} credited to your civic wallet`);
      const timer = window.setTimeout(() => {
        setCelebrating(false);
      }, 3200);
      return () => window.clearTimeout(timer);
    }
  }, [s.stage]);

  return (
    <main className="app-shell">
      <div className="relative h-full overflow-hidden">
        <MapView radar route={active} />
        <Header
          mission={active}
          celebrating={celebrating}
          celebrateMessage={celebrateMsg}
        />
        {(s.stage === "finding" || s.stage === "incoming") && (
          <div className="incoming-banner absolute inset-x-5 top-40 z-10 rounded-2xl border border-primary/20 bg-card/95 p-3 shadow-warm">
            <div className="flex gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                {shared ? <Users /> : <Bell />}
              </span>
              <div className="min-w-0">
                <b className="text-sm">
                  {shared ? "Community mission ready" : "New assistance request"}
                </b>
                <p className="truncate text-xs text-muted-foreground">
                  {s.activeJob?.issue} ·{" "}
                  {shared
                    ? `${s.activeJob?.peopleHelped ?? 1} people affected`
                    : s.activeJob?.requester}{" "}
                  · Hauz Khas
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                  <ShieldCheck className="h-3 w-3" />
                  {s.verificationState}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className={cn("marshal-bottom-stack", active && "mission-mode")}>
          <section
            className={cn(
              "bottom-sheet marshal-sheet",
              active && "active",
              !panelOpen && "marshal-sheet-collapsed",
            )}
          >
            <Button
              variant="ghost"
              aria-label={panelOpen ? "Collapse marshal panel" : "Expand marshal panel"}
              aria-expanded={panelOpen}
              onClick={() => setPanelOpen((v) => !v)}
              className="sheet-grabber"
            >
              <span className="sheet-handle" />
            </Button>
            {panelOpen ? (
              s.stage === "none" ? (
                <MarshalIdle />
              ) : ["finding", "incoming"].includes(s.stage) ? (
                <Incoming />
              ) : (
                <Mission />
              )
            ) : (
              <CollapsedMarshalDock active={active} onExpand={() => setPanelOpen(true)} />
            )}
          </section>
          {!active && <MarshalNav integrated />}
        </div>
      </div>
      <DevConsole />
    </main>
  );
}
