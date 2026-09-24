import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Footprints,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { stageCopy, useTraffic, type RequestMode } from "@/lib/traffic-store";
import { Eyebrow } from "@/features/shared/components/common";
import { timeAgo } from "@/features/shared/components/notification-bell";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { InfoButton, InfoSheet } from "@/components/info-sheet";
import { AnimatedShield } from "@/components/animated-icons";
import { cn } from "@/lib/utils";

export function LiveWardFeed() {
  const s = useTraffic();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const items = [
    ...s.communityReports
      .filter((r) => r.status !== "resolved")
      .slice(0, 3)
      .map((r) => ({
        id: `f-${r.id}`,
        icon: <Megaphone />,
        title: r.issue,
        meta: `${r.supporters} affected · ${hydrated ? timeAgo(r.createdAt) : "Recently"}`,
        reportId: r.id,
      })),
    ...s.communityReports
      .filter((r) => r.status === "resolved")
      .slice(0, 1)
      .map((r) => ({
        id: `fr-${r.id}`,
        icon: <BadgeCheck />,
        title: `${r.issue} resolved`,
        meta: `Verified · ${r.location}`,
        reportId: r.id,
      })),
    {
      id: "f-marshals",
      icon: <ShieldCheck />,
      title: "8 marshals on duty",
      meta: "Avg response 2.4 min",
      reportId: undefined,
    },
  ];

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <span className="feed-live">
          <i />
          Live in your ward
        </span>
        <small className="text-[10px] font-bold text-muted-foreground">
          {s.communityReports.length} reports on map
        </small>
      </div>
      <div className="ward-feed mt-2">
        {items.map((x) => (
          <button
            key={x.id}
            className="feed-chip"
            onClick={() => {
              triggerHaptic("light");
              if (x.reportId) s.selectHazard(x.reportId);
            }}
          >
            <span>{x.icon}</span>
            <span className="min-w-0 text-left">
              <b className="block truncate">{x.title}</b>
              <em className="block truncate">{x.meta}</em>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function NagrikLiveBadge() {
  const [openInfo, setOpenInfo] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => {
          triggerHaptic("selection");
          setOpenInfo(true);
        }}
        className="group relative flex items-center gap-2 rounded-full border border-primary/25 bg-card/95 py-1.5 pl-2 pr-3 shadow-xs backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-soft active:scale-[0.97]"
        title="Nagrik Marshal Fleet · Tap for details"
      >
        {/* Animated Nagrik Shield Core with radar aura */}
        <span className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <motion.span
            className="absolute -inset-1 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <ShieldCheck className="relative z-10 h-3.5 w-3.5 stroke-[2.4]" />
        </span>

        {/* Live Telemetry Info */}
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <b className="text-[11px] font-black tracking-tight text-foreground whitespace-nowrap">
              8 Nagrik Marshals
            </b>
          </div>
          <span className="mt-0.5 block text-[9.5px] font-bold text-primary whitespace-nowrap">
            Ward 42 Patrol · ~2.4m
          </span>
        </div>
      </motion.button>

      <InfoSheet
        topic="marshal-verification"
        open={openInfo}
        onClose={() => setOpenInfo(false)}
      />
    </>
  );
}

export function IdleRequest({
  onChoose,
  onSafeWalk,
}: {
  onChoose: (mode: RequestMode) => void;
  onSafeWalk: () => void;
}) {
  return (
    <div className="civic-dock px-4 pb-4">
      <div className="civic-dock-head">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Eyebrow>Civic action centre</Eyebrow>
            <InfoButton topic="reporting-bounties" size="sm" title="Civic Reporting Guide" />
          </div>
          <h1 className="mt-1 truncate text-lg font-extrabold">How can Nagrik help?</h1>
        </div>
        <NagrikLiveBadge />
      </div>
      <Button
        className="civic-action civic-action-community"
        onClick={() => {
          triggerHaptic("medium");
          onChoose("community");
        }}
      >
        <span className="civic-action-icon">
          <Megaphone />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <b>Report a community issue</b>
          <small>Put evidence on the shared civic map</small>
        </span>
        <ArrowRight className="civic-action-arrow" />
      </Button>
      <div className="civic-action-row">
        <Button
          variant="outline"
          className="civic-action civic-action-personal"
          onClick={() => {
            triggerHaptic("medium");
            onChoose("personal");
          }}
        >
          <span className="civic-action-icon">
            <LifeBuoy />
          </span>
          <span>
            <b>Personal help</b>
            <small>Request a marshal now</small>
          </span>
          <ArrowRight className="civic-action-arrow" />
        </Button>
        <Button
          variant="outline"
          className="civic-action civic-action-walk"
          onClick={() => {
            triggerHaptic("medium");
            onSafeWalk();
          }}
        >
          <span className="civic-action-icon">
            <AnimatedShield size={20} active />
          </span>
          <span>
            <b>SafeWalk</b>
            <small>Share your walk</small>
          </span>
          <ArrowRight className="civic-action-arrow" />
        </Button>
      </div>
      <LiveWardFeed />
    </div>
  );
}

export function CollapsedMapDock({
  active,
  onExpand,
  flowStep,
  flowTotal,
  safeWalkSetup,
}: {
  active: boolean;
  onExpand: () => void;
  flowStep?: number;
  flowTotal?: number;
  safeWalkSetup?: boolean;
}) {
  const s = useTraffic();

  let title: string;
  let subtitle: string;
  let iconActive = active;

  if (flowStep && flowTotal) {
    title = "Report in progress";
    subtitle = `Step ${flowStep} of ${flowTotal}`;
    iconActive = false;
  } else if (safeWalkSetup) {
    title = "SafeWalk setup";
    subtitle = "Configuring your protected walk";
    iconActive = false;
  } else if (active && s.activeJob?.kind === "safewalk") {
    title = "SafeWalk live";
    subtitle = `Walking to ${s.safeWalk?.destination ?? "destination"}`;
    iconActive = true;
  } else if (active) {
    title = stageCopy[s.stage].title;
    subtitle = s.verificationState;
  } else {
    title = "Civic actions";
    subtitle = "Report, request help, or start SafeWalk";
  }

  return (
    <Button
      variant="outline"
      onClick={onExpand}
      aria-label="Show civic actions"
      className="collapsed-map-dock"
    >
      <span className={cn("collapsed-map-icon", iconActive && "active")}>
        {iconActive ? <ShieldCheck /> : flowStep ? <Megaphone /> : safeWalkSetup ? <Footprints /> : <Megaphone />}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <b className="block truncate">{title}</b>
        <small className="block truncate">{subtitle}</small>
      </span>
      <ChevronDown className="rotate-180" />
    </Button>
  );
}
