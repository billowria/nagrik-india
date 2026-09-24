import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";

// 1. Animated SafeWalk Shield with radar scan and neon pulse
export function AnimatedShield({
  className,
  active = true,
  size = 32,
}: {
  className?: string;
  active?: boolean;
  size?: number;
}) {
  return (
    <div
      className={cn("relative inline-grid place-items-center shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {active && (
        <motion.span
          className="absolute inset-0 rounded-2xl bg-safe/20"
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={active ? { scale: [1, 1.04, 1] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0.8 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Core check / lock in shield */}
        <motion.path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
      </motion.svg>
    </div>
  );
}

// 2. Animated Civic GPS Beacon with expanding concentric waves
export function AnimatedBeacon({
  className,
  color = "currentColor",
  size = 24,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={cn("relative inline-grid place-items-center shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute rounded-full"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          backgroundColor: color,
        }}
        animate={{ scale: [0.4, 1.6], opacity: [0.55, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute rounded-full"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          backgroundColor: color,
        }}
        animate={{ scale: [0.4, 1.6], opacity: [0.55, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
      />
      <span
        className="relative rounded-full z-10 shadow-sm"
        style={{
          width: size * 0.42,
          height: size * 0.42,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

// 3. Animated Checkmark with SVG draw animation and pop
export function AnimatedCheckmark({
  size = 20,
  className,
  strokeWidth = 3,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
    >
      <motion.path
        d="M20 6 9 17l-5-5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

// 4. Animated SOS Pulse with tactile rhythmic heartbeat
export function AnimatedSosPulse({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn("relative inline-grid place-items-center shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-destructive/35"
        animate={{ scale: [1, 1.45, 1.1, 1.6, 1], opacity: [0.8, 0, 0.4, 0, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="relative grid place-items-center rounded-full bg-destructive text-destructive-foreground font-black shadow-lg"
        style={{ width: size * 0.82, height: size * 0.82, fontSize: size * 0.3 }}
        animate={{ scale: [1, 1.07, 1, 1.05, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        SOS
      </motion.span>
    </div>
  );
}

// 5. Animated Endorse / Heart with spring bounce and particle pop
export function AnimatedEndorse({
  active = false,
  count,
  onToggle,
  className,
}: {
  active?: boolean;
  count: number;
  onToggle?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={() => {
        triggerHaptic("medium");
        onToggle?.();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors select-none",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-card border border-border/80 text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <motion.span
        animate={active ? { scale: [1, 1.4, 0.95, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 500 }}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </motion.span>
      <motion.span
        key={count}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="font-black tabular-nums"
      >
        {count}
      </motion.span>
    </motion.button>
  );
}

// 6. Animated Scanning Radar for Search / Dispatch HUD
export function AnimatedRadar({
  size = 54,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative grid place-items-center rounded-full border border-primary/30", className)}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-2 rounded-full border border-primary/20" />
      <div className="absolute inset-4 rounded-full border border-primary/15" />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg 270deg, color-mix(in oklab, var(--primary) 35%, transparent) 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      />
      <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
    </div>
  );
}

// 7. Premium Animated Empty State with floating civic badge
export function AnimatedEmptyState({
  title,
  description,
  actionText,
  onAction,
  className,
}: {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("grid justify-items-center py-10 px-4 text-center", className)}>
      <motion.div
        className="relative mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-accent/60 border border-primary/20 shadow-soft"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary/70"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <svg
          viewBox="0 0 24 24"
          width="36"
          height="36"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </motion.div>
      <b className="text-base font-extrabold text-foreground">{title}</b>
      <p className="mt-1 max-w-[260px] text-xs font-medium text-muted-foreground leading-relaxed">
        {description}
      </p>
      {actionText && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            triggerHaptic("light");
            onAction?.();
          }}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm"
        >
          {actionText}
        </motion.button>
      )}
    </div>
  );
}
