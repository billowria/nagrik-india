import { createFileRoute } from "@tanstack/react-router";
import { MarshalDashboardPage } from "@/features/marshal/pages/marshal-dashboard-page";

export const Route = createFileRoute("/marshal/payout")({
  head: () => ({
    meta: [
      { title: "Marshal · Payout — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Payout safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Payout — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Payout safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalDashboardPage,
});
