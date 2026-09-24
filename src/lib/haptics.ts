export type HapticType =
  | "light"
  | "selection"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "sos";

export function triggerHaptic(type: HapticType = "light"): void {
  if (typeof window === "undefined" || !("navigator" in window) || !("vibrate" in navigator)) {
    return;
  }

  try {
    switch (type) {
      case "selection":
        navigator.vibrate(6);
        break;
      case "light":
        navigator.vibrate(12);
        break;
      case "medium":
        navigator.vibrate(28);
        break;
      case "heavy":
        navigator.vibrate(50);
        break;
      case "success":
        navigator.vibrate([16, 50, 24]);
        break;
      case "warning":
        navigator.vibrate([35, 70, 35]);
        break;
      case "sos":
        navigator.vibrate([60, 80, 60, 80, 120]);
        break;
      default:
        navigator.vibrate(12);
    }
  } catch {
    // Ignore environments where navigator.vibrate is restricted
  }
}
