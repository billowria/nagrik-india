import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Footprints,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { stageCopy, useTraffic, type RequestMode } from "@/lib/traffic-store";
import { Eyebrow } from "@/features/shared/components/common";
import { timeAgo } from "@/features/shared/components/notification-bell";
import { cn } from "@/lib/utils";

export function LiveWardFeed() {
  const s = useTraffic();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const items = [
    ...s.communityReports
      .filter((r) => r.status !== "resolved")
      .slice(0, 3)
      .map((r) => ({
        id: `f-${r.id}`,
        icon: <Megaphone />,
        title: r.issue,
        meta: `${r.supporters} affected · ${hydrated ? timeAgo(r.createdAt) : "Recently"}`,
        reportId: r.id,
      })),
    ...s.communityReports
      .filter((r) => r.status === "resolved")
      .slice(0, 1)
      .map((r) => ({
        id: `fr-${r.id}`,
        icon: <BadgeCheck />,
        title: `${r.issue} resolved`,
        meta: `Verified · ${r.location}`,
        reportId: r.id,
      })),
    {
      id: "f-marshals",
      icon: <ShieldCheck />,
      title: "8 marshals on duty",
      meta: "Avg response 2.4 min",
      reportId: undefined,
    },
  ];

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <span className="feed-live">
          <i />
          Live in your ward
        </span>
        <small className="text-[10px] font-bold text-muted-foreground">
          {s.communityReports.length} reports on map
        </small>
      </div>
      <div className="ward-feed mt-2">
        {items.map((x) => (
          <button
            key={x.id}
            className="feed-chip"
            onClick={() => {
              if (x.reportId) s.selectHazard(x.reportId);
            }}
          >
            <span>{x.icon}</span>
            <span className="min-w-0 text-left">
              <b className="block truncate">{x.title}</b>
              <em className="block truncate">{x.meta}</em>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function IdleRequest({
  onChoose,
  onSafeWalk,
}: {
  onChoose: (mode: RequestMode) => void;
  onSafeWalk: () => void;
}) {
  return (
    <div className="civic-dock px-4 pb-4">
      <div className="civic-dock-head">
        <div className="min-w-0">
          <Eyebrow>Civic action centre</Eyebrow>
          <h1 className="mt-1 truncate text-lg font-extrabold">How can Nagrik help?</h1>
        </div>
        <span className="marshal-live">
          <i />8 marshals nearby
        </span>
      </div>
      <Button className="civic-action civic-action-community" onClick={() => onChoose("community")}>
        <span className="civic-action-icon">
          <Megaphone />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <b>Report a community issue</b>
          <small>Put evidence on the shared civic map</small>
        </span>
        <ArrowRight className="civic-action-arrow" />
      </Button>
      <div className="civic-action-row">
        <Button
          variant="outline"
          className="civic-action civic-action-personal"
          onClick={() => onChoose("personal")}
        >
          <span className="civic-action-icon">
            <LifeBuoy />
          </span>
          <span>
            <b>Personal help</b>
            <small>Request a marshal now</small>
          </span>
          <ArrowRight className="civic-action-arrow" />
        </Button>
        <Button variant="outline" className="civic-action civic-action-walk" onClick={onSafeWalk}>
          <span className="civic-action-icon">
            <Footprints />
          </span>
          <span>
            <b>SafeWalk</b>
            <small>Share your walk</small>
          </span>
          <ArrowRight className="civic-action-arrow" />
        </Button>
      </div>
      <LiveWardFeed />
    </div>
  );
}

export function CollapsedMapDock({
  active,
  onExpand,
  flowStep,
  flowTotal,
  safeWalkSetup,
}: {
  active: boolean;
  onExpand: () => void;
  flowStep?: number;
  flowTotal?: number;
  safeWalkSetup?: boolean;
}) {
  const s = useTraffic();

  let title: string;
  let subtitle: string;
  let iconActive = active;

  if (flowStep && flowTotal) {
    title = "Report in progress";
    subtitle = `Step ${flowStep} of ${flowTotal}`;
    iconActive = false;
  } else if (safeWalkSetup) {
    title = "SafeWalk setup";
    subtitle = "Configuring your protected walk";
    iconActive = false;
  } else if (active && s.activeJob?.kind === "safewalk") {
    title = "SafeWalk live";
    subtitle = `Walking to ${s.safeWalk?.destination ?? "destination"}`;
    iconActive = true;
  } else if (active) {
    title = stageCopy[s.stage].title;
    subtitle = s.verificationState;
  } else {
    title = "Civic actions";
    subtitle = "Report, request help, or start SafeWalk";
  }

  return (
    <Button
      variant="outline"
      onClick={onExpand}
      aria-label="Show civic actions"
      className="collapsed-map-dock"
    >
      <span className={cn("collapsed-map-icon", iconActive && "active")}>
        {iconActive ? <ShieldCheck /> : flowStep ? <Megaphone /> : safeWalkSetup ? <Footprints /> : <Megaphone />}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <b className="block truncate">{title}</b>
        <small className="block truncate">{subtitle}</small>
      </span>
      <ChevronDown className="rotate-180" />
    </Button>
  );
}
