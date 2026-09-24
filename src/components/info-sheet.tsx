import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Info,
  X,
  ShieldCheck,
  Award,
  Footprints,
  FileCheck2,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export type InfoTopic =
  | "civic-score"
  | "safewalk-protocol"
  | "marshal-verification"
  | "reporting-bounties"
  | "sos-dispatch";

interface TopicContent {
  title: string;
  badge: string;
  badgeVariant?: "blue" | "cyan" | "amber" | "red";
  icon: typeof ShieldCheck;
  subtitle: string;
  summary: string;
  steps: { title: string; desc: string }[];
  guarantees: string[];
}

const TOPIC_REGISTRY: Record<InfoTopic, TopicContent> = {
  "civic-score": {
    title: "Civic Trust & Karma Score",
    badge: "Reputation Engine",
    badgeVariant: "blue",
    icon: Award,
    subtitle: "How citizen credibility and community standing are calculated",
    summary:
      "Your Civic Score reflects your verified contributions to safer, cleaner neighborhoods. Every authentic report, verified resolution, and community endorsement increases your trust score.",
    steps: [
      {
        title: "Verified Hazard Reporting (+15 pts)",
        desc: "Submitting geo-tagged road or safety reports that are validated by marshals.",
      },
      {
        title: "Community Endorsements (+5 pts)",
        desc: "Co-signing neighbor petitions and upvoting critical safety alerts in your ward.",
      },
      {
        title: "Volunteer Escort & SafeWalk (+25 pts)",
        desc: "Participating in verified SafeWalk escort details or marshaling cleanups.",
      },
    ],
    guarantees: [
      "100% Anti-Spam protection with GPS proof",
      "Higher score unlocks fast-track municipal action",
      "Redeemable for community badges & civic honor roll",
    ],
  },
  "safewalk-protocol": {
    title: "SafeWalk™ 24/7 Security Protocol",
    badge: "Escort Guarantee",
    badgeVariant: "cyan",
    icon: Footprints,
    subtitle: "Real-time corridor protection and verified guardian accompaniment",
    summary:
      "SafeWalk establishes an encrypted safety corridor between your live location and destination. A verified Nagrik Marshal monitors your progress with standby rapid response.",
    steps: [
      {
        title: "Encrypted Corridor Route",
        desc: "AI pathfinding selects well-lit, active streets monitored by public civic beacons.",
      },
      {
        title: "Live Marshal Telemetry",
        desc: "Nearby motorized marshals are locked to your perimeter within 200m radius.",
      },
      {
        title: "Dead-Man Safety Switch",
        desc: "If you deviate or stop unexpectedly, automatic ping requests PIN verification in 45s.",
      },
      {
        title: "Instant Audio/SOS Dispatch",
        desc: "Single tap escalates immediately to emergency marshals and designated trusted contacts.",
      },
    ],
    guarantees: [
      "Zero telemetry shared with third parties",
      "Police-cleared & background-verified marshals",
      "Free 24/7 service for all citizens",
    ],
  },
  "marshal-verification": {
    title: "Verified Marshal Standards",
    badge: "Official Credentials",
    badgeVariant: "blue",
    icon: ShieldCheck,
    subtitle: "Rigorous government KYC, background screening, and training",
    summary:
      "Every Nagrik Marshal undergoes mandatory identity verification, local police verification, and certified civic emergency response training before entering active duty.",
    steps: [
      {
        title: "Aadhaar & Driving KYC Verification",
        desc: "Biometric and government ID cross-matching to prevent fraud and impersonation.",
      },
      {
        title: "Ward Field Training & First Aid",
        desc: "Completed curriculum in crowd calming, traffic control, and incident reporting.",
      },
      {
        title: "Real-Time Telemetry & Body Cam Log",
        desc: "All active missions log GPS breadcrumbs and verified before/after photographic proof.",
      },
    ],
    guarantees: [
      "Zero tolerance for misconduct or falsified reports",
      "Real-time supervisor dispatch oversight",
      "Equipped with civic emergency equipment",
    ],
  },
  "reporting-bounties": {
    title: "Hazard Resolution & Civic Tokens",
    badge: "Citizen Payouts",
    badgeVariant: "amber",
    icon: FileCheck2,
    subtitle: "Transparent workflow from citizen report to verified fix",
    summary:
      "When you spot a dangerous road crater, malfunctioning traffic light, or waterlogging, report it with geo-proof. Once resolved and verified by neighbors, earn civic tokens.",
    steps: [
      {
        title: "1. Capture & Geotag",
        desc: "Snap a photo. Nagrik automatically locks exact GPS and municipal ward boundary.",
      },
      {
        title: "2. Community Upvote Threshold",
        desc: "Neighboring citizens upvote to elevate priority on the municipal ward radar.",
      },
      {
        title: "3. Marshal Field Dispatch",
        desc: "Nearest available marshal inspects on-site, coordinates repairs, and logs after-photo.",
      },
      {
        title: "4. Token Payout & Karma Boost",
        desc: "Both reporter and resolver earn reward tokens withdrawable to UPI wallet.",
      },
    ],
    guarantees: [
      "Tamper-proof before/after comparison slider",
      "Direct municipal department escalation",
      "Fast UPI direct bank transfer",
    ],
  },
  "sos-dispatch": {
    title: "Priority Emergency SOS Chain",
    badge: "Immediate Response",
    badgeVariant: "red",
    icon: AlertOctagon,
    subtitle: "Multi-channel broadcast to marshals, PCR vans, and contacts",
    summary:
      "Activating SOS immediately broadcasts your precise coordinates, audio stream, and battery status to the nearest 5 marshals and emergency response dispatchers.",
    steps: [
      {
        title: "Immediate Loud Siren (Optional)",
        desc: "Can be muted for discrete stealth escort or amplified to deter threats.",
      },
      {
        title: "Instant SMS & Location to Trusted Contacts",
        desc: "Automated alert containing live tracking URL sent to emergency circle.",
      },
      {
        title: "Priority Marshal Radio Intercept",
        desc: "All marshals within 2km receive top-level override alert with navigation.",
      },
    ],
    guarantees: [
      "Sub-2 minute response target in active wards",
      "Direct link to local police control room",
      "Continuous live telemetry recording",
    ],
  },
};

export function InfoButton({
  topic,
  className,
  size = "md",
  title = "Learn more",
}: {
  topic: InfoTopic;
  className?: string;
  size?: "sm" | "md" | "lg";
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        title={title}
        aria-label={title}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          triggerHaptic("selection");
          setOpen(true);
        }}
        className={cn(
          "inline-grid place-items-center rounded-full border border-border/70 bg-card/90 text-muted-foreground hover:text-primary hover:border-primary/50 shadow-xs transition-colors backdrop-blur",
          size === "sm" && "h-5 w-5 text-[11px]",
          size === "md" && "h-6 w-6 text-xs",
          size === "lg" && "h-8 w-8 text-sm",
          className,
        )}
      >
        <Info className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      </motion.button>

      <InfoSheet topic={topic} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function InfoSheet({
  topic,
  open,
  onClose,
}: {
  topic: InfoTopic;
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!mounted || typeof document === "undefined" || !document.body) return null;

  const content = TOPIC_REGISTRY[topic];
  if (!content) return null;

  const Icon = content.icon;

  const badgeStyles = {
    blue: "bg-primary/10 text-primary border-primary/20",
    cyan: "bg-safe-soft text-safe border-safe/30",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    red: "bg-destructive/10 text-destructive border-destructive/20",
  }[content.badgeVariant || "blue"];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="info-sheet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              triggerHaptic("light");
              onClose();
            }
          }}
          className="fixed inset-0 z-[99999] grid place-items-end justify-items-center p-3 pb-[max(16px,env(safe-area-inset-bottom))] sm:place-items-center sm:p-4 bg-black/60 backdrop-blur-sm"
        >
          {/* Card */}
          <motion.div
            key="info-sheet-card"
            role="dialog"
            aria-modal="true"
            initial={{ y: 35, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 35, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative flex w-full max-w-[500px] max-h-[82dvh] flex-col rounded-[28px] border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Grabber indicator */}
            <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/25" />

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-5 py-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border",
                  badgeStyles,
                )}
              >
                <Sparkles className="h-3 w-3" />
                {content.badge}
              </span>

              <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                onClick={() => {
                  triggerHaptic("light");
                  onClose();
                }}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4">
              {/* Title & Icon */}
              <div className="flex items-start gap-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black text-foreground leading-snug tracking-tight">
                    {content.title}
                  </h2>
                  <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                    {content.subtitle}
                  </p>
                </div>
              </div>

              {/* Summary card */}
              <div className="rounded-2xl border border-border/80 bg-accent/35 p-3.5 text-xs text-foreground leading-relaxed">
                {content.summary}
              </div>

              {/* Steps & breakdown */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  How It Works
                </h3>
                {content.steps.map((st, i) => (
                  <div
                    key={st.title}
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-xs"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-black text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <b className="block text-xs font-black text-foreground">{st.title}</b>
                      <small className="mt-0.5 block text-[11px] text-muted-foreground leading-normal">
                        {st.desc}
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="rounded-2xl bg-muted/50 p-3.5 border border-border/60">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-2">
                  Guaranteed Standards
                </h4>
                <ul className="space-y-1.5 text-xs font-medium text-foreground">
                  {content.guarantees.map((g) => (
                    <li key={g} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pinned Action Footer */}
            <div className="shrink-0 border-t border-border/60 bg-card/90 p-4 backdrop-blur-md">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  triggerHaptic("medium");
                  onClose();
                }}
                className="h-12 w-full rounded-2xl bg-primary text-white font-extrabold text-sm shadow-warm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <span>I Understand</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
