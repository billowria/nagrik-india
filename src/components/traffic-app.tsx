import { useLocation } from "@tanstack/react-router";
import { SplashPage } from "@/features/onboarding/pages/splash-page";
import { RoleSelectPage } from "@/features/onboarding/pages/role-select-page";
import { RequesterHomePage } from "@/features/requester/pages/requester-home-page";
import { ActivityPage } from "@/features/activity/pages/activity-page";
import { RequesterProfilePage } from "@/features/requester/pages/requester-profile-page";
import { MarshalDashboardPage } from "@/features/marshal/pages/marshal-dashboard-page";
import { MarshalKycPage } from "@/features/marshal/pages/marshal-kyc-page";
import { MarshalTrainingPage } from "@/features/marshal/pages/marshal-training-page";
import { MarshalRequestsPage } from "@/features/marshal/pages/marshal-requests-page";
import { MarshalWalletPage } from "@/features/marshal/pages/marshal-wallet-page";
import { MarshalProfilePage } from "@/features/marshal/pages/marshal-profile-page";

export function TrafficApp() {
  const path = useLocation({ select: (s) => s.pathname });

  if (path === "/") return <SplashPage />;
  if (path.startsWith("/onboarding")) return <RoleSelectPage />;

  if (path === "/requester/home") return <RequesterHomePage />;
  if (path === "/requester/activity") return <ActivityPage />;
  if (path === "/requester/profile") return <RequesterProfilePage />;

  if (path === "/marshal/kyc") return <MarshalKycPage />;
  if (path === "/marshal/training") return <MarshalTrainingPage />;
  if (path === "/marshal/requests" || path === "/marshal/job-history")
    return <MarshalRequestsPage />;
  if (path === "/marshal/wallet") return <MarshalWalletPage />;
  if (path === "/marshal/profile") return <MarshalProfilePage />;

  return <MarshalDashboardPage />;
}

export {
  SplashPage,
  RoleSelectPage,
  RequesterHomePage,
  ActivityPage,
  RequesterProfilePage,
  MarshalDashboardPage,
  MarshalKycPage,
  MarshalTrainingPage,
  MarshalRequestsPage,
  MarshalWalletPage,
  MarshalProfilePage,
};
