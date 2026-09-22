import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BellRing, Footprints, MapPin, ShieldCheck, Siren, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SAFEWALK_INTRO_KEY = "nagrik-safewalk-intro";

export function safeWalkIntroSeen() {
  try {
    return localStorage.getItem(SAFEWALK_INTRO_KEY) === "1";
  } catch {
    return true;
  }
}
function markSeen() {
  try {
    localStorage.setItem(SAFEWALK_INTRO_KEY, "1");
  } catch {}
}

type Step = {
  icon: typeof ShieldCheck;
  eyebrow: string;
  title: string;
  text: string;
  scene: "route" | "pings" | "circle" | "guard";
};

const steps: Step[] = [
  {
    icon: Footprints,
    eyebrow: "Step 1",
    title: "Set your walk",
    scene: "route",
    text: "Tell Nagrik where you are heading and how long it should take. We hold that plan with you.",
  },
  {
    icon: MapPin,
    eyebrow: "Step 2",
    title: "We follow your progress",
    scene: "pings",
    text: "Your live position moves along the corridor on the map, so your trusted contact always knows where you are.",
  },
  {
    icon: BellRing,
    eyebrow: "Step 3",
    title: "Gentle check-ins",
    scene: "circle",
    text: "Nagrik nudges you now and then. Tap once to say you're fine — miss one and your circle is alerted.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Step 4",
    title: "A marshal watches over",
    scene: "guard",
    text: "Trained marshals nearby can step in, and the SOS shield reaches helplines in seconds.",
  },
];

function Scene({ kind, still }: { kind: Step["scene"]; still: boolean }) {
  const float = still
    ? {}
    : {
        animate: { y: [0, -8, 0] },
        transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const },
      };
  return (
    <div className="sw-scene">
      <motion.div className="sw-scene-orb" {...float}>
        {kind === "route" && <Footprints />}
        {kind === "pings" && <MapPin />}
        {kind === "circle" && <Users />}
        {kind === "guard" && <ShieldCheck />}
      </motion.div>
      {!still &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="sw-scene-ring"
            initial={{ scale: 0.5, opacity: 0.45 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              delay: i * 0.85,
              ease: "easeOut" as const,
            }}
          />
        ))}
      {kind === "pings" && !still && (
        <motion.span
          className="sw-scene-trail"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }}
        />
      )}
      {kind === "guard" && (
        <motion.span
          className="sw-scene-badge"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
        >
          <Siren />
        </motion.span>
      )}
    </div>
  );
}

export function SafeWalkIntro({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const reduce = !!useReducedMotion();
  const step = steps[i]!;
  const Icon = step.icon;
  const finish = () => {
    markSeen();
    onDone();
  };
  const dir = reduce ? 0 : 1;
  return (
    <motion.div
      className="sw-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-label="How SafeWalk protects you"
    >
      <motion.div
        className="sw-intro-card"
        initial={{ y: reduce ? 0 : 40, opacity: 0, scale: reduce ? 1 : 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        <button className="sw-intro-skip" onClick={finish} aria-label="Skip walkthrough">
          <X />
        </button>
        <Scene kind={step.scene} still={reduce} />
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 24 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 * dir }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as const }}
            className="sw-intro-copy"
          >
            <span className="sw-intro-eyebrow">
              <Icon />
              {step.eyebrow}
            </span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="sw-intro-dots" aria-hidden>
          {steps.map((_, n) => (
            <motion.i
              key={n}
              className={cn("sw-dot", n === i && "on")}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            />
          ))}
        </div>
        <div className="sw-intro-actions">
          <Button variant="ghost" className="h-12 flex-1" onClick={finish}>
            Skip
          </Button>
          <Button
            className="h-12 flex-[1.4] rounded-2xl"
            onClick={() => (i < steps.length - 1 ? setI(i + 1) : finish())}
          >
            {i < steps.length - 1 ? "Next" : "Start SafeWalk"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
