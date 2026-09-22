import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  Stage,
  Persona,
  HazardId,
  VerificationState,
  NotificationKind,
  CivicNotification,
  MissionMessage,
  EmergencyContact,
  TrustBadge,
} from "@/features/shared/types";
import { stages, emergencyLines, stageCopy } from "@/features/shared/types";
import type {
  CommunityReport,
  ReportComment,
  ActionPromise,
  ReportLocation,
  RequestMode,
  ReportPriority,
  MapCoordinates,
} from "@/features/requester/types";
import {
  reportPromise,
  defaultReportLocation,
  mapPinnedLocation,
  issues,
  affectedGroups,
  contextPrompts,
} from "@/features/requester/types";
import type {
  SafeWalkProtection,
  SafeWalkRouteSegment,
  SafeWalkSafetyZone,
  SafeWalkRiskSignal,
  SafeWalkCheckIn,
  SafeWalkSummary,
  SafeWalk,
} from "@/features/safewalk/types";
import {
  safeWalkRouteSegments,
  safeWalkSafetyZones,
  safeWalkRiskSignals,
  safeWalkScore,
  safeWalkCheckPlan,
  protectionOptions,
  zoneIcon,
} from "@/features/safewalk/types";
import type { Job, PatrolShift } from "@/features/marshal/types";
import { patrolShifts } from "@/features/marshal/types";
import type { Ward } from "@/features/activity/types";
import { petitionGoal, wardSeed } from "@/features/activity/types";

export type {
  Stage,
  Persona,
  HazardId,
  VerificationState,
  NotificationKind,
  CivicNotification,
  MissionMessage,
  EmergencyContact,
  TrustBadge,
  CommunityReport,
  ReportComment,
  ActionPromise,
  ReportLocation,
  RequestMode,
  ReportPriority,
  MapCoordinates,
  SafeWalkProtection,
  SafeWalkRouteSegment,
  SafeWalkSafetyZone,
  SafeWalkRiskSignal,
  SafeWalkCheckIn,
  SafeWalkSummary,
  SafeWalk,
  Job,
  PatrolShift,
  Ward,
};

export {
  stages,
  emergencyLines,
  stageCopy,
  reportPromise,
  defaultReportLocation,
  mapPinnedLocation,
  issues,
  affectedGroups,
  contextPrompts,
  safeWalkRouteSegments,
  safeWalkSafetyZones,
  safeWalkRiskSignals,
  safeWalkScore,
  safeWalkCheckPlan,
  protectionOptions,
  zoneIcon,
  patrolShifts,
  petitionGoal,
  wardSeed,
};

type State = {
  persona: Persona;
  stage: Stage;
  activeJob: Job | null;
  selectedHazardId: HazardId | null;
  safeWalk: SafeWalk | null;
  communityReports: CommunityReport[];
  history: Job[];
  notifications: CivicNotification[];
  messages: MissionMessage[];
  emergencyContacts: EmergencyContact[];
  sos: { active: boolean; startedAt: string } | null;
  etaMinutes: number;
  supportsGiven: number;
  reportsFiled: number;
  safeWalksDone: number;
  marshalOnline: boolean;
  kyc: "new" | "review" | "approved";
  trainingComplete: boolean;
  earnings: number;
  withdrawals: number;
  requesterRating: number;
  notificationsEnabled: boolean;
  adoptedSpots: string[];
  patrolsJoined: string[];
  safeWalkHistory: SafeWalkSummary[];
};

const ago = (m: number) => new Date(Date.now() - m * 60000).toISOString();
const seedComments = (author: string, text: string): ReportComment[] => [
  { id: `c-${author}-1`, author, text, at: ago(6), kind: "update" },
];
const seedReports: CommunityReport[] = [
  {
    id: "pothole",
    issue: "Pothole or road damage",
    detail: "Deep road damage near the bus lane.",
    location: "Hauz Khas, New Delhi",
    address: "Aurobindo Marg, near Metro Gate 2",
    reporter: "Meera",
    supporters: 4,
    marshalRequests: 1,
    supportedByMe: false,
    requestedByMe: false,
    verified: false,
    status: "open",
    createdAt: ago(8),
    coordinates: [28.5521, 77.1944],
    distance: "180 m",
    priority: "High",
    impact: "Daily commuters",
    comments: seedComments("Meera", "Two scooters skidded here this morning."),
    petitionSignatures: 46,
  },
  {
    id: "signal",
    issue: "Traffic signal outage",
    detail: "Pedestrian signal is not working.",
    location: "Green Park, New Delhi",
    address: "Green Park crossing",
    reporter: "Kabir",
    supporters: 7,
    marshalRequests: 2,
    supportedByMe: false,
    requestedByMe: false,
    verified: true,
    status: "open",
    createdAt: ago(14),
    coordinates: [28.5478, 77.2065],
    distance: "420 m",
    priority: "High",
    impact: "School zone",
    comments: seedComments("Kabir", "Children cross here at 3 pm without any signal."),
    petitionSignatures: 31,
  },
  {
    id: "waterlogging",
    issue: "Waterlogging or blocked drain",
    detail: "Water is covering most of the footpath.",
    location: "Hauz Khas, New Delhi",
    address: "K Block market lane",
    reporter: "Sana",
    supporters: 3,
    marshalRequests: 0,
    supportedByMe: false,
    requestedByMe: false,
    verified: false,
    status: "open",
    createdAt: ago(22),
    coordinates: [28.5452, 77.1963],
    distance: "650 m",
    priority: "Medium",
    impact: "Pedestrians",
    comments: seedComments("Sana", "Drain is blocked with leaves near the shop."),
    petitionSignatures: 12,
  },
  {
    id: "obstruction",
    issue: "Fallen tree or obstruction",
    detail: "A branch blocks the public walking path.",
    location: "Hauz Khas, New Delhi",
    address: "District Park entrance",
    reporter: "Vikram",
    supporters: 5,
    marshalRequests: 1,
    supportedByMe: false,
    requestedByMe: false,
    verified: true,
    status: "open",
    createdAt: ago(31),
    coordinates: [28.5436, 77.2058],
    distance: "900 m",
    priority: "Medium",
    impact: "Families",
    comments: seedComments("Vikram", "Walkers are stepping onto the road to pass."),
    petitionSignatures: 9,
  },
];
const seedNotifications: CivicNotification[] = [
  {
    id: "n1",
    kind: "vouch",
    title: "4 neighbours vouched for a pothole report",
    description: "Aurobindo Marg, near Metro Gate 2 · tap to open on the map",
    at: ago(4),
    unread: true,
    reportId: "pothole",
  },
  {
    id: "n2",
    kind: "marshal",
    title: "Marshal Riya is reviewing the signal outage",
    description: "Green Park crossing · 7 people following",
    at: ago(18),
    unread: true,
    reportId: "signal",
  },
  {
    id: "n3",
    kind: "resolved",
    title: "Waterlogging cleared in K Block",
    description: "Verified with an after photo by a community marshal",
    at: ago(52),
    unread: false,
    reportId: "waterlogging",
  },
  {
    id: "n4",
    kind: "safewalk",
    title: "SafeWalk summary ready",
    description: "Your last companion walk finished safely with 3 check-ins",
    at: ago(140),
    unread: false,
  },
];
const seedContacts: EmergencyContact[] = [
  { id: "e1", name: "Priya Mehta", relation: "Sister", phone: "+91 98100 44221" },
  { id: "e2", name: "Kabir Mehta", relation: "Brother", phone: "+91 98910 77882" },
];
const seedSafeWalkHistory: SafeWalkSummary[] = [
  {
    id: "sw-prev-1",
    destination: "Green Park market",
    duration: 14,
    safetyScore: 88,
    checkIns: 3,
    protectionLevel: "guarded",
    completedAt: ago(140),
    outcome: "Safe",
    trustPoints: 34,
  },
];

const initial: State = {
  persona: "requester",
  stage: "none",
  activeJob: null,
  selectedHazardId: null,
  safeWalk: null,
  communityReports: seedReports,
  history: [],
  notifications: seedNotifications,
  messages: [],
  emergencyContacts: seedContacts,
  sos: null,
  etaMinutes: 6,
  supportsGiven: 2,
  reportsFiled: 1,
  safeWalksDone: 1,
  marshalOnline: true,
  kyc: "new",
  trainingComplete: false,
  earnings: 2840,
  withdrawals: 1000,
  requesterRating: 0,
  notificationsEnabled: true,
  adoptedSpots: ["signal"],
  patrolsJoined: [],
  safeWalkHistory: seedSafeWalkHistory,
};
const order: Stage[] = [
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
const demoJob = (): Job => ({
  id: `NG-${Math.floor(1000 + Math.random() * 8999)}`,
  kind: "personal",
  issue: "Personal civic assistance",
  requester: "Aarav Mehta",
  location: "Hauz Khas, New Delhi",
  address: "Aurobindo Marg, near Hauz Khas Metro Gate 2, New Delhi 110016",
  payout: 450,
  createdAt: new Date().toISOString(),
});
const uid = (p: string) => `${p}-${Date.now()}-${Math.floor(Math.random() * 999)}`;
type CommunityInput = Pick<
  CommunityReport,
  "issue" | "detail" | "location" | "address" | "photoUrl"
> & { coordinates?: [number, number]; priority?: CommunityReport["priority"]; impact?: string };
type Store = State & {
  verificationState: VerificationState;
  unreadCount: number;
  trustScore: number;
  trustTier: string;
  badges: TrustBadge[];
  myReports: CommunityReport[];
  openNeeds: CommunityReport[];
  wards: Ward[];
  adoptedReports: CommunityReport[];
  marshalXp: number;
  marshalLevel: number;
  marshalLevelTitle: string;
  marshalNextXp: number;
  marshalStreak: number;
  topResponder: boolean;
  setPersona: (p: Persona) => void;
  setStage: (s: Stage) => void;
  selectHazard: (id: HazardId | null) => void;
  publishCommunityReport: (input: CommunityInput) => string;
  supportCommunityReport: (id: string) => void;
  requestMarshalForReport: (id: string) => void;
  claimReportMission: (id: string) => void;
  addReportComment: (id: string, text: string, author?: string) => void;
  createPersonalJob: (
    issue: string,
    photoUrl?: string,
    location?: Pick<Job, "location" | "address">,
  ) => void;
  createJob: (issue?: string, hazardId?: HazardId) => void;
  startSafeWalk: (
    input: Pick<
      SafeWalk,
      "destination" | "duration" | "contact" | "marshalMonitoring" | "protectionLevel"
    >,
  ) => void;
  toggleSafeWalkPause: () => void;
  safeWalkCheckIn: () => void;
  finishSafeWalk: () => void;
  triggerMarshalIntercept: () => void;
  sendMissionMessage: (from: "requester" | "marshal", text: string) => void;
  clearMessages: () => void;
  setEta: (m: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  pushNotification: (n: Omit<CivicNotification, "id" | "at" | "unread">) => void;
  addEmergencyContact: (c: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (id: string) => void;
  triggerSos: () => void;
  cancelSos: () => void;
  advance: () => void;
  reset: () => void;
  accept: () => void;
  decline: () => void;
  escalate: () => void;
  submitEvidence: (note?: string, afterPhotoUrl?: string) => void;
  archive: () => void;
  setOnline: (v: boolean) => void;
  approveKyc: () => void;
  submitKyc: () => void;
  completeTraining: () => void;
  withdraw: (amount: number) => boolean;
  rate: (n: number) => void;
  toggleNotifications: () => void;
  signPetition: (id: string) => void;
  toggleAdoptSpot: (id: string) => void;
  joinPatrol: (id: string) => void;
};
const Ctx = createContext<Store | null>(null);

export function TrafficProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("nagrik-state") ?? localStorage.getItem("trafficmitra-state");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<State>;
        setState({
          ...initial,
          ...parsed,
          communityReports: parsed.communityReports?.length
            ? parsed.communityReports.map((r) => ({
                ...r,
                comments: r.comments ?? [],
                distance: r.distance ?? "350 m",
                priority: r.priority ?? "Medium",
                impact: r.impact ?? "Neighbourhood",
                petitionSignatures: r.petitionSignatures ?? r.supporters * 3,
                petitionedByMe: r.petitionedByMe ?? false,
                petitionSent: r.petitionSent ?? false,
              }))
            : seedReports,
          notifications: parsed.notifications?.length ? parsed.notifications : seedNotifications,
          emergencyContacts: parsed.emergencyContacts?.length
            ? parsed.emergencyContacts
            : seedContacts,
          safeWalkHistory: parsed.safeWalkHistory?.length
            ? parsed.safeWalkHistory
            : seedSafeWalkHistory,
          safeWalk: parsed.safeWalk
            ? {
                ...parsed.safeWalk,
                protectionLevel: parsed.safeWalk.protectionLevel ?? "guarded",
                safetyScore:
                  parsed.safeWalk.safetyScore ??
                  safeWalkScore(parsed.safeWalk.protectionLevel ?? "guarded"),
                routeSegments: parsed.safeWalk.routeSegments ?? safeWalkRouteSegments,
                safetyZones: parsed.safeWalk.safetyZones ?? safeWalkSafetyZones,
                riskSignals: parsed.safeWalk.riskSignals ?? safeWalkRiskSignals,
                checkInPlan:
                  parsed.safeWalk.checkInPlan ??
                  safeWalkCheckPlan(
                    parsed.safeWalk.duration ?? 15,
                    parsed.safeWalk.protectionLevel ?? "guarded",
                  ),
              }
            : null,
          sos: null,
        });
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    // Photos are large base64 data URLs — keep them in memory only so we never blow the storage quota.
    const strip = (u?: string) => (u && u.startsWith("data:") ? undefined : u);
    const slimJob = (j: Job): Job => {
      const p = strip(j.photoUrl);
      const a = strip(j.afterPhotoUrl);
      const { photoUrl: _p, afterPhotoUrl: _a, ...rest } = j;
      return { ...rest, ...(p ? { photoUrl: p } : {}), ...(a ? { afterPhotoUrl: a } : {}) };
    };
    const slim: State = {
      ...state,
      communityReports: state.communityReports.map((r) => {
        const p = strip(r.photoUrl);
        const a = strip(r.afterPhotoUrl);
        const { photoUrl: _p, afterPhotoUrl: _a, ...rest } = r;
        return { ...rest, ...(p ? { photoUrl: p } : {}), ...(a ? { afterPhotoUrl: a } : {}) };
      }),
      activeJob: state.activeJob ? slimJob(state.activeJob) : null,
      history: state.history.map(slimJob),
    };
    try {
      localStorage.setItem("nagrik-state", JSON.stringify(slim));
    } catch {
      try {
        localStorage.removeItem("nagrik-state");
        localStorage.removeItem("trafficmitra-state");
      } catch {}
    }
  }, [state, ready]);
  const verificationState: VerificationState =
    state.stage === "none" || state.stage === "finding" || state.stage === "incoming"
      ? "Community reported"
      : ["accepted", "enroute"].includes(state.stage)
        ? "Marshal assigned"
        : ["onsite", "resolving", "resolved"].includes(state.stage)
          ? "On-site verification"
          : ["evidence", "payout"].includes(state.stage)
            ? "Evidence verified"
            : "Resolved";
  const value = useMemo<Store>(() => {
    const reportsFiled = state.reportsFiled + state.communityReports.filter((r) => r.mine).length;
    const supportsGiven =
      state.supportsGiven + state.communityReports.filter((r) => r.supportedByMe && !r.mine).length;
    const safeWalksDone =
      state.safeWalksDone +
      state.safeWalkHistory.length +
      state.history.filter((j) => j.kind === "safewalk").length;
    const trustScore = Math.min(
      999,
      540 + reportsFiled * 48 + supportsGiven * 26 + safeWalksDone * 34 + state.history.length * 12,
    );
    const trustTier =
      trustScore >= 860
        ? "Exemplary citizen"
        : trustScore >= 720
          ? "Trusted neighbour"
          : "Active citizen";
    const badges: TrustBadge[] = [
      {
        id: "scout",
        title: "Neighbourhood scout",
        detail: "Filed your first community report",
        earned: reportsFiled >= 1,
      },
      {
        id: "ally",
        title: "Community ally",
        detail: "Supported 3 or more neighbourhood reports",
        earned: supportsGiven >= 3,
      },
      {
        id: "guardian",
        title: "Safety guardian",
        detail: "Completed a SafeWalk companion journey",
        earned: safeWalksDone >= 1,
      },
      {
        id: "responder",
        title: "First responder ally",
        detail: "Helped a marshal resolve a civic issue",
        earned: state.history.some((j) => j.outcome === "Completed"),
      },
    ];
    const notify = (s: State, n: Omit<CivicNotification, "id" | "at" | "unread">): State => ({
      ...s,
      notifications: [
        { ...n, id: uid("n"), at: new Date().toISOString(), unread: true },
        ...s.notifications,
      ].slice(0, 40),
    });
    const wards = wardSeed
      .map((w) => (w.mine ? { ...w, points: w.points + (trustScore - 540) } : w))
      .sort((a, b) => b.points - a.points);
    const adoptedReports = state.communityReports.filter((r) => state.adoptedSpots.includes(r.id));
    const marshalXp =
      1240 + state.history.length * 160 + Math.max(0, Math.round((state.earnings - 2840) / 10));
    const marshalLevel = marshalXp >= 3200 ? 2 : marshalXp >= 1600 ? 1 : 0;
    const marshalLevelTitle =
      ["Rising Marshal", "Sector Sentinel", "City Legend"][marshalLevel] ?? "Rising Marshal";
    const marshalNextXp = [1600, 3200, 5200][marshalLevel] ?? 5200;
    const marshalStreak = 12 + Math.min(state.history.length, 4);
    const topResponder = marshalLevel >= 1;
    return {
      ...state,
      verificationState,
      trustScore,
      trustTier,
      badges,
      reportsFiled,
      supportsGiven,
      safeWalksDone,
      wards,
      adoptedReports,
      marshalXp,
      marshalLevel,
      marshalLevelTitle,
      marshalNextXp,
      marshalStreak,
      topResponder,
      unreadCount: state.notifications.filter((n) => n.unread).length,
      myReports: state.communityReports.filter((r) => r.mine),
      openNeeds: state.communityReports.filter((r) => r.status !== "resolved"),
      setPersona: (persona) => setState((s) => ({ ...s, persona })),
      setStage: (stage) =>
        setState((s) => ({
          ...s,
          stage,
          activeJob: stage === "none" ? null : (s.activeJob ?? demoJob()),
        })),
      selectHazard: (selectedHazardId) => setState((s) => ({ ...s, selectedHazardId })),
      publishCommunityReport: (input) => {
        const id = `community-${Date.now()}`;
        setState((s) =>
          notify(
            {
              ...s,
              selectedHazardId: id,
              communityReports: [
                {
                  issue: input.issue,
                  detail: input.detail,
                  location: input.location,
                  address: input.address,
                  ...(input.photoUrl ? { photoUrl: input.photoUrl } : {}),
                  id,
                  reporter: "Aarav",
                  mine: true,
                  supporters: 1,
                  marshalRequests: 0,
                  supportedByMe: true,
                  requestedByMe: false,
                  verified: false,
                  status: "open",
                  createdAt: new Date().toISOString(),
                  coordinates: input.coordinates ?? [28.5497, 77.1994],
                  distance: "Pinned",
                  priority: input.priority ?? "High",
                  impact: input.impact ?? "Neighbourhood",
                  comments: [
                    {
                      id: uid("c"),
                      author: "Nagrik",
                      text: "Report published to the community map. Ward desk notified.",
                      at: new Date().toISOString(),
                      kind: "system",
                    },
                  ],
                },
                ...s.communityReports,
              ],
            },
            {
              kind: "vouch",
              title: "Your report is live on the civic map",
              description: `${input.issue} · neighbours can now confirm the impact`,
              reportId: id,
            },
          ),
        );
        return id;
      },
      supportCommunityReport: (id) =>
        setState((s) => {
          const r = s.communityReports.find((x) => x.id === id);
          if (!r || r.supportedByMe) return s;
          return notify(
            {
              ...s,
              communityReports: s.communityReports.map((x) =>
                x.id === id ? { ...x, supporters: x.supporters + 1, supportedByMe: true } : x,
              ),
            },
            {
              kind: "vouch",
              title: "You confirmed a neighbourhood report",
              description: `${r.issue} · now ${r.supporters + 1} people affected`,
              reportId: id,
            },
          );
        }),
      requestMarshalForReport: (id) =>
        setState((s) => {
          const report = s.communityReports.find((r) => r.id === id);
          if (!report) return s;
          const reports = s.communityReports.map((r) =>
            r.id === id
              ? {
                  ...r,
                  marshalRequests: r.marshalRequests + (r.requestedByMe ? 0 : 1),
                  requestedByMe: true,
                  status: "assigned" as const,
                }
              : r,
          );
          if (s.activeJob?.reportId === id) return { ...s, communityReports: reports };
          return notify(
            {
              ...s,
              communityReports: reports,
              selectedHazardId: id,
              stage: "finding",
              messages: [],
              etaMinutes: 6,
              activeJob: {
                id: `NG-C-${Math.floor(1000 + Math.random() * 8999)}`,
                kind: "community",
                issue: report.issue,
                requester: "Community circle",
                location: report.location,
                address: report.address,
                payout: 450,
                createdAt: new Date().toISOString(),
                reportId: id,
                hazardId: id,
                peopleHelped: report.supporters,
                ...(report.photoUrl ? { photoUrl: report.photoUrl } : {}),
              },
            },
            {
              kind: "marshal",
              title: "Community marshal requested",
              description: `${report.issue} · one mission can help ${report.supporters} people`,
              reportId: id,
            },
          );
        }),
      claimReportMission: (id) =>
        setState((s) => {
          const report = s.communityReports.find((r) => r.id === id);
          if (!report || s.activeJob) return s;
          return notify(
            {
              ...s,
              selectedHazardId: id,
              stage: "accepted",
              messages: [],
              etaMinutes: 6,
              communityReports: s.communityReports.map((r) =>
                r.id === id
                  ? { ...r, status: "assigned" as const, marshalRequests: r.marshalRequests + 1 }
                  : r,
              ),
              activeJob: {
                id: `NG-C-${Math.floor(1000 + Math.random() * 8999)}`,
                kind: "community",
                issue: report.issue,
                requester: "Community circle",
                location: report.location,
                address: report.address,
                payout: 450,
                createdAt: new Date().toISOString(),
                reportId: id,
                hazardId: id,
                peopleHelped: report.supporters,
                ...(report.photoUrl ? { photoUrl: report.photoUrl } : {}),
              },
            },
            {
              kind: "marshal",
              title: "Marshal Riya claimed a community mission",
              description: `${report.issue} · ${report.supporters} people will get the outcome`,
              reportId: id,
            },
          );
        }),
      addReportComment: (id, text, author = "Aarav") =>
        setState((s) => ({
          ...s,
          communityReports: s.communityReports.map((r) =>
            r.id === id
              ? {
                  ...r,
                  comments: [
                    ...r.comments,
                    {
                      id: uid("c"),
                      author,
                      text,
                      at: new Date().toISOString(),
                      kind: "update" as const,
                    },
                  ],
                }
              : r,
          ),
        })),
      createPersonalJob: (issue, photoUrl, location) =>
        setState((s) =>
          s.activeJob
            ? s
            : {
                ...s,
                stage: "finding",
                messages: [],
                etaMinutes: 6,
                activeJob: {
                  ...demoJob(),
                  kind: "personal",
                  issue,
                  ...(location ? { location: location.location, address: location.address } : {}),
                  ...(photoUrl ? { photoUrl } : {}),
                },
              },
        ),
      createJob: (issue = "Personal civic assistance", hazardId) =>
        setState((s) =>
          s.activeJob
            ? s
            : {
                ...s,
                stage: "finding",
                selectedHazardId: hazardId ?? s.selectedHazardId,
                activeJob: { ...demoJob(), issue, ...(hazardId ? { hazardId } : {}) },
              },
        ),
      startSafeWalk: (input) =>
        setState((s) => {
          if (s.activeJob) return s;
          const startedAt = new Date().toISOString();
          const safetyScore = safeWalkScore(input.protectionLevel);
          const checkInPlan = safeWalkCheckPlan(input.duration, input.protectionLevel);
          return notify(
            {
              ...s,
              stage: input.marshalMonitoring ? "finding" : "accepted",
              safeWalk: {
                ...input,
                paused: false,
                checkIns: 0,
                startedAt,
                safetyScore,
                routeSegments: safeWalkRouteSegments,
                safetyZones: safeWalkSafetyZones,
                riskSignals: safeWalkRiskSignals,
                checkInPlan,
              },
              activeJob: {
                ...demoJob(),
                kind: "safewalk",
                issue: "SafeWalk Companion",
                location: input.destination,
                address: `Walking to ${input.destination}`,
                payout: input.marshalMonitoring ? 250 : 0,
                createdAt: startedAt,
              },
            },
            {
              kind: "safewalk",
              title: "SafeWalk started",
              description: `${input.contact} is watching your route to ${input.destination}`,
            },
          );
        }),
      toggleSafeWalkPause: () =>
        setState((s) =>
          s.safeWalk
            ? notify(
                { ...s, safeWalk: { ...s.safeWalk, paused: !s.safeWalk.paused } },
                {
                  kind: "safewalk",
                  title: s.safeWalk.paused ? "SafeWalk resumed" : "SafeWalk paused",
                  description: s.safeWalk.paused
                    ? "Your trusted circle can see progress again"
                    : "Sharing is paused until you resume",
                },
              )
            : s,
        ),
      safeWalkCheckIn: () =>
        setState((s) => {
          const walk = s.safeWalk;
          if (!walk) return s;
          const checkIndex = walk.checkIns;
          const checkInMsg = {
            id: uid("m"),
            from: "requester" as const,
            text: `📍 Check-in #${walk.checkIns + 1} logged: "I'm Safe" verified along route corridor.`,
            at: new Date().toISOString(),
          };
          return notify(
            {
              ...s,
              messages: [...s.messages, checkInMsg],
              safeWalk: {
                ...walk,
                checkIns: walk.checkIns + 1,
                checkInPlan: walk.checkInPlan.map((c, i) =>
                  i === checkIndex ? { ...c, status: "done" as const } : c,
                ),
              },
            },
            {
              kind: "safewalk",
              title: "SafeWalk check-in received",
              description: `${walk.contact} sees that you are okay`,
            },
          );
        }),
      finishSafeWalk: () =>
        setState((s) => {
          if (!s.activeJob || s.activeJob.kind !== "safewalk" || !s.safeWalk) return s;
          const completedAt = new Date().toISOString();
          const done = {
            ...s.activeJob,
            outcome: "Completed" as const,
            completedAt,
            note: `SafeWalk completed with ${s.safeWalk.checkIns} check-ins and ${s.safeWalk.safetyScore}% route confidence.`,
          };
          const summary: SafeWalkSummary = {
            id: done.id,
            destination: s.safeWalk.destination,
            duration: s.safeWalk.duration,
            safetyScore: s.safeWalk.safetyScore,
            checkIns: s.safeWalk.checkIns,
            protectionLevel: s.safeWalk.protectionLevel,
            completedAt,
            outcome: "Safe",
            trustPoints: 34,
          };
          return notify(
            {
              ...s,
              stage: "none",
              activeJob: null,
              safeWalk: null,
              messages: [],
              safeWalkHistory: [summary, ...s.safeWalkHistory].slice(0, 8),
              history: s.history.some((h) => h.id === done.id) ? s.history : [done, ...s.history],
            },
            {
              kind: "safewalk",
              title: "You arrived safely",
              description: `${s.safeWalk.contact} was informed · +${summary.trustPoints} trust points`,
            },
          );
        }),
      sendMissionMessage: (from, text) =>
        setState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            { id: uid("m"), from, text, at: new Date().toISOString() },
          ].slice(-30),
        })),
      clearMessages: () => setState((s) => ({ ...s, messages: [] })),
      setEta: (etaMinutes) => setState((s) => ({ ...s, etaMinutes: Math.max(0, etaMinutes) })),
      markNotificationRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
        })),
      markAllNotificationsRead: () =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, unread: false })),
        })),
      dismissNotification: (id) =>
        setState((s) => ({ ...s, notifications: s.notifications.filter((n) => n.id !== id) })),
      pushNotification: (n) => setState((s) => notify(s, n)),
      addEmergencyContact: (c) =>
        setState((s) => ({
          ...s,
          emergencyContacts: [...s.emergencyContacts, { ...c, id: uid("e") }],
        })),
      removeEmergencyContact: (id) =>
        setState((s) => ({
          ...s,
          emergencyContacts: s.emergencyContacts.filter((c) => c.id !== id),
        })),
      triggerSos: () =>
        setState((s) =>
          notify(
            { ...s, sos: { active: true, startedAt: new Date().toISOString() } },
            {
              kind: "sos",
              title: "Emergency shield activated",
              description: "Marshals within 1.2 km and your trusted circle were alerted",
            },
          ),
        ),
      cancelSos: () => setState((s) => ({ ...s, sos: null })),
      advance: () =>
        setState((s) => {
          const i = order.indexOf(s.stage);
          const stage = order[Math.min(i + 1, order.length - 1)] ?? "none";
          return { ...s, stage, activeJob: stage === "none" ? null : (s.activeJob ?? demoJob()) };
        }),
      reset: () =>
        setState((s) => ({
          ...s,
          stage: "none",
          activeJob: null,
          selectedHazardId: null,
          safeWalk: null,
          messages: [],
        })),
      accept: () =>
        setState((s) => {
          if (s.safeWalk) {
            const assignedMarshal = {
              id: "marshal-2841",
              name: "Marshal Vikram Singh",
              badge: "Ward 42 Lead",
              rating: 4.9,
              vehicle: "Electric Patrol Bike #14",
              responseEta: "2–3 min",
              phone: "+91 98765 43210",
              status: "standby" as const,
            };
            const handshakeMsg = {
              id: uid("m"),
              from: "marshal" as const,
              text: "Namaste Aarav! I am Marshal Vikram Singh. I have accepted your SafeWalk monitoring and am on quick-response standby on Aurobindo Marg (2–3 min radius). Keep walking safely.",
              at: new Date().toISOString(),
            };
            return notify(
              {
                ...s,
                stage: "accepted",
                etaMinutes: 3,
                safeWalk: {
                  ...s.safeWalk,
                  assignedMarshal,
                },
                activeJob: s.activeJob
                  ? { ...s.activeJob, outcome: "In Progress" as const }
                  : demoJob(),
                messages: [...s.messages, handshakeMsg],
              },
              {
                kind: "safewalk",
                title: "Marshal Vikram Singh assigned",
                description: "Quick-response escort standby active (2–3 min radius)",
              },
            );
          }
          return {
            ...s,
            stage: "accepted",
            etaMinutes: 6,
            activeJob: s.activeJob ?? demoJob(),
          };
        }),
      triggerMarshalIntercept: () =>
        setState((s) => {
          if (!s.safeWalk) return s;
          const currentMarshal = s.safeWalk.assignedMarshal || {
            id: "marshal-2841",
            name: "Marshal Vikram Singh",
            badge: "Ward 42 Lead",
            rating: 4.9,
            vehicle: "Electric Patrol Bike #14",
            responseEta: "1 min",
            phone: "+91 98765 43210",
            status: "intercepting" as const,
          };
          const alertMsg = {
            id: uid("m"),
            from: "marshal" as const,
            text: "🚨 URGENT: Quick intercept protocol initiated. I am riding towards your live coordinates now on Electric Patrol Bike #14. ETA < 1 minute. Stay in lit area.",
            at: new Date().toISOString(),
          };
          return notify(
            {
              ...s,
              etaMinutes: 1,
              safeWalk: {
                ...s.safeWalk,
                assignedMarshal: {
                  ...currentMarshal,
                  status: "intercepting" as const,
                  responseEta: "1 min",
                },
              },
              messages: [...s.messages, alertMsg],
            },
            {
              kind: "sos",
              title: "Marshal Intercept Dispatched",
              description: "Marshal Vikram Singh is intercepting your route · ETA 1 min",
            },
          );
        }),
      decline: () =>
        setState((s) => ({ ...s, stage: "none", activeJob: null, safeWalk: null, messages: [] })),
      escalate: () =>
        setState((s) => {
          const job = s.activeJob ?? demoJob();
          const completedAt = new Date().toISOString();
          const done = { ...job, outcome: "Escalated" as const, completedAt, payout: 0 };
          const summary = s.safeWalk
            ? {
                id: done.id,
                destination: s.safeWalk.destination,
                duration: s.safeWalk.duration,
                safetyScore: s.safeWalk.safetyScore,
                checkIns: s.safeWalk.checkIns,
                protectionLevel: s.safeWalk.protectionLevel,
                completedAt,
                outcome: "Escalated" as const,
                trustPoints: 0,
              }
            : null;
          return notify(
            {
              ...s,
              stage: "none",
              activeJob: null,
              safeWalk: null,
              messages: [],
              safeWalkHistory: summary
                ? [summary, ...s.safeWalkHistory].slice(0, 8)
                : s.safeWalkHistory,
              history: s.history.some((h) => h.id === done.id) ? s.history : [done, ...s.history],
            },
            {
              kind: "sos",
              title: "Police support requested",
              description: `${job.issue} · the incident was archived for review`,
            },
          );
        }),
      submitEvidence: (note, afterPhotoUrl) =>
        setState((s) => ({
          ...s,
          stage: "payout",
          activeJob: s.activeJob
            ? {
                ...s.activeJob,
                evidence: true,
                ...(note ? { note } : {}),
                ...(afterPhotoUrl ? { afterPhotoUrl } : {}),
              }
            : { ...demoJob(), evidence: true, ...(note ? { note } : {}) },
        })),
      archive: () =>
        setState((s) => {
          if (!s.activeJob) return { ...s, stage: "none" };
          const done = {
            ...s.activeJob,
            outcome: "Completed" as const,
            completedAt: new Date().toISOString(),
            evidence: true,
          };
          const fresh = !s.history.some((h) => h.id === done.id);
          const shared = done.kind === "community";
          return notify(
            {
              ...s,
              stage: "none",
              activeJob: null,
              messages: [],
              communityReports: s.communityReports.map((r) =>
                r.id === done.reportId
                  ? {
                      ...r,
                      status: "resolved" as const,
                      verified: true,
                      ...(done.afterPhotoUrl ? { afterPhotoUrl: done.afterPhotoUrl } : {}),
                      comments: [
                        ...r.comments,
                        {
                          id: uid("c"),
                          author: "Marshal Riya",
                          text: "Issue resolved and verified with an after photo.",
                          at: new Date().toISOString(),
                          kind: "system" as const,
                        },
                      ],
                    }
                  : r,
              ),
              history: fresh ? [done, ...s.history] : s.history,
              earnings: fresh ? s.earnings + done.payout : s.earnings,
            },
            {
              kind: "resolved",
              title: shared ? "Community issue resolved" : "Your request was completed",
              description: shared
                ? `${done.issue} · ${done.peopleHelped ?? 1} people notified of the verified outcome`
                : `${done.issue} · evidence verified`,
              ...(done.reportId ? { reportId: done.reportId } : {}),
            },
          );
        }),
      setOnline: (marshalOnline) => setState((s) => ({ ...s, marshalOnline })),
      approveKyc: () => setState((s) => ({ ...s, kyc: "approved" })),
      submitKyc: () => setState((s) => ({ ...s, kyc: "review" })),
      completeTraining: () => setState((s) => ({ ...s, trainingComplete: true })),
      withdraw: (amount) => {
        if (amount <= 0 || amount > state.earnings - state.withdrawals) return false;
        setState((s) => ({ ...s, withdrawals: s.withdrawals + amount }));
        return true;
      },
      rate: (requesterRating) => setState((s) => ({ ...s, requesterRating })),
      toggleNotifications: () =>
        setState((s) => ({ ...s, notificationsEnabled: !s.notificationsEnabled })),
      signPetition: (id) =>
        setState((s) => {
          const r = s.communityReports.find((x) => x.id === id);
          if (!r || r.petitionedByMe) return s;
          const signatures = (r.petitionSignatures ?? r.supporters * 3) + 1;
          const sent = signatures >= petitionGoal;
          const reports = s.communityReports.map((x) =>
            x.id === id
              ? {
                  ...x,
                  petitionSignatures: signatures,
                  petitionedByMe: true,
                  petitionSent: x.petitionSent || sent,
                  comments:
                    sent && !x.petitionSent
                      ? [
                          ...x.comments,
                          {
                            id: uid("c"),
                            author: "Nagrik",
                            text: `Petition reached ${petitionGoal} signatures and was escalated to the ward office.`,
                            at: new Date().toISOString(),
                            kind: "system" as const,
                          },
                        ]
                      : x.comments,
                }
              : x,
          );
          return notify(
            { ...s, communityReports: reports },
            {
              kind: "vouch",
              title: sent ? "Petition escalated to the ward office" : "You signed a civic petition",
              description: `${r.issue} · ${signatures} of ${petitionGoal} signatures`,
              reportId: id,
            },
          );
        }),
      toggleAdoptSpot: (id) =>
        setState((s) => {
          const has = s.adoptedSpots.includes(id);
          const r = s.communityReports.find((x) => x.id === id);
          const next = {
            ...s,
            adoptedSpots: has ? s.adoptedSpots.filter((x) => x !== id) : [...s.adoptedSpots, id],
          };
          return has
            ? next
            : notify(next, {
                kind: "vouch",
                title: "Spot adopted",
                description: r
                  ? `You'll be alerted to new issues near ${r.location}`
                  : "You'll be alerted to new issues here",
              });
        }),
      joinPatrol: (id) =>
        setState((s) => {
          if (s.patrolsJoined.includes(id)) return s;
          const p = patrolShifts.find((x) => x.id === id);
          return notify(
            { ...s, patrolsJoined: [...s.patrolsJoined, id] },
            {
              kind: "marshal",
              title: "Patrol shift confirmed",
              description: p
                ? `${p.area} · ${p.time} · your live presence shows on the map`
                : "Patrol joined",
            },
          );
        }),
    };
  }, [state, verificationState]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useTraffic() {
  const v = useContext(Ctx);
  if (!v) throw new Error("TrafficProvider missing");
  return v;
}

export function useRequester() {
  const store = useTraffic();
  return {
    ...store,
    isRequester: store.persona === "requester",
  };
}

export function useMarshal() {
  const store = useTraffic();
  return {
    ...store,
    isMarshal: store.persona === "marshal",
  };
}

export function useSafeWalk() {
  const store = useTraffic();
  return {
    safeWalk: store.safeWalk,
    safeWalkHistory: store.safeWalkHistory,
    startSafeWalk: store.startSafeWalk,
    toggleSafeWalkPause: store.toggleSafeWalkPause,
    safeWalkCheckIn: store.safeWalkCheckIn,
    finishSafeWalk: store.finishSafeWalk,
    triggerMarshalIntercept: store.triggerMarshalIntercept,
    escalate: store.escalate,
    activeJob: store.activeJob,
    verificationState: store.verificationState,
  };
}

export function useCivicActivity() {
  const store = useTraffic();
  return {
    trustScore: store.trustScore,
    trustTier: store.trustTier,
    badges: store.badges,
    wards: store.wards,
    reportsFiled: store.reportsFiled,
    supportsGiven: store.supportsGiven,
    adoptedReports: store.adoptedReports,
    communityReports: store.communityReports,
    history: store.history,
    unreadCount: store.unreadCount,
    openNeeds: store.openNeeds,
  };
}
