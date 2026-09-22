import { useState } from "react";
import { HeartHandshake, Menu, Radar, ShieldCheck, ToggleLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTraffic } from "@/lib/traffic-store";
import {
  HistoryList,
  PromiseMeter,
  StatusCard,
} from "@/features/activity/components/activity-cards";
import { Empty, Page, Segment } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { MarshalNav } from "@/features/shared/components/navigation";
import { timeAgo } from "@/features/shared/components/notification-bell";
import { cn } from "@/lib/utils";

export function MissionRadar() {
  const s = useTraffic();

  if (s.activeJob) return <StatusCard marshal />;

  if (!s.marshalOnline)
    return (
      <Empty
        icon={ToggleLeft}
        title="You’re offline"
        text="Go online from Home to see open civic needs nearby."
      />
    );

  const needs = s.openNeeds;

  return (
    <>
      <div className="radar-head mt-4">
        <span className="radar-icon">
          <Radar />
        </span>
        <div className="min-w-0">
          <b className="block text-sm">Open civic needs in your sector</b>
          <small className="text-muted-foreground">
            {needs.length} reports · sorted by distance and impact
          </small>
        </div>
      </div>
      {needs.length ? (
        <div className="mt-3 grid gap-2">
          {needs.map((r) => (
            <div key={r.id} className="need-card">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className={cn("need-priority", r.priority === "High" && "high")}>
                    {r.priority} impact · {r.impact}
                  </span>
                  <b className="mt-1 block truncate text-sm">{r.issue}</b>
                  <small className="block truncate text-muted-foreground">{r.address}</small>
                </div>
                <div className="shrink-0 text-right">
                  <b className="block text-sm text-primary">₹450</b>
                  <small className="text-muted-foreground">{r.distance}</small>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1 text-safe">
                  <Users className="h-3 w-3" />
                  {r.supporters} affected
                </span>
                <span className="flex items-center gap-1">
                  <HeartHandshake className="h-3 w-3" />
                  {r.marshalRequests} requests
                </span>
                <span>{timeAgo(r.createdAt)}</span>
              </div>
              <PromiseMeter report={r} />
              <Button
                className="mt-3 h-11 w-full rounded-xl"
                onClick={() => s.claimReportMission(r.id)}
              >
                <ShieldCheck />
                Claim community mission
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon={Menu}
          title="No open needs nearby"
          text="New community reports in your sector will appear here."
        />
      )}
    </>
  );
}

export function MarshalRequestsPage() {
  const [tab, setTab] = useState<"requests" | "history">("requests");

  return (
    <Page title="Requests" eyebrow="Mission queue" nav={<MarshalNav />}>
      <Segment
        value={tab}
        setValue={(v) => setTab(v as "requests" | "history")}
        items={["requests", "history"]}
      />
      {tab === "requests" ? (
        <MissionRadar />
      ) : (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {["All", "Completed", "Escalated", "Date range"].map((x, i) => (
              <button
                key={x}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-2 text-xs font-bold",
                  i === 0 && "bg-orange-soft text-primary",
                )}
              >
                {x}
              </button>
            ))}
          </div>
          <HistoryList />
        </>
      )}
      <DevConsole />
    </Page>
  );
}
