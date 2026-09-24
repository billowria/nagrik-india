import { ArrowLeft, Check, Footprints, PartyPopper, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { stageCopy, useTraffic } from "@/lib/traffic-store";
import { cn } from "@/lib/utils";
import { Avatar, Eyebrow, Logo } from "./common";
import { NotificationBell } from "./notification-bell";
import { SosDock } from "./sos-dock";
import { Button } from "@/components/ui/button";
import { InfoButton } from "@/components/info-sheet";
import { AnimatedShield } from "@/components/animated-icons";

export function ProgressRail({
  labels,
  current,
  allDone = false,
}: {
  labels: string[];
  current: number;
  allDone?: boolean;
}) {
  return (
    <div className="progress-rail mt-2.5" aria-label="Progress">
      <div
        className="rail-track"
        style={{ gridTemplateColumns: `repeat(${labels.length},minmax(0,1fr))` }}
      >
        {labels.map((x, i) => {
          const isDone = allDone || i < current;
          const isActive = !allDone && i === current;
          const isTodo = !allDone && i > current;

          return (
            <div key={x} className="rail-step">
              <div
                className={cn(
                  "rail-line",
                  isDone && "done",
                  isActive && "active",
                )}
              />
              <span
                className={cn(
                  "rail-dot",
                  isDone && "done",
                  isActive && "active",
                  isTodo && "todo",
                )}
              >
                {isDone ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "rail-label",
                  isDone && "done",
                  isActive && "active",
                  isTodo && "todo",
                )}
              >
                {x}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface HeaderProps {
  mission?: boolean;
  showSos?: boolean;
  flow?: boolean;
  flowTitle?: string;
  flowLabels?: string[];
  flowCurrentStep?: number;
  onFlowBack?: () => void;
  celebrating?: boolean;
  celebrateMessage?: string;
  safeWalkLive?: boolean;
  safeWalkDestination?: string;
  safeWalkEta?: number;
  safeWalkProgress?: number;
}

export function Header({
  mission = false,
  showSos = false,
  flow = false,
  flowTitle,
  flowLabels,
  flowCurrentStep = 0,
  onFlowBack,
  celebrating = false,
  celebrateMessage,
  safeWalkLive = false,
  safeWalkDestination,
  safeWalkEta,
  safeWalkProgress,
}: HeaderProps) {
  const s = useTraffic();
  const missionStep =
    s.stage === "accepted"
      ? 0
      : s.stage === "enroute"
        ? 1
        : s.stage === "onsite"
          ? 2
          : ["resolving", "resolved"].includes(s.stage)
            ? 3
            : 4;
  const safe = s.activeJob?.kind === "safewalk";
  const shared = s.activeJob?.kind === "community";

  return (
    <motion.header
      layout
      transition={{
        layout: { type: "spring", stiffness: 350, damping: 30 },
      }}
      className={cn(
        "glass-header absolute inset-x-4 top-[max(14px,env(safe-area-inset-top))] z-20 overflow-hidden",
        mission && "mission-header",
        flow && "flow-active-header",
        celebrating && "border-primary/40 bg-accent/90",
        safeWalkLive && "border-safe/40 bg-card/96 shadow-warm",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {celebrating ? (
          <motion.div
            key="celebrating"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="p-3"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-soft">
                <Check className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <PartyPopper className="h-3.5 w-3.5" />
                  <span>Mission Completed!</span>
                </div>
                <p className="truncate text-xs font-semibold text-foreground">
                  {celebrateMessage ||
                    `₹${s.activeJob?.payout ?? 180} credited to your civic wallet`}
                </p>
              </div>
            </div>
            <ProgressRail
              labels={
                safe
                  ? ["Join", "Monitor", "Check-in", "Support", "Finish"]
                  : ["Accept", "Navigate", "On site", "Resolve", "Complete"]
              }
              current={5}
              allDone
            />
          </motion.div>
        ) : safeWalkLive ? (
          <motion.div
            key="safewalk-live"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-safe text-white shadow-soft">
                  <AnimatedShield size={18} active />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-safe">
                    <span className="inline-block h-2 w-2 rounded-full bg-safe animate-pulse" />
                    SafeWalk Live
                    <InfoButton topic="safewalk-protocol" size="sm" title="SafeWalk Protocol" />
                  </div>
                  <b className="block truncate text-xs font-extrabold text-foreground">
                    {safeWalkDestination ?? s.safeWalk?.destination ?? "Destination"}
                  </b>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">ETA</span>
                  <b className="block text-xs font-black text-primary">
                    {safeWalkEta !== undefined ? `${safeWalkEta} min` : `${s.safeWalk?.duration ?? 12} min`}
                  </b>
                </div>
                <SosDock compact className="sos-fab--header" />
              </div>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-safe to-primary"
                initial={{ width: "10%" }}
                animate={{ width: `${Math.min(100, Math.max(8, safeWalkProgress ?? 20))}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ) : flow ? (
          <motion.div
            key="flow"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="p-3"
          >
            <div className="flex items-center gap-2">
              {onFlowBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={
                    flowCurrentStep === 0
                      ? "Cancel and return to home"
                      : "Go to previous step"
                  }
                  onClick={onFlowBack}
                  className="h-8 w-8 shrink-0 rounded-full hover:bg-black/5"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-foreground">
                  {flowTitle ?? "Reporting issue"}
                </p>
                <p className="truncate text-[10px] font-medium text-muted-foreground">
                  Step {flowCurrentStep + 1} of {flowLabels?.length ?? 4}
                </p>
              </div>
            </div>
            {flowLabels && (
              <ProgressRail
                labels={flowLabels}
                current={flowCurrentStep}
              />
            )}
          </motion.div>
        ) : mission ? (
          <motion.div
            key="mission"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="p-3"
          >
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="min-w-0">
                <Eyebrow>
                  {safe
                    ? "Active companion"
                    : shared
                      ? "Community civic mission"
                      : "Active personal mission"}
                </Eyebrow>
                <b className="block truncate text-sm">
                  {safe ? "SafeWalk monitoring" : stageCopy[s.stage]?.title ?? "Mission Active"}
                </b>
                <p className="truncate text-xs text-muted-foreground">
                  {s.activeJob?.issue} ·{" "}
                  {shared
                    ? `${s.activeJob?.peopleHelped ?? 1} people helped`
                    : s.activeJob?.requester}
                </p>
              </div>
              <div className="text-right">
                <b className="text-sm text-primary">₹{s.activeJob?.payout}</b>
                <p className="text-[10px] text-muted-foreground">
                  {safe
                    ? `${s.safeWalk?.duration} min plan`
                    : shared
                      ? "shared outcome"
                      : `${s.etaMinutes} min`}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                <ShieldCheck className="h-3 w-3" />
                {s.verificationState}
              </div>
              <InfoButton topic="marshal-verification" size="sm" title="Marshal Verification Standards" />
            </div>
            <ProgressRail
              labels={
                safe
                  ? ["Join", "Monitor", "Check-in", "Support", "Finish"]
                  : ["Accept", "Navigate", "On site", "Resolve", "Complete"]
              }
              current={missionStep}
            />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 p-2.5"
          >
            <Avatar />
            <div className="min-w-0 text-center">
              <div className="mx-auto w-fit">
                <Logo small />
              </div>
              <p className="truncate text-[10px] text-navy">
                Good morning, {s.persona === "marshal" ? "Riya" : "Aarav"}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <InfoButton topic="civic-score" size="sm" title="Civic Trust & Karma Guide" />
              {showSos && (
                <>
                  <NotificationBell />
                  <SosDock compact className="sos-fab--header" />
                </>
              )}
              {!showSos && <NotificationBell />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
