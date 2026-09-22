import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  LocateFixed,
  MapPin,
  MapPinned,
  Upload,
  Users,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  affectedGroups,
  contextPrompts,
  defaultReportLocation,
  issues,
  mapPinnedLocation,
  useTraffic,
  type ReportLocation,
  type ReportPriority,
  type RequestMode,
} from "@/lib/traffic-store";
import { Eyebrow, Logo, SummaryRow } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { ProgressRail } from "@/features/shared/components/header";
import { MapView } from "@/features/shared/components/map-view";
import { cn } from "@/lib/utils";

export function IssueStep({ issue, setIssue }: { issue: string; setIssue: (x: string) => void }) {
  return (
    <div>
      <Eyebrow>Start with what you can see</Eyebrow>
      <h1 className="mt-2 text-3xl font-extrabold">What needs attention?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose the closest match. Evidence and community context come next.
      </p>
      <div className="mt-6 grid gap-3">
        {issues.map(({ title, desc, urgent, icon: Icon }) => (
          <Button
            variant="outline"
            key={title}
            onClick={() => setIssue(title)}
            className={cn(
              "grid h-auto min-h-20 w-full grid-cols-[auto_1fr_auto] items-center gap-3 whitespace-normal rounded-2xl p-3 text-left",
              issue === title && "border-primary bg-safe-soft ring-2 ring-primary/15",
            )}
          >
            <span
              className={cn(
                "grid h-11 w-11 place-items-center rounded-xl",
                issue === title
                  ? "bg-primary text-primary-foreground"
                  : "bg-orange-soft text-primary",
              )}
            >
              <Icon />
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <b className="text-sm">{title}</b>
                {urgent && (
                  <em className="rounded-full bg-danger-soft px-2 py-0.5 text-[9px] font-extrabold not-italic text-danger">
                    SAFETY
                  </em>
                )}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-muted-foreground">{desc}</span>
            </span>
            <CheckCircle2 className={cn("text-border", issue === title && "text-safe")} />
          </Button>
        ))}
      </div>
    </div>
  );
}

export function LocationStep({
  location,
  setLocation,
}: {
  location: ReportLocation;
  setLocation: (x: ReportLocation) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(location.address);

  return (
    <div>
      <Eyebrow>Step 2 · Exact map pin</Eyebrow>
      <h1 className="mt-2 text-3xl font-extrabold">Mark the exact spot</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Move the map and tap the issue location. The report will appear on that exact point.
      </p>
      <div className="location-picker-map relative mt-5 h-72 overflow-hidden rounded-3xl border">
        <MapView
          pickedLocation={location.coordinates}
          onLocationPick={(coordinates) => {
            const next = mapPinnedLocation(coordinates);
            setLocation(next);
            setDraft(next.address);
          }}
        />
        <div className="location-picker-hint">
          <MapPinned />
          Tap map to drop pin
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Use current location"
          onClick={() => {
            setLocation(defaultReportLocation);
            setDraft(defaultReportLocation.address);
          }}
          className="absolute bottom-4 right-4 z-[520] h-11 w-11 rounded-full bg-card/95 shadow-soft"
        >
          <LocateFixed className="text-primary" />
        </Button>
      </div>
      <div className="mt-4 rounded-2xl border bg-card p-4 shadow-xs">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <span className="location-pin-chip">
            <MapPin />
          </span>
          <div className="min-w-0">
            <b>{location.location}</b>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{location.address}</p>
            <p className="mt-2 text-[10px] font-bold text-primary">
              Lat {location.coordinates[0].toFixed(5)} · Lng {location.coordinates[1].toFixed(5)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="mt-3 text-xs font-bold text-primary"
        >
          {editing ? "Hide address note" : "Edit address note"}
        </button>
        {editing && (
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setLocation({ ...location, address: draft.trim() || location.address })}
            className="mt-3 h-12"
            placeholder="Add landmark or address note"
            autoFocus
          />
        )}
      </div>
    </div>
  );
}

export function PhotoStep({
  photo,
  setPhoto,
}: {
  photo: string | null;
  setPhoto: (x: string | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  const add = (file?: File) => {
    if (!file) {
      input.current?.click();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Eyebrow>Step 3 · Civic evidence</Eyebrow>
      <h1 className="mt-2 text-3xl font-extrabold">Show what is happening</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A clear image helps neighbours understand and marshals prepare. Avoid faces and number
        plates.
      </p>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) add(file);
        }}
      />
      <div
        className={cn(
          "mt-8 grid min-h-72 place-items-center overflow-hidden rounded-3xl border-2 border-dashed bg-card p-6 text-center",
          photo && "border-safe bg-safe-soft",
        )}
      >
        {photo ? (
          <div className="w-full">
            <img
              src={photo}
              alt="Civic issue evidence preview"
              className="mx-auto h-40 w-full max-w-xs rounded-2xl object-cover"
            />
            <CheckCircle2 className="mx-auto mt-4 text-safe" />
            <b className="mt-2 block">Evidence ready for the map</b>
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="outline" onClick={() => add()}>
                <Camera />
                Retake
              </Button>
              <Button variant="ghost" onClick={() => setPhoto(null)}>
                <X />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Camera className="mx-auto h-12 w-12 text-primary" />
            <b className="mt-4 block text-lg">Add visual evidence</b>
            <p className="mt-2 text-xs text-muted-foreground">
              Take a photo or choose one from your device
            </p>
            <Button className="mt-5 rounded-xl" onClick={() => add()}>
              <Upload />
              Choose photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CommunityContext({
  detail,
  setDetail,
  affected,
  setAffected,
  priority,
  setPriority,
}: {
  detail: string;
  setDetail: (x: string) => void;
  affected: string[];
  setAffected: (x: string[]) => void;
  priority: ReportPriority;
  setPriority: (x: ReportPriority) => void;
}) {
  const toggle = (g: string) =>
    setAffected(affected.includes(g) ? affected.filter((x) => x !== g) : [...affected, g]);

  const addPrompt = (p: string) => {
    const base = detail.trim();
    const next = base ? `${base.replace(/\.$/, "")}. ${p}.` : `${p}.`;
    setDetail(next.slice(0, 240));
  };

  return (
    <div>
      <Eyebrow>Step 4 of 5 · Community context</Eyebrow>
      <h1 className="mt-2 text-3xl font-extrabold">Help neighbours understand</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Describe who is affected, what has changed, and why this needs collective attention.
      </p>
      <label htmlFor="community-detail" className="mt-7 block text-xs font-bold">
        What should the community know?
      </label>
      <Textarea
        id="community-detail"
        value={detail}
        onChange={(e) => setDetail(e.target.value.slice(0, 240))}
        className="mt-2 min-h-32 bg-card"
        placeholder="Example: The broken signal makes school crossing unsafe during the evening rush."
      />
      <p className="mt-2 text-right text-[10px] text-muted-foreground">{detail.length}/240</p>
      <p className="mt-3 text-[10px] font-bold text-muted-foreground">Quick add</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {contextPrompts.map((p) => (
          <Button
            key={p}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addPrompt(p)}
            className="h-8 rounded-full px-3 text-[11px]"
          >
            + {p}
          </Button>
        ))}
      </div>
      <p className="mt-6 text-xs font-bold">
        Who is affected?{" "}
        <span className="font-medium text-muted-foreground">({affected.length} selected)</span>
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {affectedGroups.map((g) => {
          const on = affected.includes(g);
          return (
            <button
              key={g}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(g)}
              className={cn(
                "rounded-2xl border bg-card p-3 text-center transition active:scale-95",
                on && "border-primary bg-safe-soft ring-2 ring-primary/15",
              )}
            >
              <Users
                className={cn("mx-auto h-5 w-5", on ? "text-primary" : "text-muted-foreground")}
              />
              <b className="mt-2 block text-[10px] leading-tight">{g}</b>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-xs font-bold">How urgent is this?</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(["High", "Medium", "Low"] as ReportPriority[]).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={priority === p}
            onClick={() => setPriority(p)}
            className={cn(
              "rounded-2xl border bg-card px-2 py-3 text-center text-[11px] font-bold transition active:scale-95",
              priority === p && "border-primary bg-safe-soft ring-2 ring-primary/15",
            )}
          >
            {p}
            <span className="mt-1 block text-[9px] font-medium text-muted-foreground">
              {p === "High" ? "Within 4h" : p === "Medium" ? "Within 12h" : "Within 24h"}
            </span>
          </button>
        ))}
      </div>
      {!detail.trim() && (
        <p className="mt-5 text-[11px] font-bold text-danger">
          Add a short description to continue.
        </p>
      )}
      {detail.trim() && affected.length === 0 && (
        <p className="mt-5 text-[11px] font-bold text-danger">
          Select at least one affected group.
        </p>
      )}
    </div>
  );
}

export function ConfirmStep({
  issue,
  photo,
  community = false,
  detail = "",
  location,
}: {
  issue: string;
  photo: string | null;
  community?: boolean;
  detail?: string;
  location: ReportLocation;
}) {
  return (
    <div>
      <Eyebrow>Final check</Eyebrow>
      <h1 className="mt-2 text-3xl font-extrabold">
        {community ? "Ready for the community map?" : "Ready for personal support?"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {community
          ? "Neighbours can confirm the impact and collectively request one marshal mission."
          : "Only your assigned marshal receives the request details."}
      </p>
      <div className="relative mt-6 h-44 overflow-hidden rounded-3xl border">
        {photo ? (
          <img src={photo} alt="Issue evidence" className="h-full w-full object-cover" />
        ) : (
          <MapView interactive={false} pickedLocation={location.coordinates} />
        )}
      </div>
      <div className="relative -mt-5 rounded-3xl border bg-card/95 p-5 shadow-soft backdrop-blur">
        <SummaryRow label="Issue" value={issue} />
        <SummaryRow label="Location" value={location.address} />
        <SummaryRow
          label="Map pin"
          value={`${location.coordinates[0].toFixed(5)}, ${location.coordinates[1].toFixed(5)}`}
        />
        <SummaryRow label="Evidence" value={photo ? "1 photo attached" : "No photo"} />
        {community ? (
          <>
            <SummaryRow label="Visibility" value="Public civic map" strong />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{detail}</p>
          </>
        ) : (
          <SummaryRow label="Response" value="Nearby verified marshal" strong />
        )}
        <div className="mt-4 flex gap-2 rounded-xl bg-safe-soft p-3 text-xs text-safe">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          {community
            ? "Publishing does not dispatch or charge for a marshal."
            : "Safety details stay within your assistance circle."}
        </div>
      </div>
    </div>
  );
}

export function RequestFlow({
  mode,
  step,
  setStep,
  issue,
  setIssue,
  detail,
  setDetail,
  photo,
  setPhoto,
  location,
  setLocation,
  affected,
  setAffected,
  priority,
  setPriority,
}: {
  mode: RequestMode;
  step: number;
  setStep: (n: number) => void;
  issue: string;
  setIssue: (x: string) => void;
  detail: string;
  setDetail: (x: string) => void;
  photo: string | null;
  setPhoto: (x: string | null) => void;
  location: ReportLocation;
  setLocation: (x: ReportLocation) => void;
  affected: string[];
  setAffected: (x: string[]) => void;
  priority: ReportPriority;
  setPriority: (x: ReportPriority) => void;
}) {
  const s = useTraffic();
  const nav = useNavigate();

  useEffect(() => {
    try {
      window.sessionStorage.setItem("nagrik-install-prompt-hidden", "1");
      window.dispatchEvent(new Event("nagrik-install-prompt-hide"));
    } catch {}
  }, []);

  const community = mode === "community";
  const labels = community
    ? ["Issue", "Place", "Evidence", "Context", "Publish"]
    : ["Need", "Place", "Evidence", "Review"];
  const last = labels.length;
  const disabled =
    (step === 1 && !issue) ||
    (community && step === 3 && !photo) ||
    (community && step === 4 && (!detail.trim() || affected.length === 0));

  const finish = () => {
    if (community) {
      s.publishCommunityReport({
        issue,
        detail: detail.trim(),
        location: location.location,
        address: location.address,
        coordinates: location.coordinates,
        priority,
        impact: affected.length ? affected.join(" · ") : "Neighbourhood",
        ...(photo ? { photoUrl: photo } : {}),
      });
    } else {
      s.createPersonalJob(issue, photo ?? undefined, {
        location: location.location,
        address: location.address,
      });
    }
    setStep(0);
    nav({ to: "/requester/home" });
  };

  return (
    <main className="min-h-dvh bg-cream">
      <header className="flow-header fixed inset-x-3 top-[max(10px,env(safe-area-inset-top))] z-30 mx-auto max-w-md rounded-3xl border bg-card/95 px-4 pb-4 pt-3 shadow-soft backdrop-blur">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label={step === 1 ? "Return to home" : "Go to previous step"}
            onClick={() => setStep(step === 1 ? 0 : step - 1)}
          >
            <ArrowLeft />
          </Button>
          <div className="min-w-0 text-center">
            <div className="mx-auto w-fit">
              <Logo small />
            </div>
            <p className="truncate text-[10px] font-bold text-muted-foreground">
              {community
                ? "Community report · visible to neighbours"
                : "Personal help · visible to your marshal"}
            </p>
          </div>
          <span className="h-11 w-11" />
        </div>
        <ProgressRail labels={labels} current={step - 1} />
      </header>

      <div className="flow-content mx-auto max-w-md px-4">
        {step === 1 && <IssueStep issue={issue} setIssue={setIssue} />}
        {step === 2 && <LocationStep location={location} setLocation={setLocation} />}
        {step === 3 && <PhotoStep photo={photo} setPhoto={setPhoto} />}
        {community && step === 4 && (
          <CommunityContext
            detail={detail}
            setDetail={setDetail}
            affected={affected}
            setAffected={setAffected}
            priority={priority}
            setPriority={setPriority}
          />
        )}
        {step === last && (
          <ConfirmStep
            issue={issue}
            photo={photo}
            community={community}
            detail={detail}
            location={location}
          />
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md bg-gradient-to-t from-cream via-cream to-transparent px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-7">
        <Button
          size="lg"
          disabled={disabled}
          className="h-14 w-full rounded-2xl text-base shadow-warm"
          onClick={() => (step < last ? setStep(step + 1) : finish())}
        >
          {step === last
            ? community
              ? "Publish to Civic Map"
              : "Request personal help"
            : step === 3 && community
              ? "Add community context"
              : "Continue"}
          <ArrowRight />
        </Button>
        {step === 3 && !community && (
          <Button
            variant="ghost"
            onClick={() => setStep(4)}
            className="mt-1 w-full text-xs text-muted-foreground"
          >
            Continue without photo
          </Button>
        )}
      </div>
      <DevConsole />
    </main>
  );
}

export function RequestFlowSheet({
  mode,
  step,
  setStep,
  issue,
  setIssue,
  detail,
  setDetail,
  photo,
  setPhoto,
  location,
  setLocation,
  affected,
  setAffected,
  priority,
  setPriority,
}: {
  mode: RequestMode;
  step: number;
  setStep: (n: number) => void;
  issue: string;
  setIssue: (x: string) => void;
  detail: string;
  setDetail: (x: string) => void;
  photo: string | null;
  setPhoto: (x: string | null) => void;
  location: ReportLocation;
  setLocation: (x: ReportLocation) => void;
  affected: string[];
  setAffected: (x: string[]) => void;
  priority: ReportPriority;
  setPriority: (x: ReportPriority) => void;
}) {
  const s = useTraffic();
  const nav = useNavigate();

  useEffect(() => {
    try {
      window.sessionStorage.setItem("nagrik-install-prompt-hidden", "1");
      window.dispatchEvent(new Event("nagrik-install-prompt-hide"));
    } catch {}
  }, []);

  const community = mode === "community";
  const labels = community
    ? ["Issue", "Place", "Evidence", "Context", "Publish"]
    : ["Need", "Place", "Evidence", "Review"];
  const last = labels.length;
  const disabled =
    (step === 1 && !issue) ||
    (community && step === 3 && !photo) ||
    (community && step === 4 && (!detail.trim() || affected.length === 0));

  const finish = () => {
    if (community) {
      s.publishCommunityReport({
        issue,
        detail: detail.trim(),
        location: location.location,
        address: location.address,
        coordinates: location.coordinates,
        priority,
        impact: affected.length ? affected.join(" · ") : "Neighbourhood",
        ...(photo ? { photoUrl: photo } : {}),
      });
    } else {
      s.createPersonalJob(issue, photo ?? undefined, {
        location: location.location,
        address: location.address,
      });
    }
    setStep(0);
    nav({ to: "/requester/home" });
  };

  return (
    <>


      <div className="requester-flow-scroll">
        {step === 1 && <IssueStep issue={issue} setIssue={setIssue} />}
        {step === 2 && <LocationStep location={location} setLocation={setLocation} />}
        {step === 3 && <PhotoStep photo={photo} setPhoto={setPhoto} />}
        {community && step === 4 && (
          <CommunityContext
            detail={detail}
            setDetail={setDetail}
            affected={affected}
            setAffected={setAffected}
            priority={priority}
            setPriority={setPriority}
          />
        )}
        {step === last && (
          <ConfirmStep
            issue={issue}
            photo={photo}
            community={community}
            detail={detail}
            location={location}
          />
        )}
      </div>

      <div className="requester-flow-cta">
        <Button
          size="lg"
          disabled={disabled}
          className="h-13 w-full rounded-2xl text-sm shadow-warm"
          onClick={() => (step < last ? setStep(step + 1) : finish())}
        >
          {step === last
            ? community
              ? "Publish to Civic Map"
              : "Request personal help"
            : step === 3 && community
              ? "Add community context"
              : "Continue"}
          <ArrowRight />
        </Button>
        {step === 3 && !community && (
          <Button
            variant="ghost"
            onClick={() => setStep(4)}
            className="mt-1 w-full text-xs text-muted-foreground"
          >
            Continue without photo
          </Button>
        )}
      </div>
    </>
  );
}
