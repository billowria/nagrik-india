import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Palette,
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
import { cn } from "@/lib/utils";

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
            <DrawerDescription>Switch profile, theme, or move the shared request status.</DrawerDescription>
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

            {/* App Theme 1-Click Switcher */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" />
                  App Theme
                </label>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  1-Click Live Toggle
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  {
                    id: "green" as const,
                    name: "Green",
                    subtitle: "Civic Forest",
                    color: "bg-[#10b981]",
                    glow: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
                  },
                  {
                    id: "amber-red" as const,
                    name: "Amber-Red",
                    subtitle: "Terracotta Red",
                    color: "bg-gradient-to-br from-[#c2410c] to-[#b91c1c]",
                    glow: "shadow-[0_0_12px_rgba(194,65,12,0.45)]",
                  },
                  {
                    id: "amber-orange" as const,
                    name: "Amber-Orange",
                    subtitle: "Saffron Marigold",
                    color: "bg-gradient-to-br from-[#f59e0b] to-[#ea580c]",
                    glow: "shadow-[0_0_12px_rgba(245,158,11,0.45)]",
                  },
                ].map((th) => {
                  const active = s.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => s.setTheme(th.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer active:scale-95 text-center",
                        active
                          ? "bg-card border-primary ring-2 ring-primary/25 shadow-soft"
                          : "bg-muted/60 border-border/70 hover:bg-muted text-muted-foreground",
                      )}
                    >
                      <div className="relative mb-1.5 flex items-center justify-center">
                        <span className={cn("h-5 w-5 rounded-full shadow-xs shrink-0", th.color, active && th.glow)} />
                        {active && (
                          <span className="absolute inset-0 grid place-items-center text-white">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <b className={cn("text-xs font-black truncate w-full", active ? "text-foreground" : "text-muted-foreground")}>
                        {th.name}
                      </b>
                      <small className="text-[9px] text-muted-foreground truncate w-full mt-0.5">
                        {th.subtitle}
                      </small>
                    </button>
                  );
                })}
              </div>
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
