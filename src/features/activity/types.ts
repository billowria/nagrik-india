export type Ward = {
  name: string;
  points: number;
  trend: string;
  mine?: boolean;
};

export const petitionGoal = 50;

export const wardSeed: Ward[] = [
  { name: "Green Park", points: 4820, trend: "+2" },
  { name: "Hauz Khas", points: 4210, trend: "+1", mine: true },
  { name: "Malviya Nagar", points: 3980, trend: "-1" },
  { name: "Saket", points: 3610, trend: "0" },
  { name: "IIT Delhi", points: 3120, trend: "+3" },
];
