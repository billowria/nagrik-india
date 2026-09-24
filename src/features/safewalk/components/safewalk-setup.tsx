import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock,
  Footprints,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserRound,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeWalkPresets } from "@/lib/map-data";
import {
  protectionOptions,
  safeWalkCheckPlan,
  safeWalkScore,
  useTraffic,
  type SafeWalkProtection,
} from "@/lib/traffic-store";
import { Eyebrow, Logo, SectionTitle } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { MapView } from "@/features/shared/components/map-view";
import { SafeWalkIntro, safeWalkIntroSeen } from "@/components/safewalk-intro";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

function SignalStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="sw-signal">
      <Icon />
      <b>{value}</b>
      <small>{label}</small>
    </div>
  );
}

export function SafeWalkSetup({ onClose }: { onClose: () => void }) {
  const s = useTraffic();
  const reduce = useReducedMotion();
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    if (!safeWalkIntroSeen()) setIntro(true);
  }, []);

  const [destination, setDestination] = useState("Hauz Khas Metro Gate 2");
  const [duration, setDuration] = useState(15);
  const [contact, setContact] = useState(
    s.emergencyContacts[0]
      ? `${s.emergencyContacts[0].name} · ${s.emergencyContacts[0].relation}`
      : "Priya · Sister",
  );
  const [monitoring, setMonitoring] = useState(true);
  const [protection, setProtection] = useState<SafeWalkProtection>("guarded");

  const score = safeWalkScore(protection);
  const plan = safeWalkCheckPlan(duration, protection);
  const recommended =
    score >= 90
      ? "Strong safety coverage"
      : score >= 84
        ? "Good route confidence"
        : "Use High Alert for this route";

  return (
    <main className="safewalk-shell min-h-dvh bg-cream">
      <div className="mx-auto max-w-[620px] px-4 pb-28 pt-[max(18px,env(safe-area-inset-top))]">
        <div className="safewalk-top">
          <Button variant="ghost" size="icon" aria-label="Close SafeWalk" onClick={onClose}>
            <ArrowLeft />
          </Button>
          <Logo small />
          <Button
            variant="outline"
            size="icon"
            aria-label="How SafeWalk protects you"
            onClick={() => setIntro(true)}
          >
            <CircleHelp />
          </Button>
        </div>

        <motion.section
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="safewalk-command"
        >
          <div className="safewalk-shield">
            <ShieldCheck />
            <span />
          </div>
          <div className="min-w-0">
            <Eyebrow>Citizen Safety Hub</Eyebrow>
            <h1>SafeWalk Companion</h1>
            <p>
              Plan a protected route, keep your trusted circle updated, and escalate instantly if
              the walk feels unsafe.
            </p>
          </div>
          <div className="safewalk-score">
            <b>{score}</b>
            <small>route confidence</small>
          </div>
        </motion.section>

        <section className="sw-route-card">
          <div className="sw-route-map">
            <MapView route interactive={false} />
            <div className="sw-corridor">
              <span />
              <i />
              <b />
            </div>
            <div className="sw-map-badge">Live civic radar</div>
          </div>
          <div className="sw-route-meta">
            <div>
              <Eyebrow>Suggested route</Eyebrow>
              <h2>{destination}</h2>
              <p>
                {recommended} · {monitoring ? "marshal standby available" : "trusted circle only"}
              </p>
            </div>
            <span>{duration} min</span>
          </div>
          <div className="sw-signal-grid">
            <SignalStat label="Safe zones" value="4" icon={ShieldCheck} />
            <SignalStat label="Lighting" value="84%" icon={Sparkles} />
            <SignalStat label="Marshal" value={monitoring ? "2.4 min" : "Off"} icon={Bike} />
          </div>
        </section>

        <section className="sw-panel">
          <SectionTitle>Walk details</SectionTitle>
          <label className="sw-field">
            Destination
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-2 h-12 bg-card"
            />
          </label>
          <div>
            <p className="sw-label">Expected duration</p>
            <div className="sw-duration-grid">
              {[10, 15, 25].map((n) => (
                <Button
                  key={n}
                  variant={duration === n ? "default" : "outline"}
                  onClick={() => setDuration(n)}
                >
                  {n} min
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="sw-label">Protection level</p>
            <div className="sw-protection-grid">
              {protectionOptions.map(({ id, title, detail, icon: Icon }) => (
                <Button
                  key={id}
                  variant="outline"
                  onClick={() => {
                    setProtection(id);
                    setMonitoring(id !== "quiet");
                  }}
                  className={cn("sw-protection", protection === id && "active")}
                >
                  <Icon />
                  <span>
                    <b>{title}</b>
                    <small>{detail}</small>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="sw-panel">
          <div className="sw-section-head">
            <div>
              <Eyebrow>Trusted circle</Eyebrow>
              <h3>Who watches this walk?</h3>
            </div>
            <span>{s.emergencyContacts.length} ready</span>
          </div>
          <div className="sw-contact-strip">
            {s.emergencyContacts.slice(0, 3).map((c) => (
              <Button
                key={c.id}
                variant="outline"
                onClick={() => setContact(`${c.name} · ${c.relation}`)}
                className={cn("sw-contact", contact.startsWith(c.name) && "active")}
              >
                <UserRound />
                <span>
                  <b>{c.name}</b>
                  <small>{c.relation}</small>
                </span>
              </Button>
            ))}
          </div>
          <label className="sw-field mt-3">
            Selected contact
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-2 h-12 bg-card"
            />
          </label>
          <Button
            variant="outline"
            onClick={() => setMonitoring(!monitoring)}
            className="sw-monitor-toggle"
          >
            <span>
              <b>Marshal monitoring</b>
              <small>
                {monitoring
                  ? "A verified marshal watches missed check-ins."
                  : "Only your trusted circle follows progress."}
              </small>
            </span>
            {monitoring ? <ToggleRight /> : <ToggleLeft />}
          </Button>
        </section>

        <section className="sw-grid-2">
          <div className="sw-panel">
            <div className="sw-section-head compact">
              <div>
                <Eyebrow>Check-in plan</Eyebrow>
                <h3>Automatic safety rhythm</h3>
              </div>
            </div>
            <ol className="sw-check-plan">
              {plan.map((c, i) => (
                <li key={c.id}>
                  <span>{i + 1}</span>
                  <div>
                    <b>{c.label}</b>
                    <small>At {c.minute} min</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="sw-panel">
            <div className="sw-section-head compact">
              <div>
                <Eyebrow>Route signals</Eyebrow>
                <h3>What Nagrik is watching</h3>
              </div>
            </div>
            <div className="sw-risk-list">
              {s.communityReports.slice(0, 3).map((r) => (
                <div key={r.id}>
                  <AlertTriangle />
                  <span>
                    <b>{r.issue}</b>
                    <small>
                      {r.distance} · {r.supporters} affected
                    </small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sw-panel">
          <div className="sw-section-head">
            <div>
              <Eyebrow>Previous SafeWalk</Eyebrow>
              <h3>Safety record</h3>
            </div>
            <span>{s.safeWalkHistory.length} walks</span>
          </div>
          {s.safeWalkHistory.slice(0, 2).map((w) => (
            <div key={w.id} className="sw-history-row">
              <ShieldCheck />
              <span>
                <b>{w.destination}</b>
                <small>
                  {w.outcome} · {w.checkIns} check-ins · {w.safetyScore}% confidence
                </small>
              </span>
              <em>+{w.trustPoints}</em>
            </div>
          ))}
        </section>
      </div>

      <div className="sw-start-bar">
        <Button
          disabled={!destination.trim() || !contact.trim()}
          className="h-14 w-full rounded-2xl"
          onClick={() => {
            s.startSafeWalk({
              destination: destination.trim(),
              duration,
              contact: contact.trim(),
              marshalMonitoring: monitoring,
              protectionLevel: protection,
            });
            onClose();
          }}
        >
          <Footprints />
          Start protected walk
        </Button>
      </div>
      <AnimatePresence>{intro && <SafeWalkIntro onDone={() => setIntro(false)} />}</AnimatePresence>
      <DevConsole />
    </main>
  );
}

export function SafeWalkSetupSheet({
  onClose,
  destination,
  setDestination,
  destCoordinates,
  setDestCoordinates,
  step = 1,
  setStep,
}: {
  onClose: () => void;
  destination: string;
  setDestination: (d: string) => void;
  destCoordinates: [number, number];
  setDestCoordinates: (c: [number, number]) => void;
  step?: number;
  setStep?: (n: number) => void;
}) {
  const s = useTraffic();
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    if (!safeWalkIntroSeen()) setIntro(true);
  }, []);

  const [contact, setContact] = useState(
    s.emergencyContacts[0]
      ? `${s.emergencyContacts[0].name} · ${s.emergencyContacts[0].relation}`
      : "Priya · Sister",
  );
  const [monitoring, setMonitoring] = useState(true);
  const [protection, setProtection] = useState<SafeWalkProtection>("guarded");

  // Matched preset if any
  const matchedPreset = safeWalkPresets.find(
    (p) => p.name === destination || p.shortName === destination,
  );
  const duration = matchedPreset?.durationMin ?? 14;
  const score = safeWalkScore(protection);
  const recommended =
    score >= 90
      ? "Strong safety coverage"
      : score >= 84
        ? "Good route confidence"
        : "Use High Alert for this route";

  const handleStartWalk = () => {
    s.startSafeWalk({
      destination: destination.trim() || "SafeWalk Destination",
      duration,
      contact: contact.trim(),
      marshalMonitoring: monitoring,
      protectionLevel: protection,
    });
    onClose();
  };

  return (
    <>
      <div className="requester-flow-scroll">
        {step === 1 ? (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <Eyebrow>Step 1 of 2 · Live Map Corridor</Eyebrow>
                <h2 className="text-xl font-black text-foreground">Where are you walking to?</h2>
              </div>
              <Button
                variant="outline"
                size="icon"
                aria-label="How SafeWalk protects you"
                onClick={() => setIntro(true)}
                className="h-8 w-8 rounded-full"
              >
                <CircleHelp className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a safe destination or preset. A glowing electric cyan corridor is drawn on the live map.
            </p>

            <div className="relative mt-4">
              <span className="absolute left-3 top-3 text-primary">
                <MapPin className="h-4 w-4" />
              </span>
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination or landmark…"
                className="h-11 bg-card pl-9 pr-9 text-xs font-semibold shadow-xs"
              />
              {destination && (
                <button
                  type="button"
                  aria-label="Clear destination"
                  onClick={() => setDestination("")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-3.5">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Quick Safe Corridors
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {safeWalkPresets.map((preset) => {
                  const isSelected =
                    destination === preset.name || destination === preset.shortName;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setDestination(preset.name);
                        setDestCoordinates(preset.coordinates);
                      }}
                      className={cn(
                        "flex flex-col text-left p-3 rounded-2xl border transition-all duration-200",
                        isSelected
                          ? "border-primary bg-safe-soft/80 shadow-xs ring-1 ring-primary/40"
                          : "border-border/70 bg-card hover:bg-muted/40",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <b className="truncate text-xs font-bold">{preset.shortName}</b>
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-black text-primary">
                          {preset.durationMin}m
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[10px] text-muted-foreground">
                        {preset.distanceKm} km · {preset.address}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-safe-soft/30 to-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-safe text-white shadow-soft">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <b className="text-xs font-extrabold">{matchedPreset?.distanceKm ?? 1.1} km corridor</b>
                    <p className="text-[10px] text-muted-foreground">Estimated {duration} min walk</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-safe/15 px-2 py-0.5 text-[10px] font-black text-safe">
                    {score}% Confidence
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/50 pt-2.5 text-center">
                <div>
                  <span className="text-[10px] text-muted-foreground">Havens</span>
                  <b className="block text-xs font-extrabold text-foreground">
                    {matchedPreset?.safeHavens ?? 4} on route
                  </b>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Lighting</span>
                  <b className="block text-xs font-extrabold text-foreground">
                    {matchedPreset?.lightingScore ?? 92}% Lit
                  </b>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Marshals</span>
                  <b className="block text-xs font-extrabold text-safe">Standby</b>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <Eyebrow>Step 2 of 2 · Guardian Level</Eyebrow>
                <h2 className="text-xl font-black text-foreground">Choose your protection</h2>
              </div>
              <span className="rounded-full bg-safe-soft px-2 py-1 text-[10px] font-black text-safe">
                {recommended}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Select how companions follow your walk and how automated check-ins respond.
            </p>

            <div className="mt-4 grid gap-2.5">
              {protectionOptions.map(({ id, title, detail, icon: Icon }) => {
                const isActive = protection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setProtection(id);
                      setMonitoring(id !== "quiet");
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
                      isActive
                        ? "border-primary bg-safe-soft/70 shadow-warm ring-1 ring-primary/40"
                        : "border-border/70 bg-card hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <b className="text-xs font-extrabold">{title}</b>
                        {id === "guarded" && (
                          <span className="rounded-md bg-safe/15 px-1.5 py-0.5 text-[9px] font-black text-safe">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{detail}</p>
                    </div>
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                        isActive ? "border-primary bg-primary text-white" : "border-border",
                      )}
                    >
                      {isActive && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Trusted Circle Companion
                </p>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {s.emergencyContacts.length} contacts ready
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {s.emergencyContacts.slice(0, 4).map((c) => {
                  const isChosen = contact.startsWith(c.name);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setContact(`${c.name} · ${c.relation}`)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all",
                        isChosen
                          ? "border-primary bg-safe-soft ring-1 ring-primary/30"
                          : "border-border/70 bg-card hover:bg-muted/40",
                      )}
                    >
                      <UserRound className="h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <b className="block truncate text-xs font-bold">{c.name}</b>
                        <small className="block truncate text-[10px] text-muted-foreground">
                          {c.relation}
                        </small>
                      </div>
                      {isChosen && <CheckCircle2 className="h-3.5 w-3.5 text-safe shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between rounded-xl border border-primary/20 bg-card p-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <b className="block text-xs font-bold">Marshal Escort Standby</b>
                  <p className="truncate text-[10px] text-muted-foreground">
                    Verified local marshals monitor your automated check-ins
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Toggle marshal standby"
                onClick={() => setMonitoring(!monitoring)}
                className="shrink-0 text-primary"
              >
                {monitoring ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="requester-flow-cta">
        {step === 1 ? (
          <Button
            size="lg"
            disabled={!destination.trim()}
            className="h-13 w-full rounded-2xl text-sm font-extrabold shadow-warm"
            onClick={() => setStep?.(2)}
          >
            <span>Continue to Protection</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            disabled={!destination.trim() || !contact.trim()}
            className="h-13 w-full rounded-2xl bg-safe text-white hover:bg-safe/90 text-sm font-extrabold shadow-warm"
            onClick={handleStartWalk}
          >
            <Footprints className="h-4 w-4" />
            <span>Start Protected Walk</span>
          </Button>
        )}
      </div>

      <AnimatePresence>{intro && <SafeWalkIntro onDone={() => setIntro(false)} />}</AnimatePresence>
    </>
  );
}
