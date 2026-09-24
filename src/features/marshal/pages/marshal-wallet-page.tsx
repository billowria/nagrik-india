import { useState } from "react";
import { Banknote, CheckCircle2, IndianRupee, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useTraffic } from "@/lib/traffic-store";
import { HistoryList } from "@/features/activity/components/activity-cards";
import { Page, SectionTitle } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { MarshalNav } from "@/features/shared/components/navigation";
import { InfoButton } from "@/components/info-sheet";
import { triggerHaptic } from "@/lib/haptics";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <b className="text-lg">{value}</b>
    </div>
  );
}

export function MarshalWalletPage() {
  const s = useTraffic();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const available = s.earnings - s.withdrawals;
  const n = Number(amount);
  const valid = n > 0 && n <= available;

  return (
    <Page title="Your earnings" eyebrow="Nagrik Wallet" nav={<MarshalNav />}>
      <div className="balance-hero rounded-3xl bg-primary p-6 text-primary-foreground shadow-warm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold opacity-80">AVAILABLE BALANCE</p>
          <InfoButton topic="reporting-bounties" size="sm" title="Payout & Token Guide" />
        </div>
        <div className="mt-1 text-4xl font-extrabold">₹{available.toLocaleString("en-IN")}</div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs">HDFC Bank •••• 1842</span>
          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={() => {
              triggerHaptic("selection");
              setOpen(true);
            }}
          >
            <Banknote />
            Withdraw
          </Button>
        </div>
      </div>

      <div className="my-6 grid grid-cols-2 gap-y-5">
        <Metric label="Total earned" value={`₹${s.earnings.toLocaleString("en-IN")}`} />
        <Metric label="Pending" value="₹450" />
        <Metric label="Completed jobs" value="284" />
        <Metric label="Earning period" value="Sep 16–22" />
      </div>

      <SectionTitle>This week</SectionTitle>
      <div className="flex h-28 items-end justify-between gap-2 border-b pb-2">
        {[35, 62, 48, 80, 55, 92, 68].map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-lg bg-primary/20" style={{ height: `${v}%` }}>
              <div
                className="h-full w-full rounded-t-lg bg-primary"
                style={{ opacity: 0.35 + v / 160 }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground">
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </span>
          </div>
        ))}
      </div>

      <SectionTitle>Transactions</SectionTitle>
      <HistoryList />

      <button className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">
        <LifeBuoy />
        Wallet help & support
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="mx-auto max-w-md rounded-t-3xl bg-card">
          <DrawerHeader>
            <DrawerTitle>Withdraw earnings</DrawerTitle>
            <DrawerDescription>
              Funds arrive in HDFC Bank •••• 1842 within one business day.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
            {success ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
                <b className="mt-3 block text-xl">Withdrawal requested</b>
                <p className="mt-1 text-sm text-muted-foreground">
                  ₹{n.toLocaleString("en-IN")} is on its way.
                </p>
                <Button
                  className="mt-6 w-full rounded-xl"
                  onClick={() => {
                    setOpen(false);
                    setSuccess(false);
                    setAmount("");
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <>
                <label className="text-xs font-bold">Amount</label>
                <div className="relative mt-2">
                  <IndianRupee className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                    className="h-13 pl-10 text-lg"
                    placeholder="0"
                  />
                </div>
                {amount && n > available && (
                  <p className="mt-2 text-xs text-danger">Amount exceeds your available balance.</p>
                )}
                {amount && n === 0 && (
                  <p className="mt-2 text-xs text-danger">Enter a valid amount.</p>
                )}
                <Button
                  disabled={!valid}
                  className="mt-5 h-13 w-full rounded-xl"
                  onClick={() => {
                    if (s.withdraw(n)) setSuccess(true);
                  }}
                >
                  Confirm withdrawal
                </Button>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      <DevConsole />
    </Page>
  );
}
