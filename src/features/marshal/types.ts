import type { HazardId } from "../shared/types";

export type Job = {
  id: string;
  kind?: "civic" | "community" | "personal" | "safewalk";
  issue: string;
  requester: string;
  location: string;
  address: string;
  payout: number;
  createdAt: string;
  hazardId?: HazardId;
  reportId?: string;
  peopleHelped?: number;
  photoUrl?: string;
  afterPhotoUrl?: string;
  completedAt?: string;
  outcome?: "Completed" | "Escalated";
  note?: string;
  evidence?: boolean;
};

export type PatrolShift = {
  id: string;
  area: string;
  time: string;
  marshals: number;
  need: number;
};

export const patrolShifts: PatrolShift[] = [
  { id: "pt1", area: "Hauz Khas Village loop", time: "Tonight · 9–11 pm", marshals: 3, need: 2 },
  {
    id: "pt2",
    area: "Green Park market stretch",
    time: "Tonight · 10 pm–12 am",
    marshals: 2,
    need: 1,
  },
  { id: "pt3", area: "Aurobindo Marg corridor", time: "Tomorrow · 6–8 am", marshals: 4, need: 3 },
];
