import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { Check, HeartHandshake, MapPin, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTraffic, type HazardId, type MapCoordinates } from "@/lib/traffic-store";
import { Avatar, Eyebrow } from "./common";
import { BeforeAfter } from "./before-after";
import { PetitionAdopt } from "@/features/activity/components/petition-adopt";
import { ReportThread } from "@/features/activity/components/report-thread";

import type { SafeWalkMapRoute } from "@/components/live-map";

const LiveMap = lazy(() => import("@/components/live-map"));

export function MapView({
  route = false,
  search = false,
  radar = false,
  interactive = true,
  pickedLocation = null,
  onLocationPick,
  safeWalkRoute = null,
}: {
  route?: boolean;
  search?: boolean;
  radar?: boolean;
  interactive?: boolean;
  pickedLocation?: MapCoordinates | null;
  onLocationPick?: (coordinates: MapCoordinates) => void;
  safeWalkRoute?: SafeWalkMapRoute | null;
}) {
  const s = useTraffic();
  const [selected, setSelected] = useState<HazardId | null>(null);

  useEffect(() => {
    if (s.selectedHazardId) setSelected(s.selectedHazardId);
  }, [s.selectedHazardId]);

  const chosen = s.communityReports.find((h) => h.id === selected);

  return (
    <div className="map-canvas absolute inset-0 overflow-hidden bg-map">
      <ClientOnly
        fallback={
          <div className="absolute inset-0 grid place-items-center bg-map text-[11px] font-bold text-map-label">
            Loading civic map…
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="absolute inset-0 grid place-items-center bg-map text-[11px] font-bold text-map-label">
              Loading civic map…
            </div>
          }
        >
          <LiveMap
            route={route}
            search={search}
            interactive={interactive}
            showControls={interactive}
            radar={radar}
            hazards={s.communityReports.map((h) => ({
              id: h.id,
              title: h.issue,
              verified: h.verified,
              supporters: h.supporters,
              coordinates: h.coordinates,
            }))}
            activeHazardId={s.activeJob?.reportId ?? s.activeJob?.hazardId ?? null}
            focusHazard={chosen ? { id: chosen.id, coordinates: chosen.coordinates } : null}
            pickedLocation={pickedLocation}
            safeWalkRoute={safeWalkRoute}
            {...(onLocationPick ? { onLocationPick } : {})}
            onHazardSelect={(id) => {
              setSelected(id);
              s.selectHazard(id);
            }}
          />
        </Suspense>
      </ClientOnly>

      {radar && chosen && (
        <div className="community-popover absolute inset-x-3 top-[156px] z-[650] rounded-2xl border bg-card/95 shadow-soft backdrop-blur">
          <div className="community-evidence">
            {chosen.photoUrl && chosen.afterPhotoUrl ? (
              <BeforeAfter before={chosen.photoUrl} after={chosen.afterPhotoUrl} />
            ) : chosen.photoUrl ? (
              <img
                src={chosen.photoUrl}
                alt={`Evidence for ${chosen.issue}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="community-photo muted">
                <MapPin />
                <span>Location report</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close report details"
              onClick={() => {
                setSelected(null);
                s.selectHazard(null);
              }}
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-card/90"
            >
              <X />
            </Button>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Eyebrow>
                  {chosen.status === "resolved"
                    ? "Resolved for the community"
                    : "Neighbourhood report"}
                </Eyebrow>
                <h2 className="mt-1 text-base font-extrabold">{chosen.issue}</h2>
              </div>
              <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-primary">
                {chosen.supporters} affected
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{chosen.detail}</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
              <Avatar />
              <span>
                Reported by {chosen.reporter}
                <br />
                {chosen.address}
              </span>
            </div>
            {chosen.status !== "resolved" && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant={chosen.supportedByMe ? "secondary" : "outline"}
                  className="h-11 rounded-xl px-2"
                  onClick={() => s.supportCommunityReport(chosen.id)}
                  disabled={chosen.supportedByMe}
                >
                  <HeartHandshake />
                  {chosen.supportedByMe ? "Supported" : "Affects me"}
                </Button>
                <Button
                  className="h-11 rounded-xl px-2"
                  onClick={() => s.requestMarshalForReport(chosen.id)}
                  disabled={chosen.requestedByMe}
                >
                  {chosen.requestedByMe ? <Check /> : <ShieldCheck />}
                  {chosen.requestedByMe ? "Marshal requested" : "Request marshal"}
                </Button>
              </div>
            )}
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              {chosen.marshalRequests} marshal requests · one mission can help {chosen.supporters}{" "}
              people
            </p>
            <PetitionAdopt report={chosen} />
            <ReportThread report={chosen} />
          </div>
        </div>
      )}
    </div>
  );
}
