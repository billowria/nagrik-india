import { createFileRoute } from "@tanstack/react-router";
import { MarshalDashboardPage } from "@/features/marshal/pages/marshal-dashboard-page";

export const Route = createFileRoute("/marshal/incoming-job")({
  head: () => ({
    meta: [
      { title: "Marshal · Incoming Job — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Incoming Job safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Incoming Job — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Incoming Job safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalDashboardPage,
});
