import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Minus, Plus, LocateFixed, AlertTriangle, BadgeCheck } from "lucide-react";
import {
  CITY_CENTER,
  interpolateCorridorPosition,
  marshalPoint,
  marshalPointNear,
  routePath,
  secondMarshalPoint,
  userPoint,
} from "@/lib/map-data";
import { cn } from "@/lib/utils";

export interface SafeWalkMapRoute {
  active: boolean;
  destination: [number, number];
  destinationName: string;
  path: [number, number][];
  progress?: number;
  isLive?: boolean;
}

export type LiveMapHazard = {
  id: string;
  title: string;
  verified: boolean;
  supporters: number;
  coordinates: [number, number];
};

function CorridorFitter({ corridor }: { corridor?: [number, number][] | null }) {
  const map = useMap();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!corridor || corridor.length < 2) return;
    const key = `${corridor[0].join(",")}-${corridor[corridor.length - 1].join(",")}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    try {
      map.fitBounds(corridor, { padding: [60, 60], maxZoom: 16, animate: true, duration: 0.8 });
    } catch {}
  }, [corridor, map]);

  return null;
}

const pin = (html: string, cls: string, size: number) =>
  divIcon({ html, className: cls, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });

const hazardGlyph = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
const verifiedBadge = `<span class="hazard-verified-badge"><svg viewBox="0 0 24 24" width="7" height="7" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-9"/></svg></span>`;
const bikeGlyph = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
const pickerGlyph = `<span class="leaflet-picker"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg></span>`;

type LayerKey = "hazards" | "verified";

function MapControls({
  onRecenter,
  radar,
  layers,
  toggleLayer,
}: {
  onRecenter: () => void;
  radar?: boolean;
  layers: Record<LayerKey, boolean>;
  toggleLayer: (key: LayerKey) => void;
}) {
  const map = useMap();
  return (
    <div className="map-controls absolute right-3 top-[156px] z-[500] flex flex-col gap-1">
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
        className="grid h-10 w-10 place-items-center rounded-xl border border-border/80 bg-card/92 text-foreground shadow-sm backdrop-blur active:scale-95"
      >
        <Plus className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
        className="grid h-10 w-10 place-items-center rounded-xl border border-border/80 bg-card/92 text-foreground shadow-sm backdrop-blur active:scale-95"
      >
        <Minus className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        aria-label="Recenter map"
        onClick={onRecenter}
        className="grid h-10 w-10 place-items-center rounded-xl border border-border/80 bg-card/92 text-foreground shadow-sm backdrop-blur active:scale-95"
      >
        <LocateFixed className="h-4 w-4" strokeWidth={2.2} />
      </button>
      {radar && (
        <>
          <button
            type="button"
            aria-label="Community reports"
            title="Community reports"
            aria-pressed={layers.hazards}
            onClick={() => toggleLayer("hazards")}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl border shadow-sm backdrop-blur active:scale-95",
              layers.hazards
                ? "border-primary/60 bg-primary text-primary-foreground"
                : "border-border/80 bg-card/92 text-foreground",
            )}
          >
            <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="Verified reports"
            title="Verified reports"
            aria-pressed={layers.verified}
            onClick={() => toggleLayer("verified")}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl border shadow-sm backdrop-blur active:scale-95",
              layers.verified
                ? "border-primary/60 bg-primary text-primary-foreground"
                : "border-border/80 bg-card/92 text-foreground",
            )}
          >
            <BadgeCheck className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </>
      )}
    </div>
  );
}

function Recenter({ register }: { register: (fn: () => void) => void }) {
  const map = useMap();
  register(() => map.flyTo(CITY_CENTER, 15, { duration: 0.7 }));
  return null;
}

export type LiveMapFocus = { id: string; coordinates: [number, number] } | null;

function FocusFlyer({ focus }: { focus: LiveMapFocus }) {
  const map = useMap();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (focus && focus.id !== last.current) {
      last.current = focus.id;
      map.flyTo(focus.coordinates, Math.max(map.getZoom(), 16), { duration: 1.1 });
    }
    if (!focus) last.current = null;
  }, [focus, map]);
  return null;
}

function LocationPicker({ onPick }: { onPick: (coordinates: [number, number]) => void }) {
  useMapEvents({
    click: (event) => {
      if (!onPick) return;
      onPick([Number(event.latlng.lat.toFixed(5)), Number(event.latlng.lng.toFixed(5))]);
    },
  });
  return null;
}

export default function LiveMap({
  route = false,
  search = false,
  interactive = true,
  radar = false,
  hazards = [],
  activeHazardId,
  onHazardSelect,
  showControls = true,
  focusHazard = null,
  pickedLocation = null,
  onLocationPick,
  safeWalkRoute = null,
}: {
  route?: boolean;
  search?: boolean;
  interactive?: boolean;
  radar?: boolean;
  hazards?: LiveMapHazard[];
  activeHazardId?: string | null;
  onHazardSelect?: (id: string) => void;
  showControls?: boolean;
  focusHazard?: LiveMapFocus;
  pickedLocation?: [number, number] | null;
  onLocationPick?: (coordinates: [number, number]) => void;
  safeWalkRoute?: SafeWalkMapRoute | null;
}) {
  let recenter = () => {};
  const [layers, setLayers] = useState({ hazards: true, verified: true });
  const visibleHazards = useMemo(() => {
    if (!radar || !layers.hazards) return [];
    return hazards.filter((h) => layers.verified || !h.verified);
  }, [radar, layers, hazards]);
  const icons = useMemo(
    () => ({
      user: pin(
        `<span class="leaflet-user${search ? " searching" : ""}"></span>`,
        "leaflet-pin",
        34,
      ),
      marshal: pin(`<span class="leaflet-marshal">${bikeGlyph}</span>`, "leaflet-pin", 34),
      marshalMini: pin(`<span class="leaflet-marshal mini">${bikeGlyph}</span>`, "leaflet-pin", 30),
    }),
    [search],
  );

  const liveUserCoord = useMemo(() => {
    if (safeWalkRoute?.active && safeWalkRoute.isLive && safeWalkRoute.path.length > 1) {
      return interpolateCorridorPosition(safeWalkRoute.path, safeWalkRoute.progress ?? 0);
    }
    return userPoint;
  }, [safeWalkRoute]);

  const destIcon = useMemo(() => {
    if (!safeWalkRoute?.active) return null;
    const label = safeWalkRoute.destinationName || "Destination";
    return pin(
      `<div class="safewalk-dest-pin"><span class="pin-radar"></span><span class="pin-core"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></span><span class="dest-chip">${label}</span></div>`,
      "leaflet-pin",
      42,
    );
  }, [safeWalkRoute?.active, safeWalkRoute?.destinationName]);

  const liveWalkerIcon = useMemo(() => {
    return pin(
      `<div class="safewalk-walker-pin"><span class="walker-pulse"></span><span class="walker-core"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="5" r="2.5"/><path d="m9 20 3-6 2 3 3 3"/><path d="m6 17 3-5 2.5 2 3-5"/></svg></span></div>`,
      "leaflet-pin",
      38,
    );
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", !interactive && "pointer-events-none")}>
      <MapContainer
        center={CITY_CENTER}
        zoom={15}
        minZoom={12}
        maxZoom={18}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        className={cn("nagrik-map h-full w-full", onLocationPick && "cursor-crosshair")}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {route && (
          <Polyline
            positions={routePath}
            pathOptions={{ color: "#2563eb", weight: 4, dashArray: "8 10", opacity: 0.9 }}
          />
        )}
        {safeWalkRoute?.active && safeWalkRoute.path.length > 0 && (
          <>
            <Polyline
              positions={safeWalkRoute.path}
              pathOptions={{
                color: "#38bdf8",
                weight: 12,
                opacity: 0.38,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <Polyline
              positions={safeWalkRoute.path}
              pathOptions={{
                color: "#0284c7",
                weight: 5,
                opacity: 0.95,
                dashArray: "10 12",
                lineCap: "round",
              }}
            />
            {destIcon && (
              <Marker
                position={safeWalkRoute.destination}
                icon={destIcon}
                interactive={false}
              />
            )}
          </>
        )}
        {visibleHazards.map((h) => (
          <Marker
            key={h.id}
            position={h.coordinates}
            icon={pin(
              `<span class="leaflet-hazard ${h.verified ? "verified" : ""} ${activeHazardId === h.id ? "active-hazard" : ""}">${hazardGlyph}<b>${h.supporters}</b>${h.verified ? verifiedBadge : ""}</span>`,
              "leaflet-pin",
              28,
            )}
            eventHandlers={{ click: () => onHazardSelect?.(h.id) }}
            title={h.title}
          />
        ))}
        <Marker
          position={liveUserCoord}
          icon={safeWalkRoute?.isLive ? liveWalkerIcon : icons.user}
          interactive={false}
        />
        <CorridorFitter corridor={safeWalkRoute?.active ? safeWalkRoute.path : null} />
        <Marker
          position={route ? marshalPointNear : marshalPoint}
          icon={icons.marshal}
          interactive={false}
        />
        <Marker position={secondMarshalPoint} icon={icons.marshalMini} interactive={false} />
        {pickedLocation && (
          <Marker
            position={pickedLocation}
            icon={pin(pickerGlyph, "leaflet-pin", 42)}
            interactive={false}
          />
        )}
        <Recenter
          register={(fn) => {
            recenter = fn;
          }}
        />
        <FocusFlyer focus={focusHazard} />
        {onLocationPick && <LocationPicker onPick={onLocationPick} />}
        {showControls && interactive && (
          <MapControls
            onRecenter={() => recenter()}
            radar={radar}
            layers={layers}
            toggleLayer={(key) => setLayers((l) => ({ ...l, [key]: !l[key] }))}
          />
        )}
      </MapContainer>
      <span className="map-credit">© OpenStreetMap</span>
    </div>
  );
}
