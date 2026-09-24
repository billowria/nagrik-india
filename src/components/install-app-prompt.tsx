import { useEffect, useMemo, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const SESSION_KEY = "nagrik-install-prompt-hidden";

function isStandaloneMode() {
  if (typeof window === "undefined") return true;
  const standaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
  const navigatorStandalone =
    "standalone" in window.navigator && window.navigator.standalone === true;
  return standaloneMedia || navigatorStandalone;
}

function detectPlatform() {
  if (typeof window === "undefined") return "other" as const;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() ?? "";
  const iPadOS = platform === "macintel" && window.navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/.test(userAgent) || iPadOS) return "ios" as const;
  if (/android/.test(userAgent)) return "android" as const;
  return "other" as const;
}

export function InstallAppPrompt() {
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const platform = useMemo(detectPlatform, []);

  useEffect(() => {
    if (typeof window === "undefined" || isStandaloneMode()) return;
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;

    const timer = window.setTimeout(() => {
      if (window.sessionStorage.getItem(SESSION_KEY) !== "1") setVisible(true);
    }, 1200);
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      if (window.sessionStorage.getItem(SESSION_KEY) !== "1") setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const dismiss = () => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hideForFlow = () => setVisible(false);
    window.addEventListener("nagrik-install-prompt-hide", hideForFlow);
    return () => window.removeEventListener("nagrik-install-prompt-hide", hideForFlow);
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
    dismiss();
  };

  if (!visible) return null;

  const isIos = platform === "ios";
  const isMobileLike =
    isIos || platform === "android" || (typeof window !== "undefined" && window.innerWidth <= 700);
  if (!isMobileLike && !installEvent) return null;
  const canInstall = Boolean(installEvent);

  return (
    <div className="fixed inset-x-3 bottom-[max(96px,env(safe-area-inset-bottom))] z-[900] mx-auto max-w-[536px] sm:bottom-[max(110px,env(safe-area-inset-bottom))]">
      <div className="install-prompt rounded-[24px] border bg-card/96 p-3 shadow-soft backdrop-blur">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <Smartphone className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <b className="block text-sm text-foreground">Add Nagrik to your phone</b>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {isIos
                ? "Open it like an app from your Home Screen."
                : canInstall
                  ? "Install it for a full-screen app experience."
                  : "Save it to your Home Screen for a cleaner app view."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Hide install prompt"
            onClick={dismiss}
            className="h-8 w-8 shrink-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isIos ? (
          <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 rounded-2xl bg-secondary/70 p-3 text-xs text-foreground">
            <Share2 className="mt-0.5 h-4 w-4 text-primary" />
            <span>Tap Share in Safari</span>
            <span className="text-primary">+</span>
            <span>Choose Add to Home Screen</span>
          </div>
        ) : null}

        <div className={cn("mt-3 grid gap-2", isIos ? "grid-cols-1" : "grid-cols-[1fr_auto]")}>
          {canInstall ? (
            <Button onClick={install} className="h-11 rounded-2xl">
              <Download className="h-4 w-4" />
              Install app
            </Button>
          ) : (
            <Button variant="outline" onClick={dismiss} className="h-11 rounded-2xl">
              Got it
            </Button>
          )}
          {!isIos && canInstall ? (
            <Button variant="ghost" onClick={dismiss} className="h-11 rounded-2xl px-4 text-xs">
              Later
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
