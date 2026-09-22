import {
  AlertTriangle,
  CircleHelp,
  Navigation,
  Route as RouteIcon,
  ShieldCheck,
  TrafficCone,
  Users,
  Car,
} from "lucide-react";
import type { ComponentType } from "react";

export type ReportComment = {
  id: string;
  author: string;
  text: string;
  at: string;
  kind: "update" | "status" | "system";
};

export type CommunityReport = {
  id: string;
  issue: string;
  detail: string;
  location: string;
  address: string;
  photoUrl?: string;
  afterPhotoUrl?: string;
  reporter: string;
  supporters: number;
  marshalRequests: number;
  supportedByMe: boolean;
  requestedByMe: boolean;
  mine?: boolean;
  verified: boolean;
  status: "open" | "assigned" | "resolved";
  createdAt: string;
  coordinates: [number, number];
  distance: string;
  priority: "High" | "Medium" | "Low";
  impact: string;
  comments: ReportComment[];
  petitionSignatures?: number;
  petitionedByMe?: boolean;
  petitionSent?: boolean;
};

export type ActionPromise = {
  windowHours: number;
  dueAt: string;
  hoursLeft: number;
  overdue: boolean;
  progress: number;
  label: string;
};

export function reportPromise(report: CommunityReport): ActionPromise {
  const windowHours = report.priority === "High" ? 4 : report.priority === "Medium" ? 12 : 24;
  const created = new Date(report.createdAt).getTime();
  const due = created + windowHours * 3600000;
  const now = Date.now();
  const hoursLeft = Math.round(((due - now) / 3600000) * 10) / 10;
  const overdue = hoursLeft <= 0;
  const progress = Math.max(
    4,
    Math.min(100, Math.round(((now - created) / (due - created)) * 100)),
  );
  const label =
    report.status === "resolved"
      ? "Resolved within promise window"
      : report.status === "assigned"
        ? "Marshal on the way"
        : overdue
          ? `Overdue by ${Math.abs(hoursLeft)} h`
          : hoursLeft < 1
            ? `${Math.max(5, Math.round(hoursLeft * 60))} min left to act`
            : `${hoursLeft} h left in action window`;
  return {
    windowHours,
    dueAt: new Date(due).toISOString(),
    hoursLeft,
    overdue,
    progress: report.status === "resolved" ? 100 : progress,
    label,
  };
}

export type RequestMode = "community" | "personal";
export type ReportPriority = "High" | "Medium" | "Low";
export type MapCoordinates = [number, number];

export type ReportLocation = {
  coordinates: MapCoordinates;
  location: string;
  address: string;
};

export const defaultReportLocation: ReportLocation = {
  coordinates: [28.5494, 77.2001],
  location: "Hauz Khas, New Delhi",
  address: "Aurobindo Marg, near Metro Gate 2",
};

export function mapPinnedLocation(coordinates: MapCoordinates): ReportLocation {
  const [lat, lng] = coordinates;
  return {
    coordinates,
    location: "Pinned map location",
    address: `${lat.toFixed(5)}, ${lng.toFixed(5)} · Hauz Khas civic map`,
  };
}

export type CivicIssueOption = {
  title: string;
  desc: string;
  cost: string;
  icon: ComponentType<{ className?: string }>;
  urgent?: boolean;
};

export const issues: CivicIssueOption[] = [
  {
    title: "Pothole or road damage",
    desc: "Flag a dangerous surface or damaged road",
    cost: "₹300–₹450",
    icon: RouteIcon,
  },
  {
    title: "Vehicle breakdown",
    desc: "Engine trouble, flat tyre or stalled vehicle",
    cost: "₹350–₹550",
    icon: Car,
  },
  {
    title: "Traffic signal outage",
    desc: "Report a failed signal and guide traffic safely",
    cost: "₹300–₹450",
    icon: TrafficCone,
  },
  {
    title: "Waterlogging or blocked drain",
    desc: "Mark flooding and help secure the affected area",
    cost: "₹350–₹500",
    icon: Navigation,
  },
  {
    title: "Fallen tree or obstruction",
    desc: "Report debris blocking a road or public path",
    cost: "₹400–₹600",
    urgent: true,
    icon: AlertTriangle,
  },
  {
    title: "Public safety concern",
    desc: "Request trained support for an unsafe civic space",
    cost: "₹400–₹600",
    urgent: true,
    icon: ShieldCheck,
  },
  {
    title: "Civic conflict",
    desc: "Calm support and safe escalation in public spaces",
    cost: "₹400–₹600",
    urgent: true,
    icon: Users,
  },
  {
    title: "Other civic issue",
    desc: "Describe what your Nagrik marshal should assess",
    cost: "Estimate after review",
    icon: CircleHelp,
  },
];

export const affectedGroups = [
  "Families",
  "Pedestrians",
  "Daily commuters",
  "School children",
  "Senior citizens",
  "Shopkeepers",
] as const;

export const contextPrompts = [
  "Unsafe after dark",
  "Blocks the footpath",
  "Getting worse daily",
  "Children cross here",
  "Water logging risk",
] as const;
