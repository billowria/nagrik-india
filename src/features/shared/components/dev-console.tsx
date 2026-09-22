import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Route as RouteIcon,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { stageCopy, stages, useTraffic, type Stage } from "@/lib/traffic-store";

export function DevConsole() {
  const s = useTraffic();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const switchProfile = (persona: "requester" | "marshal") => {
    s.setPersona(persona);
    nav({ to: persona === "requester" ? "/requester/home" : "/marshal/dashboard" });
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="default"
        size="icon"
        aria-label="Open journey simulator"
        onClick={() => setOpen(true)}
        className="dev-trigger fixed left-0 top-[46%] z-50 h-11 min-w-8 rounded-r-xl rounded-l-none shadow-warm"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="mx-auto max-w-[560px] rounded-t-3xl border-primary/20 bg-background">
          <DrawerHeader className="px-5 pb-2 text-left">
            <DrawerTitle className="flex items-center gap-2">
              <RouteIcon className="text-primary" />
              Journey simulator
            </DrawerTitle>
            <DrawerDescription>Switch profile or move the shared request status.</DrawerDescription>
          </DrawerHeader>
          <div className="px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
            <label className="text-[11px] font-extrabold uppercase text-primary">Profile</label>
            <div className="simulator-segment mt-2 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
              {(["requester", "marshal"] as const).map((persona) => (
                <Button
                  key={persona}
                  variant={s.persona === persona ? "default" : "ghost"}
                  onClick={() => switchProfile(persona)}
                  className="h-12 rounded-xl capitalize"
                >
                  {persona === "requester" ? <UserRound /> : <ShieldCheck />}
                  {persona}
                </Button>
              ))}
            </div>
            <label
              htmlFor="simulator-status"
              className="mt-5 block text-[11px] font-extrabold uppercase text-primary"
            >
              Request status
            </label>
            <div className="simulator-status mt-2">
              <span className="simulator-status-icon">
                <Clock3 />
              </span>
              <select
                id="simulator-status"
                value={s.stage}
                onChange={(e) => s.setStage(e.target.value as Stage)}
              >
                <option value="none">No active request</option>
                {stages
                  .filter((stage) => stage !== "none")
                  .map((stage) => (
                    <option key={stage} value={stage}>
                      {stageCopy[stage].title}
                    </option>
                  ))}
              </select>
              <ChevronDown />
            </div>
            {s.activeJob && (
              <div className="simulator-context mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <b className="block truncate text-sm">{s.activeJob.issue}</b>
                  <small className="block truncate text-muted-foreground">
                    {s.activeJob.id} · {s.activeJob.location}
                  </small>
                </div>
                <span className="rounded-full bg-safe-soft px-2 py-1 text-[10px] font-bold text-safe">
                  Synced
                </span>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
