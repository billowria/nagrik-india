import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  Check,
  CheckCircle2,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTraffic } from "@/lib/traffic-store";
import { Page, SectionTitle, Timeline } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { cn } from "@/lib/utils";

export function MarshalKycPage() {
  const s = useTraffic();
  const nav = useNavigate();
  const [files, setFiles] = useState([false, false, false]);
  const [loading, setLoading] = useState(-1);

  if (s.kyc === "review") {
    return (
      <Page title="Verification in review" eyebrow="KYC submitted">
        <div className="rounded-3xl bg-orange-soft p-5">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            We usually review evidence within 24 hours.
          </p>
        </div>
        <Timeline labels={["Submitted", "Safety review", "Approved"]} current={1} />
        <SectionTitle>Evidence summary</SectionTitle>
        {["Government ID front", "Government ID back", "Selfie holding ID"].map((x) => (
          <div key={x} className="mb-2 flex items-center gap-3 rounded-2xl border bg-card p-4">
            <FileCheck2 className="text-primary" />
            <span className="text-sm font-bold">{x}</span>
            <Check className="ml-auto text-primary" />
          </div>
        ))}
        <Button
          className="mt-6 h-13 w-full rounded-2xl"
          onClick={() => {
            s.approveKyc();
            nav({ to: "/marshal/training" });
          }}
        >
          Prototype: Approve & continue
        </Button>
        <DevConsole />
      </Page>
    );
  }

  return (
    <Page title="Become a verified Nagrik Marshal" eyebrow="Safety starts with trust">
      <p className="text-sm text-muted-foreground">
        Your identity helps requesters know that trained, accountable help is arriving.
      </p>
      <div className="mt-6 grid gap-3">
        {["Government ID front", "Government ID back", "Selfie holding ID"].map((x, i) => (
          <button
            key={x}
            onClick={() => {
              setLoading(i);
              setTimeout(() => {
                setFiles((a) => a.map((v, j) => (j === i ? true : v)));
                setLoading(-1);
              }, 600);
            }}
            className={cn(
              "grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border-2 border-dashed bg-card p-4 text-left",
              files[i] && "border-primary bg-accent",
            )}
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-soft text-primary">
              {i === 2 ? <Camera /> : <Upload />}
            </span>
            <span>
              <b className="block text-sm">{x}</b>
              <small className="text-muted-foreground">
                {loading === i
                  ? "Uploading…"
                  : files[i]
                    ? "Ready to submit"
                    : "Tap to capture or upload"}
              </small>
            </span>
            {loading === i ? (
              <RefreshCw className="animate-spin text-primary" />
            ) : files[i] ? (
              <CheckCircle2 className="text-primary" />
            ) : null}
          </button>
        ))}
      </div>
      <Button
        disabled={!files.every(Boolean)}
        className="mt-8 h-14 w-full rounded-2xl"
        onClick={s.submitKyc}
      >
        Submit for safety review
      </Button>
      <DevConsole />
    </Page>
  );
}
