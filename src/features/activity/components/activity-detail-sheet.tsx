import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  ScrollText,
  Share2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { petitionGoal, useTraffic, type CommunityReport } from "@/lib/traffic-store";
import { BeforeAfter } from "@/features/shared/components/before-after";
import { timeAgo } from "@/features/shared/components/notification-bell";
import { cn } from "@/lib/utils";

export function ActivityDetailSheet({
  report,
  onClose,
  onOpenMap,
}: {
  report: CommunityReport | null;
  onClose: () => void;
  onOpenMap: (reportId: string) => void;
}) {
  const s = useTraffic();
  if (!report) return null;

  const isResolved = report.status === "resolved";
  const isAssigned = report.status === "assigned" || isResolved;
  const sig = report.petitionSignatures ?? report.supporters * 3;

  // 4 Lifecycle Stages
  const stages = [
    {
      step: 1,
      title: "Issue Reported",
      desc: `Logged by ${report.mine ? "You" : report.reporter}`,
      time: timeAgo(report.createdAt),
      done: true,
      active: report.status === "open",
    },
    {
      step: 2,
      title: "Marshal Assigned",
      desc: isAssigned ? "Vikram Singh (Ward 42 Lead)" : "Locating nearest verified marshal",
      time: isAssigned ? "12 min after report" : "Pending",
      done: isAssigned,
      active: report.status === "assigned",
    },
    {
      step: 3,
      title: "Resolution in Progress",
      desc: isResolved
        ? "Work crew on-site & completed"
        : isAssigned
          ? "Inspection ongoing with civic authority"
          : "Scheduled upon marshal inspection",
      time: isResolved ? "2 hours ago" : isAssigned ? "In progress" : "Upcoming",
      done: isResolved,
      active: report.status === "assigned",
    },
    {
      step: 4,
      title: "Verified & Closed",
      desc: isResolved
        ? "Before/after photo verified · Community safe"
        : "Pending citizen & marshal verification",
      time: isResolved ? "Resolved" : "Final step",
      done: isResolved,
      active: isResolved,
    },
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted || typeof document === "undefined" || !document.body) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative z-10 w-full max-w-lg max-h-[88dvh] overflow-y-auto rounded-t-[32px] sm:rounded-3xl border border-border bg-card p-5 shadow-2xl overscroll-contain"
        >
          {/* Header Grabber & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
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
                {isResolved ? "Verified Resolved" : `${report.priority} Priority`}
              </span>
              <span className="text-[11px] font-bold text-muted-foreground">ID #{report.id}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Title & Category */}
          <div className="mt-4 flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xs">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black text-foreground leading-snug">{report.issue}</h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate">{report.address}</span>
              </div>
            </div>
          </div>

          {/* Evidence Comparison or Photo */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-border/80 bg-muted/40">
            {report.photoUrl && report.afterPhotoUrl ? (
              <div>
                <BeforeAfter before={report.photoUrl} after={report.afterPhotoUrl} />
                <div className="flex items-center justify-between bg-card/90 px-3 py-1.5 text-[11px] font-bold text-muted-foreground">
                  <span>Slide to inspect resolution</span>
                  <span className="text-primary flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified Fixed
                  </span>
                </div>
              </div>
            ) : report.photoUrl ? (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={report.photoUrl}
                  alt={`Reported ${report.issue}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                  Evidence Photo
                </span>
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center p-4 text-center text-muted-foreground">
                <MapPin className="h-8 w-8 text-primary/40 mb-1" />
                <span className="text-xs font-bold">Pinned Geo-location</span>
                <small className="text-[11px]">{report.location}</small>
              </div>
            )}
          </div>

          {/* ── 4-Stage Lifecycle Stepper ── */}
          <div className="mt-5 rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Live Resolution Lifecycle
              </h4>
              <span className="text-[11px] font-bold text-primary">
                {isResolved ? "100% Complete" : isAssigned ? "Stage 3 of 4" : "Stage 1 of 4"}
              </span>
            </div>

            <div className="relative pl-6 space-y-4">
              {/* Vertical connector line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

              {stages.map((st) => (
                <div key={st.step} className="relative flex items-start gap-3">
                  <span
                    className={cn(
                      "absolute -left-6 grid h-6 w-6 place-items-center rounded-full text-[11px] font-black border-2 transition-all",
                      st.done
                        ? "bg-primary border-primary text-white shadow-xs"
                        : st.active
                          ? "bg-primary border-primary text-white animate-pulse"
                          : "bg-card border-border text-muted-foreground",
                    )}
                  >
                    {st.done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : st.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <b
                        className={cn(
                          "text-xs font-extrabold",
                          st.done ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {st.title}
                      </b>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {st.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Marshal / Contact Card */}
          <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent text-primary font-black text-sm">
                VS
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <b className="truncate text-xs font-extrabold text-foreground">Vikram Singh</b>
                  <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-black text-primary">
                    Marshal Lead
                  </span>
                </div>
                <small className="block truncate text-[10px] text-muted-foreground">
                  Ward 42 Hauz Khas · 4.9★ (38 missions)
                </small>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-xl border-border/80 text-foreground hover:bg-muted"
                onClick={() => alert("Calling Marshal Vikram Singh: +91 98765 43210")}
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-xl border-border/80 text-foreground hover:bg-muted"
                onClick={() => alert("Opening secure chat with Ward 42 Marshall Desk")}
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Community Petition Tracker */}
          <div className="mt-3.5 rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
            <div className="flex items-center justify-between text-xs font-extrabold text-primary">
              <span className="flex items-center gap-1.5">
                <ScrollText className="h-4 w-4" />
                Municipal Action Petition
              </span>
              <span>
                {Math.min(sig, petitionGoal)} / {petitionGoal} Signatures
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-primary/15">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((sig / petitionGoal) * 100))}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground leading-snug">
              Once threshold is met, automated civic escalation is sent directly to the Ward 42
              Municipal Commissioner.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              className="h-12 rounded-2xl font-extrabold text-xs"
              onClick={() => onOpenMap(report.id)}
            >
              <Navigation className="h-4 w-4 mr-1.5 text-primary" />
              View on Map
            </Button>
            <Button
              className={cn(
                "h-12 rounded-2xl font-extrabold text-xs text-white shadow-soft",
                report.supportedByMe
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-primary hover:bg-primary/90",
              )}
              onClick={() => s.supportCommunityReport(report.id)}
              disabled={report.supportedByMe}
            >
              {report.supportedByMe ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Vouched ({report.supporters})
                </>
              ) : (
                <>
                  <HeartHandshake className="h-4 w-4 mr-1.5" />
                  Vouch & Support
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
