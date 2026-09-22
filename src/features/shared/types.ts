export type Stage =
  | "none"
  | "finding"
  | "incoming"
  | "accepted"
  | "enroute"
  | "onsite"
  | "resolving"
  | "resolved"
  | "evidence"
  | "payout"
  | "completed"
  | "escalated";

export type Persona = "requester" | "marshal" | "admin";

export type HazardId = string;

export type VerificationState =
  | "Community reported"
  | "Marshal assigned"
  | "On-site verification"
  | "Evidence verified"
  | "Resolved";

export type NotificationKind = "vouch" | "marshal" | "resolved" | "safewalk" | "comment" | "sos";

export type CivicNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  at: string;
  unread: boolean;
  reportId?: string;
};

export type MissionMessage = {
  id: string;
  from: "requester" | "marshal";
  text: string;
  at: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

export type TrustBadge = {
  id: string;
  title: string;
  detail: string;
  earned: boolean;
};

export const stages: Stage[] = [
  "none",
  "finding",
  "incoming",
  "accepted",
  "enroute",
  "onsite",
  "resolving",
  "resolved",
  "evidence",
  "payout",
  "completed",
];

export const emergencyLines = [
  { label: "National emergency", number: "112", detail: "Police, fire and medical" },
  { label: "Women helpline", number: "1091", detail: "24x7 safety support" },
  { label: "Traffic police", number: "1095", detail: "Road and traffic incidents" },
  { label: "Ambulance", number: "102", detail: "Medical response" },
];

export const stageCopy: Record<Stage, { title: string; sub: string }> = {
  none: { title: "Ready when you need us", sub: "Verified help is nearby" },
  finding: { title: "Finding a nearby marshal", sub: "Searching 8 verified marshals" },
  incoming: { title: "New request waiting", sub: "Civic issue · Hauz Khas" },
  accepted: { title: "Marshal accepted", sub: "Riya is preparing to leave" },
  enroute: { title: "Marshal is en route", sub: "Arriving in about 6 minutes" },
  onsite: { title: "Marshal is on site", sub: "Stay in a safe place nearby" },
  resolving: { title: "Resolving the issue", sub: "Your marshal is working safely" },
  resolved: { title: "Issue resolved", sub: "Evidence is being completed" },
  evidence: { title: "Evidence submitted", sub: "Final checks are underway" },
  payout: { title: "Payout ready", sub: "Job evidence is verified" },
  completed: { title: "Request completed", sub: "Thank you for making communities safer" },
  escalated: { title: "Police support requested", sub: "The incident has been archived" },
};
