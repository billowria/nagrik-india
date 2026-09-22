import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Bell,
  Footprints,
  HeartHandshake,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Trash2,
  Users,
  ArrowRight,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTraffic, type CivicNotification } from "@/lib/traffic-store";
import { cn } from "@/lib/utils";

export function timeAgo(at: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(at).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return h < 24 ? `${h} hr ago` : `${Math.round(h / 24)} d ago`;
}

export function alertIcon(kind: string) {
  return kind === "vouch" ? (
    <HeartHandshake />
  ) : kind === "marshal" ? (
    <ShieldCheck />
  ) : kind === "resolved" ? (
    <BadgeCheck />
  ) : kind === "safewalk" ? (
    <Footprints />
  ) : kind === "sos" ? (
    <Siren />
  ) : (
    <MessageCircle />
  );
}

export function alertDayLabel(at: string) {
  const d = new Date(at);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(today) - startOf(d)) / 86400000);
  return diff <= 0 ? "Today" : diff === 1 ? "Yesterday" : "Earlier";
}

export function AlertCard({
  n,
  onOpen,
  onDismiss,
}: {
  n: CivicNotification;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      layout
      className="alert-card-wrap"
      drag={reduced ? false : "x"}
      dragConstraints={{ left: -96, right: 0 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (info.offset.x < -72) onDismiss();
      }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
    >
      <span className="alert-swipe-hint">
        <Trash2 />
      </span>
      <button onClick={onOpen} className={cn("alert-card", n.unread && "unread")}>
        <span className={cn("alert-icon", `kind-${n.kind}`)}>{alertIcon(n.kind)}</span>
        <span className="alert-body">
          <b>{n.title}</b>
          <small>{n.description}</small>
        </span>
        <span className="alert-meta">
          <em>{timeAgo(n.at)}</em>
          {n.unread && <i />}
        </span>
      </button>
    </motion.div>
  );
}

export function NotificationBell() {
  const s = useTraffic();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "community" | "safety">("all");
  const list = s.notifications.filter((n) =>
    filter === "all"
      ? true
      : filter === "community"
        ? ["vouch", "comment", "resolved", "marshal"].includes(n.kind)
        : ["sos", "safewalk"].includes(n.kind),
  );
  const groups = ["Today", "Yesterday", "Earlier"]
    .map((day) => ({ day, items: list.filter((n) => alertDayLabel(n.at) === day) }))
    .filter((g) => g.items.length);
  const tabs = [
    ["all", "All", Bell],
    ["community", "Community", Users],
    ["safety", "Safety", ShieldAlert],
  ] as const;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`Notifications${s.unreadCount ? `, ${s.unreadCount} unread` : ""}`}
          className="relative grid h-11 w-11 place-items-center rounded-full bg-card text-foreground shadow-xs active:scale-95"
        >
          <Bell className="h-5 w-5" />
          {s.unreadCount > 0 && <i className="notif-dot">{s.unreadCount}</i>}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} className="alert-pop w-[min(92vw,360px)] p-0">
        <div className="alert-head">
          <b>Alerts</b>
          {s.unreadCount > 0 && <span className="alert-count">{s.unreadCount} new</span>}
          {s.unreadCount > 0 && (
            <button className="alert-readall" onClick={s.markAllNotificationsRead}>
              Mark all read
            </button>
          )}
        </div>
        <div className="alert-tabs">
          {tabs.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn("alert-tab", filter === key && "active")}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
        <div className="alert-scroll">
          <AnimatePresence initial={false}>
            {groups.length ? (
              groups.map((g) => (
                <motion.div key={g.day} layout className="alert-group">
                  <span className="alert-day">{g.day}</span>
                  {g.items.map((n) => (
                    <AlertCard
                      key={n.id}
                      n={n}
                      onDismiss={() => s.dismissNotification(n.id)}
                      onOpen={() => {
                        s.markNotificationRead(n.id);
                        if (n.reportId) {
                          s.selectHazard(n.reportId);
                          nav({ to: "/requester/home" });
                        }
                        setOpen(false);
                      }}
                    />
                  ))}
                </motion.div>
              ))
            ) : (
              <div className="alert-empty">
                <Bell />
                <p>No alerts right now</p>
              </div>
            )}
          </AnimatePresence>
        </div>
        <button
          className="alert-foot"
          onClick={() => {
            setOpen(false);
            nav({ to: "/requester/activity" });
          }}
        >
          See all in Activity <ArrowRight />
        </button>
      </PopoverContent>
    </Popover>
  );
}
