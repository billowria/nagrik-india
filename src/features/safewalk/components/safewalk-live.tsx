import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  Check,
  CheckCircle2,
  Footprints,
  Lightbulb,
  PartyPopper,
  Pause,
  Phone,
  PhoneCall,
  PhoneOff,
  Play,
  Radio,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  UserRound,
  Users,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTraffic, zoneIcon } from "@/lib/traffic-store";
import { Eyebrow } from "@/features/shared/components/common";
import { SafeWalkChatDrawer } from "./safewalk-chat";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

function FeedItem({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="sw-feed-item">
      <Icon />
      <span>
        <b>{title}</b>
        <small>{text}</small>
      </span>
    </div>
  );
}

export function SafeWalkLive() {
  const s = useTraffic();
  const walk = s.safeWalk;
  const reduce = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [fakeCallConnected, setFakeCallConnected] = useState(false);
  const [sirenOn, setSirenOn] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!walk || walk.paused) return;
    const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, [walk]);

  if (!walk) return null;

  const elapsedMin = Math.floor(elapsed / 60);
  const progressPercent = Math.min(
    96,
    Math.max(10, Math.round((elapsedMin / Math.max(1, walk.duration)) * 100) + walk.checkIns * 6),
  );
  const next = walk.checkInPlan.find((c) => c.status === "scheduled");
  const nextIn = next ? Math.max(0, next.minute - elapsedMin) : 0;
  const phase =
    progressPercent > 78
      ? "Arrival approach · Destination in sight"
      : progressPercent > 45
        ? "Mid-corridor watch · Well-lit area"
        : progressPercent > 18
          ? "First stretch · Safe haven nearby"
          : "Route underway · Guardian active";

  const handleCheckIn = () => {
    s.safeWalkCheckIn();
    setJustCheckedIn(true);
    window.setTimeout(() => setJustCheckedIn(false), 2200);
  };

  const handleFinish = () => {
    setArrivalOpen(true);
  };

  const handleConfirmArrival = () => {
    setArrivalOpen(false);
    s.finishSafeWalk();
  };

  return (
    <div className="safewalk-live p-4 overflow-y-auto max-h-[72dvh] overscroll-contain pb-8">
      {/* ── 1. Top HUD Overview ── */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-safe-soft/30 to-card p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={reduce ? false : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative grid h-10 w-10 place-items-center rounded-2xl bg-safe text-white shadow-soft"
            >
              <Footprints className="h-5 w-5" />
              <span className="absolute -inset-1 animate-ping rounded-2xl bg-safe/25 duration-1000" />
            </motion.span>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-safe">
                <span className="h-2 w-2 rounded-full bg-safe animate-pulse" />
                Live Walk · {String(elapsedMin).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
              </div>
              <h3 className="truncate text-sm font-extrabold text-foreground">
                To {walk.destination}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="rounded-full bg-safe/15 px-2 py-0.5 text-[10px] font-black text-safe">
              {walk.safetyScore}% Safe
            </span>
            <small className="block text-[10px] text-muted-foreground mt-0.5">
              {walk.checkIns} check-ins
            </small>
          </div>
        </div>

        {/* Dynamic Route Progress Corridor */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-primary truncate">{phase}</span>
            <span className="text-muted-foreground shrink-0">{progressPercent}%</span>
          </div>
          <div className="relative mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-safe to-primary"
              style={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ── 2. Hero Interactive "I'm Safe" Check-In ── */}
      <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-primary/25 bg-card/95 p-5 text-center shadow-warm">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
          {justCheckedIn ? "Check-in logged!" : "Scheduled Safety Check-In"}
        </p>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={handleCheckIn}
          className={cn(
            "relative mt-3 grid h-24 w-24 place-items-center rounded-full transition-all duration-300 shadow-soft",
            justCheckedIn
              ? "bg-safe text-white shadow-safe/40 scale-105"
              : "bg-gradient-to-tr from-primary to-safe text-white hover:shadow-primary/40",
          )}
        >
          <span className="absolute -inset-2.5 animate-ping rounded-full bg-safe/20 duration-1000" />
          <span className="absolute -inset-1 rounded-full border-2 border-safe/40" />
          <div className="flex flex-col items-center">
            {justCheckedIn ? (
              <Check className="h-9 w-9 stroke-[3]" />
            ) : (
              <ShieldCheck className="h-9 w-9 stroke-[2.2]" />
            )}
            <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
              {justCheckedIn ? "Checked" : "I'm Safe"}
            </span>
          </div>
        </motion.button>

        <b className="mt-3 text-sm font-extrabold text-foreground">
          {justCheckedIn
            ? "Shared with your trusted circle"
            : next
              ? `Next auto-check in ~${nextIn} min`
              : "Arrival check-in ready"}
        </b>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tap anytime to confirm your status to {walk.contact}.
        </p>
      </div>

      {/* ── 3. Guardian Live Watch Status ── */}
      <div className="mt-3.5 space-y-2.5">
        {/* Trusted Circle Watcher */}
        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-safe" />
            </div>
            <div className="min-w-0">
              <b className="block truncate text-xs font-extrabold">{walk.contact}</b>
              <span className="block truncate text-[10px] text-muted-foreground">
                Trusted Circle · Watching live GPS corridor
              </span>
            </div>
          </div>
          <span className="rounded-lg bg-safe-soft px-2 py-1 text-[10px] font-black text-safe shrink-0">
            Live
          </span>
        </div>

        {/* Assigned Marshal Quick-Response Card */}
        {walk.marshalMonitoring && (
          walk.assignedMarshal ? (
            <div
              className={cn(
                "rounded-2xl border p-3.5 transition-all shadow-xs",
                walk.assignedMarshal.status === "intercepting"
                  ? "border-danger/60 bg-danger-soft/40 shadow-danger/10"
                  : "border-safe/40 bg-gradient-to-br from-card via-safe-soft/25 to-card",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-safe text-white shadow-soft">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="absolute -inset-1 animate-ping rounded-2xl bg-safe/25 duration-1000" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <b className="truncate text-xs font-black text-foreground">
                        {walk.assignedMarshal.name}
                      </b>
                      <span className="rounded bg-safe/15 px-1 py-0.2 text-[9px] font-black text-safe">
                        {walk.assignedMarshal.badge}
                      </span>
                    </div>
                    <p className="truncate text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Bike className="h-3 w-3 text-safe" />
                      {walk.assignedMarshal.vehicle} · {walk.assignedMarshal.rating}★
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider block",
                      walk.assignedMarshal.status === "intercepting"
                        ? "bg-danger text-white animate-pulse"
                        : "bg-safe/20 text-safe",
                    )}
                  >
                    {walk.assignedMarshal.status === "intercepting"
                      ? "Intercepting"
                      : "Standby Active"}
                  </span>
                  <small className="text-[10px] font-bold text-muted-foreground">
                    ETA {walk.assignedMarshal.responseEta}
                  </small>
                </div>
              </div>

              {/* Status Banner */}
              <div className="mt-2.5 rounded-xl bg-card/90 border border-border/60 p-2 text-[11px] font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-safe">
                  <Radio className="h-3.5 w-3.5 animate-pulse text-safe shrink-0" />
                  {walk.assignedMarshal.status === "intercepting"
                    ? "Marshal riding to your location now"
                    : "Patrol bike shadowing route · Quick response ready"}
                </span>
              </div>

              {/* Marshal Action Buttons */}
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setChatOpen(true)}
                  className="h-9 rounded-xl border-border/80 bg-card hover:bg-muted text-xs font-bold shadow-2xs"
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>Chat</span>
                  {s.messages.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 py-0.2 text-[9px] font-black text-white">
                      {s.messages.length}
                    </span>
                  )}
                </Button>

                {walk.assignedMarshal.status === "intercepting" ? (
                  <Button
                    size="sm"
                    className="h-9 rounded-xl bg-danger hover:bg-danger/90 text-white text-xs font-bold"
                    onClick={() => alert(`Calling ${walk.assignedMarshal?.name}: +91 98765 43210`)}
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    Call Marshal
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-soft"
                    onClick={s.triggerMarshalIntercept}
                  >
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                    Request Intercept
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-black text-primary">
                <Radio className="h-4 w-4 animate-spin text-primary shrink-0" />
                <span>Locating Ward 42 Marshall Standby...</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                A nearby verified patrol marshal is being paired to shadow your walk.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 h-8 rounded-xl text-xs font-bold text-primary border-primary/30"
                onClick={s.accept}
              >
                Connect Marshal Vikram Now
              </Button>
            </div>
          )
        )}
      </div>

      {/* ── 4. End SafeWalk Action Bar (Placed ABOVE Quick Guardian Tools) ── */}
      <div className="mt-3.5 grid grid-cols-[1fr_auto] gap-2 pt-1 border-t border-border/40">
        <Button
          id="safewalk-end-button"
          size="lg"
          className="h-13 rounded-2xl bg-safe text-white hover:bg-safe/90 font-extrabold shadow-warm text-sm"
          onClick={handleFinish}
        >
          <CheckCircle2 className="h-5 w-5 mr-1.5" />
          <span>End SafeWalk · Arrived Safely</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          aria-label="Escalate emergency"
          className="h-13 w-13 rounded-2xl border-danger/30 text-danger hover:bg-danger/10"
          onClick={s.escalate}
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>

      {/* ── 5. Quick Safety Tools Grid ── */}
      <div className="mt-3.5">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
          Quick Guardian Tools
        </p>
        <div className="grid grid-cols-3 gap-2">
          {/* Fake Call Button */}
          <button
            type="button"
            onClick={() => {
              setFakeCallConnected(false);
              setFakeCallOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border/80 bg-card p-3 text-center transition-all hover:bg-muted/40 active:scale-95 shadow-xs"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
              <PhoneCall className="h-4 w-4" />
            </span>
            <b className="text-[11px] font-bold">Fake Call</b>
            <small className="text-[9px] text-muted-foreground">Security ring</small>
          </button>

          {/* Siren Deterrent Button */}
          <button
            type="button"
            onClick={() => setSirenOn(!sirenOn)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 text-center transition-all active:scale-95 shadow-xs",
              sirenOn
                ? "border-danger bg-danger text-white animate-pulse"
                : "border-border/80 bg-card text-foreground hover:bg-muted/40",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-xl",
                sirenOn ? "bg-white/20 text-white" : "bg-danger/10 text-danger",
              )}
            >
              <Siren className="h-4 w-4" />
            </span>
            <b className="text-[11px] font-bold">{sirenOn ? "Siren ON" : "Siren"}</b>
            <small className={sirenOn ? "text-white/80" : "text-[9px] text-muted-foreground"}>
              Deterrent
            </small>
          </button>

          {/* Torch Beacon Button */}
          <button
            type="button"
            onClick={() => setTorchOn(!torchOn)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 text-center transition-all active:scale-95 shadow-xs",
              torchOn
                ? "border-amber-500 bg-amber-500 text-white shadow-soft"
                : "border-border/80 bg-card text-foreground hover:bg-muted/40",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-xl",
                torchOn ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-600",
              )}
            >
              <Lightbulb className="h-4 w-4" />
            </span>
            <b className="text-[11px] font-bold">{torchOn ? "Torch ON" : "Torch"}</b>
            <small className={torchOn ? "text-white/80" : "text-[9px] text-muted-foreground"}>
              High beam
            </small>
          </button>
        </div>
      </div>

      {/* ── FAKE CALL SIMULATOR MODAL ── */}
      <AnimatePresence>
        {fakeCallOpen && (
          <div className="fixed inset-0 z-[700] grid place-items-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-white text-center shadow-2xl"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-zinc-800 text-safe shadow-inner">
                <ShieldCheck className="h-10 w-10 animate-pulse" />
              </div>
              <h2 className="mt-4 text-xl font-black">Nagrik Security Desk</h2>
              <p className="text-xs text-zinc-400 mt-1">
                {fakeCallConnected ? "Call Connected · 00:14" : "Incoming Security Call…"}
              </p>

              {fakeCallConnected ? (
                <div className="mt-8 rounded-2xl bg-zinc-800/80 p-4 text-left">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <i>"Hello Aarav, this is Officer Sharma from Nagrik Central. We are tracking your walk along Aurobindo Marg. Please proceed straight, we are monitoring."</i>
                  </p>
                  <Button
                    size="lg"
                    className="mt-6 h-13 w-full rounded-2xl bg-danger hover:bg-danger/90 text-white font-bold"
                    onClick={() => setFakeCallOpen(false)}
                  >
                    <PhoneOff className="h-5 w-5 mr-2" />
                    End Call
                  </Button>
                </div>
              ) : (
                <div className="mt-10 flex items-center justify-around">
                  <button
                    type="button"
                    onClick={() => setFakeCallOpen(false)}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-danger text-white shadow-lg">
                      <PhoneOff className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFakeCallConnected(true)}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-safe text-white shadow-lg animate-bounce">
                      <PhoneCall className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-semibold text-safe">Accept</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ARRIVAL CELEBRATION MODAL ── */}
      <AnimatePresence>
        {arrivalOpen && (
          <div className="fixed inset-0 z-[700] grid place-items-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 text-center shadow-2xl"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-safe text-white shadow-soft">
                <PartyPopper className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-black text-foreground">You’ve Arrived Safely!</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Destination {walk.destination} reached with 100% guardian coverage.
              </p>

              <div className="mt-4 rounded-2xl bg-safe-soft/80 p-3.5 text-left border border-safe/30">
                <div className="flex items-center justify-between text-xs font-extrabold text-safe">
                  <span>+50 Citizen Trust Points</span>
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  Automated notification sent to {walk.contact}. SafeWalk logged in your civic history.
                </p>
              </div>

              <Button
                size="lg"
                className="mt-5 h-13 w-full rounded-2xl bg-primary text-white font-extrabold shadow-warm"
                onClick={handleConfirmArrival}
              >
                Complete SafeWalk
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SCREEN TORCH OVERLAY ── */}
      {torchOn && (
        <div
          onClick={() => setTorchOn(false)}
          className="fixed inset-0 z-[800] bg-white cursor-pointer flex flex-col items-center justify-center p-6 text-zinc-900"
        >
          <Lightbulb className="h-20 w-20 text-amber-500 animate-pulse" />
          <b className="mt-4 text-xl font-black">HIGH BEAM SAFETY TORCH</b>
          <p className="text-xs text-zinc-600 mt-1">Tap anywhere to turn off</p>
        </div>
      )}

      {/* ── TWO-WAY SAFEWALK CHAT DRAWER ── */}
      <SafeWalkChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} side="requester" />
    </div>
  );
}
