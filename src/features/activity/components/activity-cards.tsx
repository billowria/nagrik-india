import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Flame,
  Footprints,
  HeartHandshake,
  Image as ImageIcon,
  MapPin,
  MapPinned,
  MessageSquare,
  Navigation,
  PartyPopper,
  Phone,
  Plus,
  ReceiptIndianRupee,
  Route as RouteIcon,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  petitionGoal,
  reportPromise,
  useTraffic,
  type CommunityReport,
  type Job,
} from "@/lib/traffic-store";
import type { SafeWalkSummary } from "@/features/safewalk/types";
import { BeforeAfter } from "@/features/shared/components/before-after";
import { Eyebrow } from "@/features/shared/components/common";
import { timeAgo } from "@/features/shared/components/notification-bell";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
import { InfoButton } from "@/components/info-sheet";
import { AnimatedShield, AnimatedEndorse } from "@/components/animated-icons";

// ── BACKWARDS COMPATIBILITY EXPORTS FOR MARSHAL FLOWS ──
export function PromiseMeter({ report }: { report: CommunityReport }) {
  const p = reportPromise(report);
  return (
    <div className={cn("promise", p.overdue && report.status !== "resolved" && "overdue")}>
      <div className="promise-top">
        <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Action promise · {p.windowHours} h</span>
        <b className="ml-auto">{p.label}</b>
      </div>
      <div className="promise-bar">
        <i style={{ width: `${p.progress}%` }} />
      </div>
    </div>
  );
}

export function StatusCard({ marshal = false }: { marshal?: boolean }) {
  const s = useTraffic();
  if (!s.activeJob)
    return (
      <div className="rounded-2xl bg-cream p-4 text-sm text-muted-foreground">
        No active request
      </div>
    );

  return (
    <div className="mt-4 rounded-3xl border bg-card p-5 shadow-xs">
      <div className="flex justify-between">
        <div>
          <Eyebrow>
            {s.activeJob.kind === "safewalk" ? "SafeWalk companion" : "Active mission"}
          </Eyebrow>
          <h3 className="mt-1 font-extrabold">{s.activeJob.issue}</h3>
        </div>
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
          {s.activeJob.outcome}
        </span>
      </div>
    </div>
  );
}

export function HistoryList() {
  const s = useTraffic();
  const demo = s.history.length
    ? s.history
    : [
        {
          id: "NG-4821",
          kind: "community" as const,
          peopleHelped: 7,
          issue: "Traffic signal outage",
          requester: "Neighbourhood circle",
          location: "Saket, New Delhi",
          address: "Press Enclave Road",
          payout: 380,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 80000000).toISOString(),
          outcome: "Completed" as const,
          evidence: true,
        },
      ];

  return (
    <div className="mt-4 grid gap-2">
      {demo.map((j) => {
        const shared = j.kind === "community";
        return (
          <details key={j.id} className="rounded-2xl border bg-card p-4">
            <summary className="flex cursor-pointer list-none items-center gap-3">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  j.outcome === "Escalated"
                    ? "bg-danger-soft text-danger"
                    : "bg-accent text-primary",
                )}
              >
                {shared ? <Users /> : <ReceiptIndianRupee />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-0.5 block text-[9px] font-extrabold uppercase text-primary">
                  {shared ? "Community mission" : "Personal assistance"}
                </span>
                <b className="block truncate text-sm">{j.issue}</b>
                <small className="text-muted-foreground">
                  {shared ? `${j.peopleHelped ?? 1} people helped` : j.location} · {j.outcome}
                </small>
              </span>
              <b className="text-sm">{j.payout ? `₹${j.payout}` : "No payout"}</b>
            </summary>
            <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
              {j.note ||
                `${shared ? "Everyone following the report" : "Requester"} was notified of the resolution.`}{" "}
              Evidence: {j.evidence ? "submitted" : "not required"}.
            </div>
          </details>
        );
      })}
    </div>
  );
}

// ── 1. HERO ACTIVE BANNER ──
export function HeroActiveBanner({ onOpenDetail }: { onOpenDetail?: (reportId: string) => void }) {
  const s = useTraffic();
  const nav = useNavigate();
  const walk = s.safeWalk;
  const activeJob = s.activeJob;

  if (walk) {
    return (
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-primary/10 to-card p-4.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            Active SafeWalk in Progress
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-black text-primary">
              {walk.safetyScore}% Safe
            </span>
            <InfoButton topic="safewalk-protocol" size="sm" title="SafeWalk Guarantee" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-soft">
            <AnimatedShield size={24} active />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-base font-extrabold text-foreground">
              To {walk.destination}
            </h4>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              Guardian: {walk.contact} · {walk.checkIns} check-ins logged
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="mt-3.5 h-10 w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs shadow-soft"
          onClick={() => nav({ to: "/requester/home" })}
        >
          <span>Return to Live Walk</span>
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    );
  }

  if (activeJob && activeJob.outcome === "In Progress") {
    return (
      <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-card via-primary/5 to-card p-4.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            Active Mission Underway
          </div>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-black text-primary">
            Marshal En Route
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-soft">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-base font-extrabold text-foreground">
              {activeJob.issue}
            </h4>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {activeJob.location} · {activeJob.address || "Hauz Khas"}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="mt-3.5 h-10 w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs shadow-soft"
          onClick={() => nav({ to: "/requester/home" })}
        >
          <span>View Live Tracking</span>
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    );
  }

  return null;
}

// ── 2. 4-STAGE LIFECYCLE REPORT CARD ──
export function LifecycleReportCard({
  report,
  onSelect,
}: {
  report: CommunityReport;
  onSelect: (report: CommunityReport) => void;
}) {
  const s = useTraffic();
  const nav = useNavigate();
  const isResolved = report.status === "resolved";
  const isAssigned = report.status === "assigned" || isResolved;

  // Stages: 1=Reported, 2=Assigned, 3=InProgress, 4=Fixed
  const currentStep = isResolved ? 4 : isAssigned ? 2 : 1;

  const steps = [
    { label: "Reported", active: currentStep >= 1 },
    { label: "Assigned", active: currentStep >= 2 },
    { label: "In Progress", active: currentStep >= 3 },
    { label: "Verified", active: currentStep >= 4 },
  ];

  return (
    <article
      onClick={() => onSelect(report)}
      className="group relative cursor-pointer rounded-3xl border border-border/80 bg-card p-4.5 transition-all duration-200 hover:border-primary/40 hover:shadow-warm active:scale-[0.99]"
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
              isResolved
                ? "bg-accent text-primary"
                : report.priority === "High"
                  ? "bg-danger-soft text-danger"
                  : "bg-amber-500/15 text-amber-700",
            )}
          >
            {isResolved ? "Verified Fixed" : `${report.priority} Priority`}
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {timeAgo(report.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground group-hover:text-primary">
          <span>Details</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Title & Info */}
      <div className="mt-3 flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xs">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
            {report.issue}
          </h4>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{report.address}</p>
        </div>
      </div>

      {/* ── Visual 4-Stage Mini Stepper ── */}
      <div className="mt-4 pt-3.5 border-t border-border/60">
        <div className="flex items-center justify-between text-[10px] font-extrabold mb-1.5">
          <span className="text-muted-foreground uppercase tracking-wider">Status Tracker</span>
          <span className={cn(isResolved ? "text-primary" : "text-primary")}>
            {isResolved ? "Resolution Verified" : isAssigned ? "Marshal On-Site" : "Awaiting Triage"}
          </span>
        </div>

        <div className="relative flex items-center justify-between">
          {/* Track line behind */}
          <div className="absolute left-2 right-2 top-2 h-1 -translate-y-1/2 bg-muted/80 rounded-full" />
          <div
            className="absolute left-2 top-2 h-1 -translate-y-1/2 bg-gradient-to-r from-primary to-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {steps.map((st, i) => (
            <div key={st.label} className="relative z-10 flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-full text-[9px] font-black transition-all",
                  st.active
                    ? "bg-primary text-white shadow-xs"
                    : "bg-card border-2 border-border text-muted-foreground",
                )}
              >
                {st.active ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[9px] font-bold tracking-tight",
                  st.active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Quick Row */}
      <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-border/50 text-xs">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            <b className="text-foreground">{report.supporters}</b> vouches
          </span>
          {report.photoUrl && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ImageIcon className="h-3 w-3 text-muted-foreground" />
              Photo attached
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <InfoButton topic="reporting-bounties" size="sm" title="Hazard Resolution & Bounty Guide" />
          <Button
            size="sm"
            variant={report.supportedByMe ? "secondary" : "outline"}
            className="h-8 rounded-xl px-2.5 text-xs font-bold"
            disabled={report.supportedByMe}
            onClick={() => {
              triggerHaptic("medium");
              s.supportCommunityReport(report.id);
            }}
          >
            {report.supportedByMe ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Vouched
              </>
            ) : (
              <>
                <HeartHandshake className="h-3 w-3 mr-1" />
                Vouch
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-xl p-0 hover:bg-muted"
            onClick={() => {
              s.selectHazard(report.id);
              nav({ to: "/requester/home" });
            }}
          >
            <Navigation className="h-3.5 w-3.5 text-primary" />
          </Button>
        </div>
      </div>
    </article>
  );
}

// ── 3. SAFEWALK HISTORY CARD ──
export function SafeWalkHistoryCard({ walk }: { walk: SafeWalkSummary }) {
  return (
    <article className="rounded-3xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:border-primary/40">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-primary">
          Protected Journey Completed
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground">
            {timeAgo(walk.completedAt)}
          </span>
          <InfoButton topic="safewalk-protocol" size="sm" title="SafeWalk Protocol Details" />
        </div>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xs">
          <Footprints className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-foreground">To {walk.destination}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {walk.duration} min walk · {walk.checkIns} automated check-ins
          </p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-black text-primary">
            {walk.safetyScore}% Safe
          </span>
          <small className="block text-[10px] font-bold text-primary mt-1">
            +{walk.trustPoints} pts
          </small>
        </div>
      </div>
    </article>
  );
}

// ── 4. WARD HEALTH CARD ──
export function WardHealthCard() {
  return (
    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-accent/25 to-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white shadow-soft">
            <Trophy className="h-4 w-4" />
          </span>
          <div>
            <Eyebrow>Civic Health Index</Eyebrow>
            <h3 className="text-sm font-black text-foreground">Ward 42 · Hauz Khas</h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs font-black text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Rank #2 (+2)</span>
            </div>
            <small className="text-[10px] text-muted-foreground">South Delhi Region</small>
          </div>
          <InfoButton topic="civic-score" size="sm" title="Civic Health Index Guide" />
        </div>
      </div>

      {/* Main Score Radial / Stat */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 pt-3 border-t border-primary/20 text-center">
        <div className="rounded-2xl bg-card/80 p-3 border border-border/60">
          <b className="text-xl font-black text-primary">94/100</b>
          <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Civic Score</p>
        </div>
        <div className="rounded-2xl bg-card/80 p-3 border border-border/60">
          <b className="text-xl font-black text-primary">8 Marshals</b>
          <p className="text-[10px] font-bold text-muted-foreground mt-0.5">On Active Patrol</p>
        </div>
        <div className="rounded-2xl bg-card/80 p-3 border border-border/60">
          <b className="text-xl font-black text-foreground">92%</b>
          <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Resolved in 4h</p>
        </div>
      </div>
    </div>
  );
}

// ── 5. COMMUNITY PETITION CARD ──
export function CommunityPetitionCard({ report }: { report: CommunityReport }) {
  const s = useTraffic();
  const [justSigned, setJustSigned] = useState(false);
  const sig = (report.petitionSignatures ?? report.supporters * 3) + (justSigned ? 1 : 0);
  const isSigned = report.petitionedByMe || justSigned;
  const progress = Math.min(100, Math.round((sig / petitionGoal) * 100));

  const handleSign = () => {
    triggerHaptic("success");
    s.signPetition(report.id);
    setJustSigned(true);
  };

  return (
    <article className="rounded-3xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:border-primary/40">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          <ScrollText className="h-3 w-3" />
          Municipal Action Needed
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-muted-foreground">
            {report.distance} away
          </span>
          <InfoButton topic="reporting-bounties" size="sm" title="Municipal Commission Threshold" />
        </div>
      </div>

      <h4 className="mt-2.5 text-sm font-extrabold text-foreground">{report.issue}</h4>
      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{report.address}</p>

      {/* Progress towards municipal action */}
      <div className="mt-3.5 rounded-2xl bg-muted/40 p-3 border border-border/60">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-foreground">
            {sig} / {petitionGoal} Signatures
          </span>
          <span className="text-primary font-bold">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <small className="mt-1.5 block text-[10px] text-muted-foreground">
          {petitionGoal - sig} more needed to trigger formal Municipal Commissioner review.
        </small>
      </div>

      <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>{report.supporters} neighbors backing this</span>
        </div>
        <Button
          size="sm"
          className={cn(
            "h-9 rounded-xl px-4 font-extrabold text-xs transition-all shadow-xs",
            isSigned ? "bg-primary text-white" : "bg-primary hover:bg-primary/90 text-white",
          )}
          disabled={isSigned}
          onClick={handleSign}
        >
          {isSigned ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" />
              Signed & Backed
            </>
          ) : (
            <>
              <ScrollText className="h-3.5 w-3.5 mr-1" />
              Sign Petition
            </>
          )}
        </Button>
      </div>
    </article>
  );
}

// ── 6. VERIFIED EVIDENCE GALLERY ──
export function VerifiedEvidenceGallery({ reports }: { reports: CommunityReport[] }) {
  const verifiedReports = reports.filter((r) => r.photoUrl && r.afterPhotoUrl);
  const sample = verifiedReports.length
    ? verifiedReports[0]
    : {
        id: "resolved-demo",
        issue: "Hazardous Pothole Restored",
        address: "Aurobindo Marg, near Metro Gate 2",
        before:
          "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
        after:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
      };

  return (
    <div className="rounded-3xl border border-primary/30 bg-card p-4.5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-primary">
            <BadgeCheck className="h-4 w-4" />
          </span>
          <div>
            <Eyebrow>Verified Proof of Impact</Eyebrow>
            <h3 className="text-sm font-black text-foreground">Before & After Resolution</h3>
          </div>
        </div>
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-black text-primary">
          Verified
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80">
        <BeforeAfter
          before={"photoUrl" in sample && sample.photoUrl ? sample.photoUrl : sample.before}
          after={"afterPhotoUrl" in sample && sample.afterPhotoUrl ? sample.afterPhotoUrl : sample.after}
        />
        <div className="bg-muted/40 p-3">
          <b className="text-xs font-black text-foreground block">{sample.issue}</b>
          <p className="text-[11px] text-muted-foreground mt-0.5">{sample.address}</p>
        </div>
      </div>
    </div>
  );
}

// ── 7. WARD LEADERBOARD & ADOPTED SPOTS ──
export function WardLeaderboardCard() {
  const s = useTraffic();
  const nav = useNavigate();

  const rankings = [
    { rank: 1, name: "Green Park", pts: 4820, delta: "+2" },
    { rank: 2, name: "Hauz Khas (Your Ward)", pts: 4378, delta: "+1", isUser: true },
    { rank: 3, name: "Malviya Nagar", pts: 3980, delta: "-1" },
    { rank: 4, name: "Saket", pts: 3610, delta: "0" },
    { rank: 5, name: "IIT Delhi", pts: 3120, delta: "+3" },
  ];

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-4.5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-4 w-4" />
          </span>
          <div>
            <Eyebrow>South Delhi Civic League</Eyebrow>
            <h3 className="text-sm font-black text-foreground">Ward Rankings</h3>
          </div>
        </div>
        <small className="text-[10px] text-muted-foreground">Updated hourly</small>
      </div>

      <div className="space-y-1.5">
        {rankings.map((r) => (
          <div
            key={r.rank}
            className={cn(
              "flex items-center justify-between rounded-2xl p-2.5 text-xs transition-colors",
              r.isUser
                ? "bg-accent border border-primary/30 font-extrabold text-foreground"
                : "bg-muted/30 text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-[10px] font-black",
                  r.isUser ? "bg-primary text-white" : "bg-card text-foreground",
                )}
              >
                {r.rank}
              </span>
              <span className="truncate">{r.name}</span>
            </div>
            <div className="flex items-center gap-2 font-bold shrink-0">
              <span className="text-[10px] text-primary font-black">{r.delta}</span>
              <span className="text-foreground">{r.pts.toLocaleString()} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Adopted Spots section */}
      <div className="mt-4 pt-3.5 border-t border-border/60">
        <div className="flex items-center justify-between text-xs mb-2">
          <b className="font-extrabold text-foreground flex items-center gap-1.5">
            <MapPinned className="h-4 w-4 text-primary" />
            Your Adopted Spots
          </b>
          <span className="text-[10px] text-primary font-bold">1 active spot</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-2.5 text-xs">
          <div>
            <b className="block text-xs font-bold text-foreground">Aurobindo Marg Intersection</b>
            <small className="text-[10px] text-muted-foreground">Checked 2 days ago · Zero active hazards</small>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-xl text-xs font-bold"
            onClick={() => nav({ to: "/requester/home" })}
          >
            View Map
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── 8. MAIN TAB 1: "MY ACTIVITY" ──
export function MyActivityTab({
  onSelectReport,
}: {
  onSelectReport: (report: CommunityReport) => void;
}) {
  const s = useTraffic();
  const nav = useNavigate();
  const [filter, setFilter] = useState<"all" | "in_progress" | "resolved" | "safewalks">("all");

  const myReports = s.communityReports.filter(
    (r) => r.mine || r.supportedByMe || r.requestedByMe,
  );
  const safeWalks = s.safeWalkHistory || [];

  const filteredReports = myReports.filter((r) => {
    if (filter === "in_progress") return r.status !== "resolved";
    if (filter === "resolved") return r.status === "resolved";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Hero Active Banner if SafeWalk or Job is live */}
      <HeroActiveBanner />

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: "all", label: "All Items" },
          { key: "in_progress", label: "In Progress" },
          { key: "resolved", label: "Resolved" },
          { key: "safewalks", label: "SafeWalks" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key as typeof filter)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-all whitespace-nowrap",
              filter === f.key
                ? "bg-primary text-white shadow-soft"
                : "bg-card border border-border/80 text-muted-foreground hover:bg-muted/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List of items */}
      {filter === "safewalks" ? (
        safeWalks.length ? (
          <div className="space-y-3">
            {safeWalks.map((w) => (
              <SafeWalkHistoryCard key={w.id} walk={w} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/80 p-8 text-center bg-card">
            <Footprints className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
            <h4 className="font-extrabold text-foreground text-sm">No SafeWalks logged yet</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Start your first protected walk with live route corridor tracking.
            </p>
            <Button
              className="mt-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs shadow-soft"
              onClick={() => nav({ to: "/requester/home" })}
            >
              Start SafeWalk
            </Button>
          </div>
        )
      ) : filteredReports.length ? (
        <div className="space-y-3">
          {filteredReports.map((r) => (
            <LifecycleReportCard key={r.id} report={r} onSelect={onSelectReport} />
          ))}
          {/* Also include completed walks in 'all' view */}
          {filter === "all" && safeWalks.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
                Recent SafeWalks
              </h4>
              <div className="space-y-3">
                {safeWalks.slice(0, 2).map((w) => (
                  <SafeWalkHistoryCard key={w.id} walk={w} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border/80 p-8 text-center bg-card">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
          <h4 className="font-extrabold text-foreground text-sm">No activity in this filter</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Report an issue or support neighborhood requests to track resolution.
          </p>
          <Button
            className="mt-4 rounded-2xl bg-primary text-white font-extrabold text-xs shadow-soft"
            onClick={() => nav({ to: "/requester/home" })}
          >
            Report an Issue
          </Button>
        </div>
      )}
    </div>
  );
}

// ── 9. MAIN TAB 2: "COMMUNITY & WARD" ──
export function CommunityWardTab({
  onSelectReport,
}: {
  onSelectReport: (report: CommunityReport) => void;
}) {
  const s = useTraffic();
  const petitions = s.communityReports.filter((r) => r.status !== "resolved").slice(0, 3);

  return (
    <div className="space-y-4">
      {/* 1. Ward Health & Civic Score Gauge */}
      <WardHealthCard />

      {/* 2. Actionable Neighborhood Petitions */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Petitions Needing Your Signature
          </h4>
          <span className="text-[10px] text-primary font-bold">Local Ward 42</span>
        </div>
        <div className="space-y-3">
          {petitions.map((p) => (
            <CommunityPetitionCard key={p.id} report={p} />
          ))}
        </div>
      </div>

      {/* 3. Verified Proof of Impact Gallery */}
      <VerifiedEvidenceGallery reports={s.communityReports} />

      {/* 4. Ward Rankings & Adopted Spots */}
      <WardLeaderboardCard />
    </div>
  );
}
