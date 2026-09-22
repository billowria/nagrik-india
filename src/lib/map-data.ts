import type { HazardId } from "@/lib/traffic-store";

export const CITY_CENTER: [number, number] = [28.5494, 77.2001];

export const hazardCoords: Record<HazardId, [number, number]> = {
  pothole: [28.5521, 77.1944],
  signal: [28.5478, 77.2065],
  waterlogging: [28.5452, 77.1963],
  obstruction: [28.5436, 77.2058],
};

export const userPoint: [number, number] = [28.5494, 77.2001];
export const marshalPoint: [number, number] = [28.5546, 77.2049];
export const marshalPointNear: [number, number] = [28.5509, 77.2018];
export const secondMarshalPoint: [number, number] = [28.5455, 77.1908];

export const routePath: [number, number][] = [
  marshalPoint,
  [28.5535, 77.2032],
  marshalPointNear,
  userPoint,
];

export const landmarks: { label: string; point: [number, number] }[] = [
  { label: "Green Park", point: [28.5583, 77.2062] },
  { label: "Hauz Khas", point: [28.5478, 77.1944] },
];

export interface SafeWalkDestinationPreset {
  id: string;
  name: string;
  shortName: string;
  address: string;
  coordinates: [number, number];
  distanceKm: number;
  durationMin: number;
  safetyScore: number;
  lightingScore: number;
  safeHavens: number;
}

export const safeWalkPresets: SafeWalkDestinationPreset[] = [
  {
    id: "metro",
    name: "Hauz Khas Metro Gate 2",
    shortName: "Metro Gate 2",
    address: "Aurobindo Marg, Hauz Khas",
    coordinates: [28.5478, 77.2065],
    distanceKm: 0.9,
    durationMin: 12,
    safetyScore: 96,
    lightingScore: 94,
    safeHavens: 4,
  },
  {
    id: "residence",
    name: "Green Park Residence",
    shortName: "Home / Residence",
    address: "Block G, Green Park Main",
    coordinates: [28.5583, 77.2062],
    distanceKm: 1.4,
    durationMin: 18,
    safetyScore: 92,
    lightingScore: 88,
    safeHavens: 3,
  },
  {
    id: "market",
    name: "Hauz Khas Market Frontage",
    shortName: "Market Complex",
    address: "Market Road, Hauz Khas",
    coordinates: [28.5452, 77.1963],
    distanceKm: 0.7,
    durationMin: 9,
    safetyScore: 94,
    lightingScore: 96,
    safeHavens: 5,
  },
  {
    id: "office",
    name: "Community Hub & Co-working",
    shortName: "Office / Hub",
    address: "Sri Aurobindo Marg, Kalu Sarai",
    coordinates: [28.5436, 77.2058],
    distanceKm: 1.8,
    durationMin: 22,
    safetyScore: 89,
    lightingScore: 85,
    safeHavens: 3,
  },
];

export function getSafeWalkCorridor(destCoord: [number, number]): [number, number][] {
  const start = userPoint;
  const mid1: [number, number] = [
    start[0] + (destCoord[0] - start[0]) * 0.35 + 0.0008,
    start[1] + (destCoord[1] - start[1]) * 0.35 - 0.0006,
  ];
  const mid2: [number, number] = [
    start[0] + (destCoord[0] - start[0]) * 0.7 + 0.0003,
    start[1] + (destCoord[1] - start[1]) * 0.7 + 0.0004,
  ];
  return [start, mid1, mid2, destCoord];
}

export function interpolateCorridorPosition(
  corridor: [number, number][],
  fraction: number,
): [number, number] {
  if (corridor.length < 2) return userPoint;
  const clamped = Math.max(0, Math.min(1, fraction));
  const totalSegments = corridor.length - 1;
  const segIndex = Math.min(Math.floor(clamped * totalSegments), totalSegments - 1);
  const segFraction = (clamped * totalSegments) - segIndex;
  const p1 = corridor[segIndex];
  const p2 = corridor[segIndex + 1];
  return [
    p1[0] + (p2[0] - p1[0]) * segFraction,
    p1[1] + (p2[1] - p1[1]) * segFraction,
  ];
}
