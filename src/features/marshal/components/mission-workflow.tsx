import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Bike,
  Camera,
  Check,
  Footprints,
  LifeBuoy,
  MessageSquare,
  Navigation,
  Phone,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTraffic } from "@/lib/traffic-store";
import { Eyebrow, SummaryRow } from "@/features/shared/components/common";
import { MissionComms } from "@/features/requester/components/requester-status";
import { SafeWalkChatDrawer } from "@/features/safewalk/components/safewalk-chat";
import { cn } from "@/lib/utils";

export function Checklist({
  title,
  items,
  action,
  onAction,
  danger,
}: {
  title: string;
  items: string[];
  action: string;
  onAction: () => void;
  danger: () => void;
}) {
  const [done, setDone] = useState<boolean[]>(items.map(() => false));

  return (
    <div className="px-5 pb-5">
      <Eyebrow>Safety first</Eyebrow>
      <h2 className="text-xl font-extrabold">{title}</h2>
      <div className="mt-4 grid gap-2">
        {items.map((x, i) => (
          <button
            key={`${x}-${i}`}
            onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-xl border p-3 text-left text-sm transition",
              done[i] && "border-primary bg-accent",
            )}
          >
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                done[i] && "border-primary bg-primary text-primary-foreground",
              )}
            >
              {done[i] && <Check className="h-4 w-4" />}
            </span>
            {x}
          </button>
        ))}
      </div>
      <Button
        disabled={!done.every(Boolean)}
        className="mt-4 h-13 w-full rounded-2xl"
        onClick={onAction}
      >
        {action}
      </Button>
      <Button
        variant="outline"
        className="mt-2 h-11 w-full rounded-2xl border-danger/30 text-danger"
        onClick={danger}
      >
        <Phone />
        Escalate to police
      </Button>
    </div>
  );
}

export function Incoming() {
  const s = useTraffic();
  const [accepting, setAccepting] = useState(false);
  const safe = s.activeJob?.kind === "safewalk";
  const shared = s.activeJob?.kind === "community";

  return (
    <div className="px-5 pb-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
            shared ? "bg-accent text-primary" : "bg-danger-soft text-danger",
          )}
        >
          {safe ? <Footprints /> : shared ? <Users /> : <LifeBuoy />}
        </span>
        <div className="min-w-0 flex-1">
          <Eyebrow>
            {safe ? "Companion request" : shared ? "Community mission" : "Personal safety request"}
          </Eyebrow>
          <h1 className="truncate text-xl font-extrabold">{s.activeJob?.issue}</h1>
          <p className="text-xs text-muted-foreground">
            {shared ? "Requested collectively" : s.activeJob?.requester} · {s.activeJob?.location}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-cream p-3">
          <small className="text-muted-foreground">
            {shared ? "People helped" : safe ? "Walk plan" : "Priority"}
          </small>
          <b className="block text-sm">
            {shared
              ? s.activeJob?.peopleHelped
              : safe
                ? `${s.safeWalk?.duration} min · live`
                : "Immediate"}
          </b>
        </div>
        <div className="rounded-xl bg-cream p-3">
          <small className="text-muted-foreground">
            {shared ? "Mission reward" : safe ? "Trusted contact" : "Location"}
          </small>
          <b className="block truncate text-sm">
            {shared ? `₹${s.activeJob?.payout}` : safe ? s.safeWalk?.contact : "Aurobindo Marg"}
          </b>
        </div>
      </div>
      <div className="mt-3 flex gap-2 rounded-xl bg-accent p-3 text-xs text-primary">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        {shared
          ? "One verified resolution updates everyone following this report."
          : safe
            ? "Monitor check-ins and escalate only when safety signals change."
            : "Personal details are shared only for this assistance."}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-13 rounded-2xl" onClick={s.decline}>
          Not available
        </Button>
        <Button
          disabled={accepting}
          className="h-13 rounded-2xl"
          onClick={() => {
            setAccepting(true);
            setTimeout(s.accept, 650);
          }}
        >
          {accepting ? (
            <>
              <RefreshCw className="animate-spin" />
              Joining…
            </>
          ) : safe ? (
            "Start monitoring"
          ) : shared ? (
            "Take community mission"
          ) : (
            "Offer support"
          )}
        </Button>
      </div>
    </div>
  );
}

export function Mission() {
  const s = useTraffic();
  const [photo, setPhoto] = useState<string | null>(null);
  const afterInput = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const shared = s.activeJob?.kind === "community";

  const pickAfter = (file?: File) => {
    if (!file) {
      afterInput.current?.click();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  if (s.activeJob?.kind === "safewalk") {
    const isIntercepting = s.safeWalk?.assignedMarshal?.status === "intercepting";
    return (
      <div className="px-5 pb-6 space-y-3.5">
        {/* Header Profile */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-safe">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-safe" />
              </span>
              SafeWalk Guardian Oversight · Ward 42
            </div>
            <h2 className="text-xl font-black text-foreground mt-0.5">
              Aarav Rajput
            </h2>
            <p className="text-xs text-muted-foreground">
              To {s.safeWalk?.destination} · Trusted: {s.safeWalk?.contact}
            </p>
          </div>
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-black text-safe">
            {s.safeWalk?.safetyScore}% Safe
          </span>
        </div>

        {/* Live Intercept Urgent Banner */}
        {isIntercepting && (
          <div className="rounded-2xl border border-danger/60 bg-danger-soft p-3.5 text-danger animate-pulse shadow-xs">
            <div className="flex items-center gap-2 font-black text-xs">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>INTERCEPT PROTOCOL DEPLOYED</span>
            </div>
            <p className="text-[11px] text-danger/90 mt-1 leading-snug font-bold">
              Ride immediately to Aarav's live GPS corridor. ETA &lt; 1 min. Keep communication line open.
            </p>
          </div>
        )}

        {/* Metric Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl bg-card border border-border/80 p-3 shadow-2xs">
            <small className="text-[10px] font-bold text-muted-foreground block">CORRIDOR STATUS</small>
            <b className="text-sm font-extrabold text-safe flex items-center gap-1 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-safe animate-pulse" />
              {s.safeWalk?.paused ? "Sharing Paused" : "Live GPS Tracking"}
            </b>
          </div>
          <div className="rounded-2xl bg-card border border-border/80 p-3 shadow-2xs">
            <small className="text-[10px] font-bold text-muted-foreground block">CHECK-INS</small>
            <b className="text-sm font-extrabold text-foreground mt-0.5 block">
              {s.safeWalk?.checkIns} Verified
            </b>
          </div>
        </div>

        {/* Tactical Actions */}
        <div className="space-y-2 pt-1">
          {/* Two-Way Chat Button */}
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full justify-between rounded-2xl border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-extrabold text-primary shadow-xs"
            onClick={() => setChatOpen(true)}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Live Safety Chat with Aarav
            </span>
            {s.messages.length > 0 ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-white">
                {s.messages.length} msgs
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground font-semibold">Open channel</span>
            )}
          </Button>

          {/* Quick Intercept vs Call */}
          <div className="grid grid-cols-2 gap-2">
            {isIntercepting ? (
              <Button
                size="lg"
                className="h-12 rounded-2xl bg-danger hover:bg-danger/90 text-white text-xs font-black shadow-warm"
                onClick={() => alert("Calling Aarav Rajput: +91 98765 43210")}
              >
                <Phone className="h-4 w-4 mr-1.5" />
                Call Aarav
              </Button>
            ) : (
              <Button
                size="lg"
                className="h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-soft"
                onClick={s.triggerMarshalIntercept}
              >
                <ShieldAlert className="h-4 w-4 mr-1.5" />
                Deploy Intercept
              </Button>
            )}

            <Button
              size="lg"
              className="h-12 rounded-2xl bg-safe hover:bg-primary/90 text-white text-xs font-black shadow-warm"
              onClick={s.finishSafeWalk}
            >
              <Check className="h-4 w-4 mr-1.5 stroke-[3]" />
              Safe Arrival Verified
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-full rounded-xl text-danger hover:bg-danger/10 text-xs font-bold"
            onClick={s.escalate}
          >
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Escalate to Emergency Desk / PCR
          </Button>
        </div>

        {/* ── TWO-WAY SAFEWALK CHAT DRAWER FOR MARSHAL ── */}
        <SafeWalkChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} side="marshal" />
      </div>
    );
  }

  if (s.stage === "accepted" || s.stage === "enroute") {
    return (
      <div className="px-5 pb-5">
        <Eyebrow>Navigate safely</Eyebrow>
        <h2 className="text-xl font-extrabold">Aarav is 2.4 km away</h2>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cream p-3">
          <Navigation className="text-primary" />
          <div>
            <b className="text-sm">Continue on Aurobindo Marg</b>
            <p className="text-xs text-muted-foreground">Next turn in 600 m · ETA 6 min</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border p-3">
          <div>
            <b className="text-sm">Aarav Mehta</b>
            <p className="text-xs text-muted-foreground">Waiting near Metro Gate 2</p>
          </div>
          <Button size="icon" variant="outline">
            <Phone />
          </Button>
        </div>
        <MissionComms side="marshal" />
        <Button
          className="mt-4 h-13 w-full rounded-2xl"
          onClick={() => s.setStage(s.stage === "accepted" ? "enroute" : "onsite")}
        >
          {s.stage === "accepted" ? "Start navigation" : "I’ve arrived"}
          <ArrowRight />
        </Button>
      </div>
    );
  }

  if (s.stage === "onsite") {
    return (
      <Checklist
        title="Safety check before assisting"
        items={[
          "I am visible to approaching traffic",
          "I will not physically intervene",
          "The area is safe enough to assist",
        ]}
        action="Start resolving"
        onAction={() => s.setStage("resolving")}
        danger={s.escalate}
      />
    );
  }

  if (s.stage === "resolving") {
    return (
      <Checklist
        title="Resolve safely and clearly"
        items={[
          "Address the issue safely",
          "Direct traffic safely",
          "Inform requester",
          "Document outcome",
        ]}
        action="Mark resolved"
        onAction={() => s.setStage("resolved")}
        danger={s.escalate}
      />
    );
  }

  if (s.stage === "resolved" || s.stage === "evidence") {
    return (
      <div className="max-h-[52dvh] overflow-y-auto px-5 pb-5">
        <Eyebrow>Complete mission</Eyebrow>
        <h2 className="text-xl font-extrabold">Document the outcome</h2>
        <input
          ref={afterInput}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pickAfter(f);
          }}
        />
        <button
          onClick={() => pickAfter()}
          className={cn(
            "mt-4 grid min-h-32 w-full place-items-center overflow-hidden rounded-2xl border-2 border-dashed p-3",
            photo ? "border-primary bg-accent" : "bg-cream",
          )}
        >
          {photo ? (
            <div className="w-full">
              <img
                src={photo}
                alt="Resolution after photo"
                className="mx-auto h-28 w-full max-w-xs rounded-xl object-cover"
              />
              <b className="mt-2 block text-sm">After-photo ready</b>
              <span className="text-xs text-muted-foreground">Tap to retake</span>
            </div>
          ) : (
            <div>
              <Camera className="mx-auto text-primary" />
              <b className="mt-2 block text-sm">Add required after-photo</b>
            </div>
          )}
        </button>
        <label className="mt-4 block text-xs font-bold">
          Resolution note <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 240))}
          className="mt-2 min-h-24"
          placeholder="What was resolved, and what should the requester know?"
        />
        <p className="text-right text-[10px] text-muted-foreground">{note.length}/240</p>
        <div className="mt-3 rounded-xl bg-orange-soft p-3 text-xs">
          <Bell className="mr-2 inline h-4 w-4 text-primary" />
          {shared
            ? `All ${s.activeJob?.peopleHelped ?? 1} people following this report will receive the verified outcome.`
            : "Aarav will be notified when you submit."}
        </div>
        <Button
          disabled={!photo}
          className="mt-4 h-13 w-full rounded-2xl"
          onClick={() => s.submitEvidence(note, photo ?? undefined)}
        >
          Submit evidence
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5">
      <div className="rounded-3xl bg-orange-soft p-6 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-primary payout-pop" />
        <Eyebrow>Mission earned</Eyebrow>
        <div className="mt-1 text-4xl font-extrabold">₹{s.activeJob?.payout}</div>
        <p className="mt-2 text-xs text-muted-foreground">
          Evidence verified ·{" "}
          {shared ? `${s.activeJob?.peopleHelped ?? 1} people notified` : "Requester notified"}
        </p>
      </div>
      <div className="mt-3">
        <SummaryRow label="Base payout" value="₹450" />
        <SummaryRow label="Platform fee" value="₹0" />
        <SummaryRow label="Total earned" value="₹450" strong />
      </div>
      <Button className="mt-4 h-13 w-full rounded-2xl" onClick={s.archive}>
        Complete payout
      </Button>
    </div>
  );
}
