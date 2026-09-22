import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Landmark, Sparkles, UserCheck, Users } from "lucide-react";
import { useTraffic, type CommunityReport } from "@/lib/traffic-store";
import { Page } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { RequesterNav } from "@/features/shared/components/navigation";
import {
  MyActivityTab,
  CommunityWardTab,
} from "../components/activity-cards";
import { ActivityDetailSheet } from "../components/activity-detail-sheet";
import { cn } from "@/lib/utils";

export function ActivityPage() {
  const s = useTraffic();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"my" | "ward">("my");
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);

  const handleOpenMap = (reportId: string) => {
    s.selectHazard(reportId);
    setSelectedReport(null);
    nav({ to: "/requester/home" });
  };

  return (
    <Page title="Civic Activity" eyebrow="Civic Command" nav={<RequesterNav />}>
      <div className="activity-center pb-24">
        {/* ── 2 Main Tabs with Framer Motion pill ── */}
        <div className="relative mb-5 grid grid-cols-2 rounded-2xl bg-muted/80 p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 py-2.5 text-xs font-black transition-colors rounded-xl",
              activeTab === "my"
                ? "text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {activeTab === "my" && (
              <motion.div
                layoutId="activity-tab-pill"
                className="absolute inset-0 rounded-xl bg-card shadow-xs"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4" />
              My Activity
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ward")}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 py-2.5 text-xs font-black transition-colors rounded-xl",
              activeTab === "ward"
                ? "text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {activeTab === "ward" && (
              <motion.div
                layoutId="activity-tab-pill"
                className="absolute inset-0 rounded-xl bg-card shadow-xs"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Landmark className="h-4 w-4" />
              Community & Ward
            </span>
          </button>
        </div>

        {/* Tab Content with Spring Transition */}
        <AnimatePresence mode="wait">
          {activeTab === "my" ? (
            <motion.div
              key="my-activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MyActivityTab onSelectReport={setSelectedReport} />
            </motion.div>
          ) : (
            <motion.div
              key="ward-activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CommunityWardTab onSelectReport={setSelectedReport} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Slide-up Lifecycle Detail Sheet ── */}
      {selectedReport && (
        <ActivityDetailSheet
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onOpenMap={handleOpenMap}
        />
      )}

      <DevConsole />
    </Page>
  );
}
