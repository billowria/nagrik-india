import { createFileRoute } from "@tanstack/react-router";
import { MarshalDashboardPage } from "@/features/marshal/pages/marshal-dashboard-page";

export const Route = createFileRoute("/marshal/dashboard")({
  head: () => ({
    meta: [
      { title: "Marshal · Dashboard — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Dashboard safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Dashboard — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Dashboard safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalDashboardPage,
});
