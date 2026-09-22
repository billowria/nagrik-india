import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LifeBuoy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTraffic } from "@/lib/traffic-store";
import { Eyebrow, Logo } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import nagrikCitizen3d from "@/assets/nagrik-citizen-3d.png";
import nagrikSathi3d from "@/assets/nagrik-sathi-3d.png";
import type { ComponentType } from "react";

function RoleCard({
  icon: Icon,
  eyebrow,
  title,
  text,
  avatar,
  avatarAlt,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  text: string;
  avatar: string;
  avatarAlt: string;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" onClick={onClick} className="role-card group">
      <span className="role-copy">
        <small>{eyebrow}</small>
        <b>{title}</b>
        <span>{text}</span>
        <em>
          Choose journey <ArrowRight />
        </em>
      </span>
      <span className="role-avatar">
        <span className="role-avatar-halo" />
        <img src={avatar} alt={avatarAlt} width={1024} height={1024} />
        <i>
          <Icon />
        </i>
      </span>
    </Button>
  );
}

export function RoleSelectPage() {
  const nav = useNavigate();
  const s = useTraffic();

  return (
    <main className="role-screen min-h-dvh bg-background px-4 pb-6 pt-[max(18px,env(safe-area-inset-top))]">
      <div className="role-shell mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col">
        <div className="role-brand animate-logo">
          <Logo small />
        </div>
        <div className="role-intro">
          <Eyebrow>Choose your Nagrik journey</Eyebrow>
          <h1>How will you help your community today?</h1>
          <p>
            Join one trusted civic network—as a citizen seeking action or a trained companion ready
            to respond.
          </p>
        </div>
        <div className="role-grid">
          <RoleCard
            icon={LifeBuoy}
            eyebrow="For civic support"
            title="Nagrik"
            text="Report community issues and request trusted help nearby"
            avatar={nagrikCitizen3d}
            avatarAlt="Nagrik citizen"
            onClick={() => {
              s.setPersona("requester");
              nav({ to: "/requester/home" });
            }}
          />
          <RoleCard
            icon={ShieldCheck}
            eyebrow="For civic action"
            title="Nagrik Sathi"
            text="Respond safely and help neighbourhoods move forward"
            avatar={nagrikSathi3d}
            avatarAlt="Nagrik Sathi civic responder"
            onClick={() => {
              s.setPersona("marshal");
              nav({
                to:
                  s.kyc === "approved"
                    ? s.trainingComplete
                      ? "/marshal/dashboard"
                      : "/marshal/training"
                    : "/marshal/kyc",
              });
            }}
          />
        </div>
        <div className="trust-strip mt-auto">
          <ShieldCheck className="h-4 w-4" />
          <span>Identity verified · Safety led · Community trusted</span>
        </div>
      </div>
      <DevConsole />
    </main>
  );
}
