import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  defaultReportLocation,
  useTraffic,
  type ReportLocation,
  type ReportPriority,
  type RequestMode,
} from "@/lib/traffic-store";
import { getSafeWalkCorridor, safeWalkPresets } from "@/lib/map-data";
import { DevConsole } from "@/features/shared/components/dev-console";
import { Header } from "@/features/shared/components/header";
import { MapView } from "@/features/shared/components/map-view";
import { RequesterNav } from "@/features/shared/components/navigation";
import { CollapsedMapDock, IdleRequest } from "../components/idle-request";
import { RequestFlowSheet } from "../components/request-flow";
import { RequesterStatus } from "../components/requester-status";
import { SafeWalkLive } from "@/features/safewalk/components/safewalk-live";
import { SafeWalkSetupSheet } from "@/features/safewalk/components/safewalk-setup";
import { cn } from "@/lib/utils";

export function RequesterHomePage() {
  const s = useTraffic();
  const [flow, setFlow] = useState(0);
  const [mode, setMode] = useState<RequestMode>("community");
  const [issue, setIssue] = useState("");
  const [detail, setDetail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [affected, setAffected] = useState<string[]>(["Families"]);
  const [priority, setPriority] = useState<ReportPriority>("High");
  const [reportLocation, setReportLocation] = useState<ReportLocation>(defaultReportLocation);
  const [safeWalk, setSafeWalk] = useState(false);
  const [safeWalkStep, setSafeWalkStep] = useState(1);
  const [safeWalkDest, setSafeWalkDest] = useState(safeWalkPresets[0].name);
  const [safeWalkCoord, setSafeWalkCoord] = useState<[number, number]>(safeWalkPresets[0].coordinates);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelDrag, setPanelDrag] = useState(0);
  const dragStart = useRef<number | null>(null);
  const dragMoved = useRef(false);

  const startPanelDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    dragStart.current = e.clientY;
    dragMoved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const movePanelDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragStart.current === null) return;
    const raw = e.clientY - dragStart.current;
    const next = panelOpen ? Math.max(0, raw) : Math.min(0, raw);
    if (Math.abs(next) > 6) dragMoved.current = true;
    setPanelDrag(Math.max(-110, Math.min(150, next)));
  };

  const finishPanelDrag = () => {
    if (dragStart.current === null) return;
    if (panelOpen && panelDrag > 52) setPanelOpen(false);
    if (!panelOpen && panelDrag < -42) setPanelOpen(true);
    dragStart.current = null;
    window.setTimeout(() => {
      dragMoved.current = false;
    }, 0);
    setPanelDrag(0);
  };

  const active = s.stage !== "none";
  const inFlow = flow > 0;
  const isSafeWalkLive = Boolean(s.safeWalk);
  const community = mode === "community";
  const flowLabels = community
    ? ["Issue", "Place", "Evidence", "Context", "Publish"]
    : ["Need", "Place", "Evidence", "Review"];

  const safeWalkRoute = useMemo(() => {
    if (s.safeWalk) {
      const preset =
        safeWalkPresets.find(
          (p) => p.name === s.safeWalk?.destination || p.shortName === s.safeWalk?.destination,
        ) ?? safeWalkPresets[0];
      const path = getSafeWalkCorridor(preset.coordinates);
      const elapsedMin = Math.floor(
        (Date.now() - new Date(s.safeWalk.startedAt).getTime()) / 60000,
      );
      const progress = Math.min(
        0.96,
        Math.max(0.1, elapsedMin / Math.max(1, s.safeWalk.duration) + s.safeWalk.checkIns * 0.08),
      );
      return {
        active: true,
        destination: preset.coordinates,
        destinationName: s.safeWalk.destination,
        path,
        progress,
        isLive: true,
      };
    }
    if (safeWalk) {
      const path = getSafeWalkCorridor(safeWalkCoord);
      return {
        active: true,
        destination: safeWalkCoord,
        destinationName: safeWalkDest,
        path,
        progress: 0,
        isLive: false,
      };
    }
    return null;
  }, [s.safeWalk, safeWalk, safeWalkCoord, safeWalkDest]);

  return (
    <main className="app-shell">
      <div className="relative h-full overflow-hidden">
        <MapView
          radar
          route={["enroute", "onsite", "resolving"].includes(s.stage)}
          search={s.stage === "finding"}
          safeWalkRoute={safeWalkRoute}
        />
        {isSafeWalkLive ? (
          <Header
            showSos={false}
            safeWalkLive={true}
            safeWalkDestination={s.safeWalk?.destination}
            safeWalkEta={s.safeWalk?.duration}
            safeWalkProgress={Math.min(95, Math.max(15, 25 + (s.safeWalk?.checkIns ?? 0) * 15))}
          />
        ) : safeWalk ? (
          <Header
            showSos={false}
            flow={true}
            flowTitle="SafeWalk Companion"
            flowLabels={["Destination", "Protection"]}
            flowCurrentStep={safeWalkStep - 1}
            onFlowBack={() => {
              if (safeWalkStep > 1) {
                setSafeWalkStep(1);
              } else {
                setSafeWalk(false);
              }
            }}
          />
        ) : (
          <Header
            showSos={!inFlow}
            flow={inFlow}
            flowTitle={
              community
                ? "Community report · visible to neighbours"
                : "Personal help · visible to your marshal"
            }
            flowLabels={flowLabels}
            flowCurrentStep={flow - 1}
            onFlowBack={() => setFlow((prev) => (prev <= 1 ? 0 : prev - 1))}
          />
        )}
        <div
          className={cn(
            "requester-bottom-stack",
            inFlow && "flow-mode",
            safeWalk && "safewalk-mode",
          )}
        >
          <section
            className={cn(
              "bottom-sheet requester-sheet civic-entry-sheet",
              !panelOpen && !inFlow && !safeWalk && "civic-sheet-collapsed",
              !panelOpen && (inFlow || safeWalk || active) && "requester-sheet-collapsed",
              panelDrag !== 0 && "is-dragging",
            )}
            style={panelDrag ? { transform: `translateY(${panelDrag}px)` } : undefined}
            aria-label="Civic actions"
          >
            <Button
              variant="ghost"
              aria-label={panelOpen ? "Collapse civic actions" : "Expand civic actions"}
              aria-expanded={panelOpen}
              onPointerDown={startPanelDrag}
              onPointerMove={movePanelDrag}
              onPointerUp={finishPanelDrag}
              onPointerCancel={finishPanelDrag}
              onClick={() => {
                if (!dragMoved.current) setPanelOpen((v) => !v);
              }}
              className="sheet-grabber"
            >
              <span className="sheet-handle" />
            </Button>
            {panelOpen ? (
              safeWalk ? (
                <SafeWalkSetupSheet
                  onClose={() => {
                    setSafeWalk(false);
                    setSafeWalkStep(1);
                  }}
                  destination={safeWalkDest}
                  setDestination={setSafeWalkDest}
                  destCoordinates={safeWalkCoord}
                  setDestCoordinates={setSafeWalkCoord}
                  step={safeWalkStep}
                  setStep={setSafeWalkStep}
                />
              ) : inFlow ? (
                <RequestFlowSheet
                  mode={mode}
                  step={flow}
                  setStep={setFlow}
                  issue={issue}
                  setIssue={setIssue}
                  detail={detail}
                  setDetail={setDetail}
                  photo={photo}
                  setPhoto={setPhoto}
                  affected={affected}
                  setAffected={setAffected}
                  priority={priority}
                  setPriority={setPriority}
                  location={reportLocation}
                  setLocation={setReportLocation}
                />
              ) : active ? (
                s.activeJob?.kind === "safewalk" ? (
                  <SafeWalkLive />
                ) : (
                  <RequesterStatus />
                )
              ) : (
                <IdleRequest
                  onChoose={(next) => {
                    setMode(next);
                    setFlow(1);
                  }}
                  onSafeWalk={() => {
                    setSafeWalk(true);
                    setSafeWalkStep(1);
                  }}
                />
              )
            ) : (
              <CollapsedMapDock
                active={active}
                onExpand={() => setPanelOpen(true)}
                flowStep={inFlow ? flow : undefined}
                flowTotal={inFlow ? flowLabels.length : undefined}
                safeWalkSetup={safeWalk}
              />
            )}
          </section>
          <RequesterNav integrated />
        </div>
      </div>
      <DevConsole />
    </main>
  );
}
