import { useState } from "react";
import { ChevronDown, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTraffic, type CommunityReport } from "@/lib/traffic-store";
import { timeAgo } from "@/features/shared/components/notification-bell";
import { cn } from "@/lib/utils";

export function ReportThread({ report }: { report: CommunityReport }) {
  const s = useTraffic();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const quick = ["Still an issue", "Clearing up", "Avoid this route"];

  return (
    <div className="report-thread">
      <Button
        variant="ghost"
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-full justify-between rounded-xl px-2 text-[11px] font-extrabold text-primary"
      >
        <span className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Civic activity · {report.comments.length}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>
      {open && (
        <div className="mt-1">
          <ol className="thread-list">
            {report.comments.map((c) => (
              <li key={c.id}>
                <span className="thread-dot" />
                <div>
                  <b>{c.author}</b>
                  <p>{c.text}</p>
                  <small>{timeAgo(c.at)}</small>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-2 flex flex-wrap gap-1">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => s.addReportComment(report.id, q)}
                className="rounded-full border px-2.5 py-1.5 text-[10px] font-bold text-primary"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 120))}
              placeholder="Add an update for neighbours"
              className="h-11 bg-card text-xs"
            />
            <Button
              size="icon"
              aria-label="Post update"
              disabled={!text.trim()}
              className="h-11 w-11 rounded-xl"
              onClick={() => {
                s.addReportComment(report.id, text.trim());
                setText("");
              }}
            >
              <Send />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
