import { createFileRoute } from "@tanstack/react-router";
import { MarshalDashboardPage } from "@/features/marshal/pages/marshal-dashboard-page";

export const Route = createFileRoute("/marshal/after-photo")({
  head: () => ({
    meta: [
      { title: "Marshal · After Photo — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · After Photo safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · After Photo — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · After Photo safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalDashboardPage,
});
