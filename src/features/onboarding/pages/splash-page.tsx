import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Logo } from "@/features/shared/components/common";

export function SplashPage() {
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/onboarding/role-select" }), 2400);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <main className="splash relative grid min-h-dvh place-items-center overflow-hidden bg-background px-6">
      <div className="splash-grid absolute inset-0" />
      <div className="relative flex flex-col items-center">
        <div className="logo-stage animate-logo">
          <div className="logo-halo" />
          <Logo />
        </div>
        <div className="route-draw mt-9 h-1 w-40 rounded-full bg-primary" />
        <p className="mt-5 font-display text-sm font-bold text-foreground animate-fade-in">
          Safer communities, together
        </p>
        <span className="mt-2 text-[10px] font-bold uppercase text-primary">
          Civic safety network
        </span>
      </div>
    </main>
  );
}
