import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  CheckCheck,
  CornerDownLeft,
  Footprints,
  Lock,
  MessageCircle,
  Phone,
  Radio,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTraffic } from "@/lib/traffic-store";
import { timeAgo } from "@/features/shared/components/notification-bell";
import { cn } from "@/lib/utils";

const requesterPresets = [
  { text: "Passing Metro Gate 2 now", icon: "🚶" },
  { text: "Stretch is well-lit, all good", icon: "💡" },
  { text: "Streetlight dark on this corner", icon: "⚠️" },
  { text: "Someone walking behind me", icon: "👀" },
  { text: "Approaching destination safely", icon: "🏁" },
];

const marshalPresets = [
  { text: "Live GPS corridor locked & tracking", icon: "📡" },
  { text: "Patrolling 200m away on standby", icon: "🛵" },
  { text: "Moving closer to your stretch", icon: "🚨" },
  { text: "PCR patrol van stationed at circle", icon: "👮" },
  { text: "Visual confirmed, corridor clear", icon: "✅" },
];

export function SafeWalkChatDrawer({
  open,
  onClose,
  side,
}: {
  open: boolean;
  onClose: () => void;
  side: "requester" | "marshal";
}) {
  const s = useTraffic();
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = side === "requester" ? requesterPresets : marshalPresets;
  const isMarshal = side === "marshal";

  const partnerName = isMarshal
    ? "Aarav Rajput (Walker)"
    : s.safeWalk?.assignedMarshal?.name || "Marshal Vikram Singh";

  const isIntercepting = s.safeWalk?.assignedMarshal?.status === "intercepting";

  const partnerStatus = isMarshal
    ? "Walking along corridor · Live GPS Active"
    : isIntercepting
      ? "🚨 Intercepting · ETA < 1 min · Aurobindo Marg"
      : "Verified Ward 42 Marshal · Standby < 3 min";

  // Ensure portal target exists on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, s.messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [open]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSend = (msgToSend?: string) => {
    const payload = (msgToSend || text).trim();
    if (!payload) return;
    s.sendMissionMessage(side, payload);
    setText("");
    window.setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 40);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Chat Window / Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            className="relative z-10 flex flex-col w-full max-w-lg h-[86dvh] sm:h-[640px] max-h-[92dvh] rounded-t-[32px] sm:rounded-3xl border border-border/80 bg-card text-foreground shadow-2xl overflow-hidden"
          >
            {/* Sheet Pull Grabber (mobile) */}
            <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
              <span className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-gradient-to-r from-card via-safe-soft/15 to-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-safe text-white shadow-soft">
                  {isMarshal ? (
                    <Footprints className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                  <span className="absolute -inset-1 animate-ping rounded-2xl bg-safe/25 duration-1000" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-extrabold text-foreground">
                      {partnerName}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-safe/15 border border-safe/30 px-2 py-0.5 text-[9px] font-black text-safe uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-safe font-semibold">
                    {partnerStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-border/80 hover:bg-muted active:scale-95 shadow-2xs"
                  onClick={() => alert(`Direct Safety Hotline to ${partnerName}: +91 98765 43210`)}
                  title={`Call ${partnerName}`}
                >
                  <Phone className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95"
                  onClick={onClose}
                  title="Close chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Encrypted Security Notice */}
            <div className="px-4 py-1.5 bg-muted/40 border-b border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 truncate">
                <Lock className="h-3 w-3 text-safe shrink-0" />
                <span>Encrypted Municipal Safety Channel · Ward 42 Mesh</span>
              </span>
              <span className="text-[10px] font-bold text-safe uppercase shrink-0">
                Active Radar
              </span>
            </div>

            {/* Tactical Preset Chips Bar */}
            <div className="px-3 py-2 border-b border-border/50 bg-background/60">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1 pr-1">
                  <Zap className="h-3 w-3 text-amber-500" /> Quick:
                </span>
                {presets.map((p) => (
                  <button
                    key={p.text}
                    type="button"
                    onClick={() => handleSend(p.text)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border/80 px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-safe-soft hover:border-safe/40 transition-all shrink-0 active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Stream */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain bg-background/30"
            >
              {s.messages.length === 0 ? (
                <div className="py-12 px-6 text-center text-muted-foreground flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-2xl bg-safe-soft border border-safe/25 grid place-items-center mb-3 text-safe">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <b className="text-sm text-foreground">Encrypted Channel Open</b>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                    Live GPS monitoring is active. Tap any quick tactical chip above or type a message below to coordinate instantly.
                  </p>
                </div>
              ) : (
                s.messages.map((m) => {
                  const isMe = m.from === side;
                  const isUrgent =
                    m.text.includes("🚨") ||
                    m.text.includes("URGENT") ||
                    m.text.includes("EMERGENCY") ||
                    m.text.includes("INTERCEPT");
                  const isCheckIn = m.text.includes("📍 Check-in");

                  // Event Pill: Check-in verified
                  if (isCheckIn) {
                    return (
                      <div
                        key={m.id}
                        className="mx-auto my-2 max-w-[90%] rounded-2xl bg-safe-soft border border-safe/30 px-3.5 py-2 text-center text-[11px] font-bold text-safe shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{m.text}</span>
                      </div>
                    );
                  }

                  // Event Banner: Emergency Intercept alert
                  if (isUrgent) {
                    return (
                      <div
                        key={m.id}
                        className="mx-auto my-2.5 max-w-[96%] rounded-2xl bg-danger-soft border border-danger/40 p-3.5 text-danger shadow-xs"
                      >
                        <div className="flex items-center gap-2 text-xs font-black">
                          <ShieldAlert className="h-4 w-4 shrink-0 animate-bounce" />
                          <span>HIGH-PRIORITY TACTICAL ALERT</span>
                        </div>
                        <p className="mt-1 text-xs font-bold leading-relaxed break-words">
                          {m.text}
                        </p>
                        <span className="mt-1 block text-[10px] text-danger/80">
                          {timeAgo(m.at)}
                        </span>
                      </div>
                    );
                  }

                  // Normal Conversational Message
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex flex-col max-w-[84%]",
                        isMe ? "ml-auto items-end" : "mr-auto items-start",
                      )}
                    >
                      <div className="flex items-center gap-1 mb-1 px-1">
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {isMe
                            ? "You"
                            : m.from === "marshal"
                              ? "Marshal Vikram Singh"
                              : "Aarav Rajput"}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed shadow-xs break-words",
                          isMe
                            ? "bg-primary text-white rounded-br-xs"
                            : "bg-card text-foreground border border-border/80 rounded-bl-xs",
                        )}
                      >
                        {m.text}
                      </div>

                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[9px] text-muted-foreground">
                          {timeAgo(m.at)}
                        </span>
                        {isMe && <CheckCheck className="h-3 w-3 text-safe inline" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-border/60 bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    isMarshal
                      ? "Message Aarav (e.g. crossing circle)..."
                      : "Message Marshal Vikram..."
                  }
                  className="h-11 rounded-2xl bg-muted/40 border-border/80 text-xs px-3.5 focus-visible:ring-safe/30"
                />
                <Button
                  type="submit"
                  disabled={!text.trim()}
                  className="h-11 w-11 shrink-0 rounded-2xl bg-safe text-white hover:bg-safe/90 disabled:opacity-40 font-bold p-0 shadow-soft active:scale-95 transition-all"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              {/* Intercept Escalation Shortcut */}
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-[10px] text-muted-foreground">
                  {isMarshal
                    ? "Command Hub Standby"
                    : "Need immediate escort?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    s.triggerMarshalIntercept();
                    handleSend(
                      isMarshal
                        ? "🚨 Marshal Vikram Singh deployed intercept towards your coordinates!"
                        : "🚨 URGENT: I requested immediate Marshal Intercept to my live location.",
                    );
                  }}
                  className="text-[10px] font-black text-danger hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert className="h-3 w-3" />
                  {isMarshal ? "Deploy Rapid Intercept" : "Request Rapid Intercept"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
