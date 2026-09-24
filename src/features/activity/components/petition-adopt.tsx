import { Check, Landmark, MapPinned, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { petitionGoal, useTraffic, type CommunityReport } from "@/lib/traffic-store";

export function PetitionAdopt({ report }: { report: CommunityReport }) {
  const s = useTraffic();
  const sig = report.petitionSignatures ?? report.supporters * 3;
  const adopted = s.adoptedSpots.includes(report.id);
  const done = report.petitionSent;

  return (
    <div className="mt-4 rounded-2xl bg-cream p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-primary">
          <ScrollText className="h-3.5 w-3.5" />
          Ward petition
        </span>
        <span className="text-[10px] font-bold text-muted-foreground">
          {Math.min(sig, petitionGoal)} / {petitionGoal} signatures
        </span>
      </div>
      <div className="petition-track mt-2">
        <i style={{ width: `${Math.min(100, Math.round((sig / petitionGoal) * 100))}%` }} />
      </div>
      {done ? (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-primary">
          <Landmark className="h-3.5 w-3.5" />
          Escalated to the ward office
        </p>
      ) : (
        <Button
          variant="outline"
          className="mt-3 h-10 w-full rounded-xl"
          disabled={report.petitionedByMe}
          onClick={() => s.signPetition(report.id)}
        >
          {report.petitionedByMe ? <Check /> : <ScrollText />}
          {report.petitionedByMe ? "Signature added" : "Sign to escalate"}
        </Button>
      )}
      <Button
        variant={adopted ? "secondary" : "outline"}
        className="mt-2 h-10 w-full rounded-xl"
        onClick={() => s.toggleAdoptSpot(report.id)}
      >
        <MapPinned />
        {adopted ? "Spot adopted · alerts on" : "Adopt this spot"}
      </Button>
    </div>
  );
}
