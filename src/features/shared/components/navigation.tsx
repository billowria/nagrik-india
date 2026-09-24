import { Link, useLocation } from "@tanstack/react-router";
import { History, Home, Menu, UserRound, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
import type { ComponentType } from "react";

export function Nav({
  items,
  integrated = false,
}: {
  items: {
    to: string;
    label: string;
    icon: ComponentType<{ className?: string; fill?: string }>;
  }[];
  integrated?: boolean;
}) {
  const path = useLocation({ select: (s) => s.pathname });
  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        "nav-glass fixed inset-x-3 bottom-[max(8px,env(safe-area-inset-bottom))] z-30 mx-auto grid max-w-[536px] border p-1.5 backdrop-blur sm:bottom-[max(16px,env(safe-area-inset-bottom))]",
        integrated && "nav-integrated",
      )}
      style={{ gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))` }}
    >
      {items.map(({ to, label, icon: Icon }) => {
        const selected = path === to;
        return (
          <Link
            key={to}
            to={to}
            aria-current={selected ? "page" : undefined}
            onClick={() => triggerHaptic("selection")}
            className={cn(
              "relative nav-item flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[20px] px-1 text-[10px] font-bold transition-colors select-none",
              selected ? "text-primary font-black" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected && (
              <motion.div
                layoutId="active-nav-pill"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-[18px] bg-primary/10 border border-primary/25 shadow-xs"
              />
            )}
            <motion.span
              whileTap={{ scale: 0.84 }}
              animate={selected ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 nav-icon grid h-7 w-7 shrink-0 place-items-center"
            >
              <Icon className="h-5 w-5" fill={selected ? "currentColor" : "none"} />
            </motion.span>
            <span className="relative z-10 w-full truncate text-center">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function RequesterNav({ integrated = false }: { integrated?: boolean }) {
  return (
    <Nav
      integrated={integrated}
      items={[
        { to: "/requester/home", label: "Home", icon: Home },
        { to: "/requester/activity", label: "Activity", icon: History },
        { to: "/requester/profile", label: "Profile", icon: UserRound },
      ]}
    />
  );
}

export function MarshalNav({ integrated = false }: { integrated?: boolean }) {
  return (
    <Nav
      integrated={integrated}
      items={[
        { to: "/marshal/dashboard", label: "Home", icon: Home },
        { to: "/marshal/requests", label: "Requests", icon: Menu },
        { to: "/marshal/wallet", label: "Wallet", icon: Wallet },
        { to: "/marshal/profile", label: "Profile", icon: UserRound },
      ]}
    />
  );
}
