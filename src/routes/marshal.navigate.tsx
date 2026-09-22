import { createFileRoute } from "@tanstack/react-router";
import { MarshalDashboardPage } from "@/features/marshal/pages/marshal-dashboard-page";

export const Route = createFileRoute("/marshal/navigate")({
  head: () => ({
    meta: [
      { title: "Marshal · Navigate — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Navigate safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Navigate — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Navigate safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalDashboardPage,
});
