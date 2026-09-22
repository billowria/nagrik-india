import { useEffect, useState } from "react";
import {
  Bike,
  Check,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { stageCopy, useTraffic } from "@/lib/traffic-store";
import { Avatar, Eyebrow } from "@/features/shared/components/common";
import { cn } from "@/lib/utils";

export function EtaTicker() {
  const s = useTraffic();

  useEffect(() => {
    if (s.stage !== "enroute") return;
    const t = window.setInterval(() => s.setEta(Math.max(0, s.etaMinutes - 1)), 9000);
    return () => window.clearInterval(t);
  }, [s]);

  const arrived = s.etaMinutes <= 0;

  return (
    <div className="eta-card">
      <span className="eta-icon">
        <Bike />
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-sm">
          {arrived ? "Marshal has arrived" : `Arriving in about ${s.etaMinutes} min`}
        </b>
        <small className="text-muted-foreground">
          On Aurobindo Marg · green motorcycle, reflective vest
        </small>
        <div className="eta-track">
          <i style={{ width: `${Math.min(100, Math.max(8, ((6 - s.etaMinutes) / 6) * 100))}%` }} />
        </div>
      </div>
    </div>
  );
}

const commsLines = {
  requester: [
    "I’m waiting under the street lamp",
    "Traffic is moving fast here",
    "I’ve moved to a safe spot",
  ],
  marshal: [
    "I’m on a green motorcycle with a reflective vest",
    "Arriving at Metro Gate 2 in 2 mins",
    "Setting up warning cones now",
  ],
};

export function MissionComms({ side }: { side: "requester" | "marshal" }) {
  const s = useTraffic();
  const [open, setOpen] = useState(false);
  const lines = commsLines[side];

  return (
    <div className="comms-block">
      <Button
        variant="outline"
        onClick={() => setOpen((v) => !v)}
        className="h-11 w-full justify-between rounded-xl"
      >
        <span className="flex items-center gap-2 text-xs font-extrabold">
          <MessageCircle className="h-4 w-4 text-primary" />
          Safety messages{s.messages.length ? ` · ${s.messages.length}` : ""}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>
      {open && (
        <div className="mt-2 rounded-2xl border bg-card p-3">
          <div className="comms-log">
            {s.messages.length ? (
              s.messages.map((m) => (
                <div key={m.id} className={cn("comms-bubble", m.from === side && "mine")}>
                  <b>{m.from === "marshal" ? "Marshal Riya" : "Aarav"}</b>
                  <span>{m.text}</span>
                </div>
              ))
            ) : (
              <p className="py-3 text-center text-[11px] text-muted-foreground">
                Send a quick safety update below.
              </p>
            )}
          </div>
          <div className="mt-2 grid gap-1.5">
            {lines.map((l) => (
              <button key={l} onClick={() => s.sendMissionMessage(side, l)} className="comms-quick">
                {l}
                <Send className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Rating() {
  const s = useTraffic();
  const done = s.requesterRating > 0;

  return (
    <div className="mt-4 rounded-2xl border p-4 text-center">
      <b>How was your Nagrik?</b>
      <div className="mt-3 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} aria-label={`${n} stars`} onClick={() => s.rate(n)}>
            <Star
              className={cn(
                "h-7 w-7",
                n <= s.requesterRating ? "fill-primary text-primary" : "text-border",
              )}
            />
          </button>
        ))}
      </div>
      <Button className="mt-4 h-12 w-full rounded-2xl" disabled={!done} onClick={s.reset}>
        <Check />
        Submit rating & finish
      </Button>
      <Button variant="ghost" className="mt-1 w-full text-xs" onClick={s.reset}>
        Skip & back to home
      </Button>
    </div>
  );
}

export function RequesterStatus() {
  const s = useTraffic();
  const c = stageCopy[s.stage];
  const shared = s.activeJob?.kind === "community";

  return (
    <div className="px-5 pb-5">
      <div className="flex gap-3">
        <span
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
            s.stage === "finding" ? "bg-orange-soft text-primary" : "bg-safe-soft text-safe",
          )}
        >
          {shared ? (
            <Users />
          ) : s.stage === "finding" ? (
            <RefreshCw className="animate-spin" />
          ) : (
            <CheckCircle2 />
          )}
        </span>
        <div className="min-w-0">
          <Eyebrow>
            {shared ? "Community mission" : "Personal request"} · {s.activeJob?.id}
          </Eyebrow>
          <h1 className="text-xl font-extrabold">{c.title}</h1>
          <p className="text-xs text-muted-foreground">
            {shared
              ? `${s.activeJob?.peopleHelped ?? 1} neighbours connected · one shared response`
              : c.sub}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-soft px-2 py-1 text-[10px] font-bold text-primary">
            <ShieldCheck className="h-3 w-3" />
            {s.verificationState}
          </span>
        </div>
      </div>

      {s.stage !== "finding" && (
        <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-cream p-3">
          <Avatar />
          <div>
            <b className="text-sm">Riya Sharma</b>
            <p className="text-xs text-muted-foreground">
              <Star className="inline h-3 w-3 fill-primary text-primary" /> 4.9 · Community Marshal
            </p>
          </div>
          <Button size="icon" variant="outline" aria-label="Call marshal">
            <Phone />
          </Button>
        </div>
      )}

      {["accepted", "enroute"].includes(s.stage) && <EtaTicker />}
      {["accepted", "enroute", "onsite", "resolving"].includes(s.stage) && (
        <MissionComms side="requester" />
      )}
      {s.stage === "completed" && <Rating />}
      {s.stage !== "completed" && (
        <Button variant="ghost" onClick={s.reset} className="mt-2 w-full text-xs text-danger">
          Cancel request
        </Button>
      )}
    </div>
  );
}
