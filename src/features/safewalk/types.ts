import { Footprints, Home, LifeBuoy, Navigation, ShieldCheck, Siren, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

export type SafeWalkProtection = "quiet" | "guarded" | "alert";

export type SafeWalkRouteSegment = {
  id: string;
  label: string;
  minutes: number;
  lighting: number;
  crowd: number;
  risk: number;
};

export type SafeWalkSafetyZone = {
  id: string;
  name: string;
  kind: "metro" | "shop" | "police" | "clinic" | "lit";
  distance: string;
};

export type SafeWalkRiskSignal = {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  distance: string;
};

export type SafeWalkCheckIn = {
  id: string;
  label: string;
  minute: number;
  status: "scheduled" | "done" | "missed";
};

export type SafeWalkSummary = {
  id: string;
  destination: string;
  duration: number;
  safetyScore: number;
  checkIns: number;
  protectionLevel: SafeWalkProtection;
  completedAt: string;
  outcome: "Safe" | "Escalated";
  trustPoints: number;
};

export type AssignedMarshalInfo = {
  id: string;
  name: string;
  badge: string;
  rating: number;
  vehicle: string;
  responseEta: string;
  phone: string;
  status: "standby" | "intercepting";
};

export type SafeWalk = {
  destination: string;
  duration: number;
  contact: string;
  marshalMonitoring: boolean;
  paused: boolean;
  checkIns: number;
  startedAt: string;
  protectionLevel: SafeWalkProtection;
  safetyScore: number;
  routeSegments: SafeWalkRouteSegment[];
  safetyZones: SafeWalkSafetyZone[];
  riskSignals: SafeWalkRiskSignal[];
  checkInPlan: SafeWalkCheckIn[];
  assignedMarshal?: AssignedMarshalInfo | null;
};

export const safeWalkRouteSegments: SafeWalkRouteSegment[] = [
  { id: "metro", label: "Metro Gate 2 stretch", minutes: 4, lighting: 92, crowd: 78, risk: 12 },
  { id: "market", label: "Green Park market lane", minutes: 5, lighting: 86, crowd: 82, risk: 18 },
  { id: "park", label: "District Park edge", minutes: 3, lighting: 68, crowd: 54, risk: 34 },
  { id: "home", label: "Residential arrival lane", minutes: 3, lighting: 74, crowd: 61, risk: 24 },
];

export const safeWalkSafetyZones: SafeWalkSafetyZone[] = [
  { id: "z1", name: "Hauz Khas Metro Gate 2", kind: "metro", distance: "0 m" },
  { id: "z2", name: "Open pharmacy", kind: "shop", distance: "220 m" },
  { id: "z3", name: "Police booth", kind: "police", distance: "480 m" },
  { id: "z4", name: "Lit market frontage", kind: "lit", distance: "710 m" },
];

export const safeWalkRiskSignals: SafeWalkRiskSignal[] = [
  { id: "r1", label: "Low-light park edge", severity: "medium", distance: "520 m" },
  { id: "r2", label: "Reported pothole nearby", severity: "high", distance: "180 m" },
  { id: "r3", label: "Quiet service lane", severity: "low", distance: "840 m" },
];

export function safeWalkScore(protectionLevel: SafeWalkProtection = "guarded") {
  const segmentScore = Math.round(
    safeWalkRouteSegments.reduce(
      (sum, x) => sum + x.lighting * 0.34 + x.crowd * 0.28 + (100 - x.risk) * 0.38,
      0,
    ) / safeWalkRouteSegments.length,
  );
  const protectionBoost = protectionLevel === "alert" ? 8 : protectionLevel === "guarded" ? 5 : 1;
  return Math.min(96, segmentScore + protectionBoost);
}

export function safeWalkCheckPlan(
  duration: number,
  protectionLevel: SafeWalkProtection = "guarded",
): SafeWalkCheckIn[] {
  const cadence = protectionLevel === "alert" ? 4 : protectionLevel === "guarded" ? 5 : 8;
  const points = [];
  for (let minute = cadence; minute < duration; minute += cadence) points.push(minute);
  if (!points.includes(duration)) points.push(duration);
  return points.slice(0, 5).map((minute, i) => ({
    id: `check-${i + 1}`,
    label: i === 0 ? "First check-in" : minute >= duration ? "Arrival check" : "Route check",
    minute,
    status: "scheduled" as const,
  }));
}

export const protectionOptions: {
  id: SafeWalkProtection;
  title: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    id: "quiet",
    title: "Quiet Watch",
    detail: "Trusted circle follows your route",
    icon: Footprints,
  },
  {
    id: "guarded",
    title: "Guarded Walk",
    detail: "Check-ins plus marshal standby",
    icon: ShieldCheck,
  },
  { id: "alert", title: "High Alert", detail: "Closer check-ins and priority SOS", icon: Siren },
];

export const zoneIcon = {
  metro: Navigation,
  shop: Home,
  police: ShieldCheck,
  clinic: LifeBuoy,
  lit: Sparkles,
};
