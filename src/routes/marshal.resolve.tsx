import { createFileRoute } from "@tanstack/react-router";
import { MarshalDashboardPage } from "@/features/marshal/pages/marshal-dashboard-page";

export const Route = createFileRoute("/marshal/resolve")({
  head: () => ({
    meta: [
      { title: "Marshal · Resolve — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Resolve safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Resolve — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Resolve safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalDashboardPage,
});
