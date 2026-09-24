import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Phone, Share2, ShieldAlert, ShieldCheck, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { emergencyLines, useTraffic } from "@/lib/traffic-store";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
import { InfoButton } from "@/components/info-sheet";

export function TrackLink() {
  const [copied, setCopied] = useState(false);
  const link = "nagrik.app/track/sw-4821";
  return (
    <button
      onClick={() => {
        triggerHaptic("selection");
        navigator.clipboard?.writeText(`https://${link}`).catch(() => {});
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="track-link"
    >
      <Share2 className="shrink-0 text-primary" />
      <span className="min-w-0 flex-1 text-left">
        <b className="block text-xs">Share live shield link</b>
        <small className="block truncate text-muted-foreground">{link}</small>
      </span>
      {copied ? <Check className="text-primary" /> : <Copy className="text-muted-foreground" />}
    </button>
  );
}

export function SosDock({ compact = false, className }: { compact?: boolean; className?: string }) {
  const s = useTraffic();
  const [count, setCount] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (count === null) return;
    triggerHaptic(count === 0 ? "sos" : "medium");
    if (count <= 0) {
      s.triggerSos();
      setCount(null);
      setOpen(true);
      return;
    }
    const t = window.setTimeout(() => setCount((c) => (c ?? 1) - 1), 1000);
    return () => window.clearTimeout(t);
  }, [count, s]);

  return (
    <>
      <Button
        aria-label="Emergency SOS"
        onClick={() => {
          triggerHaptic("warning");
          setCount(5);
        }}
        className={cn("sos-fab", compact && "sos-fab--compact", className)}
      >
        <ShieldAlert className={compact ? "h-4 w-4" : "h-5 w-5"} />
        <span>SOS</span>
      </Button>

      {count !== null &&
        typeof document !== "undefined" &&
        document.body &&
        createPortal(
          <div className="sos-overlay" role="alertdialog" aria-label="Emergency countdown">
            <div className="sos-ring">
              <b>{count}</b>
              <small>Alerting</small>
            </div>
            <p>Nagrik marshals within 1.2 km and your trusted circle will be alerted.</p>
            <Button
              variant="secondary"
              className="h-13 w-56 rounded-2xl"
              onClick={() => setCount(null)}
            >
              Cancel · accidental tap
            </Button>
          </div>,
          document.body,
        )}

      <Drawer
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) s.cancelSos();
        }}
      >
        <DrawerContent className="mx-auto max-w-[560px] rounded-t-3xl bg-background">
          <DrawerHeader className="px-5 text-left">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2 text-danger">
                <Siren />
                Emergency shield active
              </DrawerTitle>
              <InfoButton topic="sos-dispatch" size="sm" title="Emergency Protocol" />
            </div>
            <DrawerDescription>
              Your live location is shared with your trusted circle and nearby marshals.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
            <div className="grid gap-2">
              {emergencyLines.map((l) => (
                <a key={l.number} href={`tel:${l.number}`} className="sos-line">
                  <span className="sos-line-icon">
                    <Phone />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block text-sm">{l.label}</b>
                    <small className="text-muted-foreground">{l.detail}</small>
                  </span>
                  <b className="text-base text-danger">{l.number}</b>
                </a>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-accent p-3 text-xs text-primary">
              <ShieldCheck className="mr-2 inline h-4 w-4" />3 marshals within 1.2 km acknowledged
              your alert.
            </div>
            <TrackLink />
            <Button
              variant="outline"
              className="mt-3 h-12 w-full rounded-2xl"
              onClick={() => {
                s.cancelSos();
                setOpen(false);
              }}
            >
              I’m safe · stand down
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
