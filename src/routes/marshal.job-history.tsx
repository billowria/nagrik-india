import { createFileRoute } from "@tanstack/react-router";
import { MarshalRequestsPage } from "@/features/marshal/pages/marshal-requests-page";

export const Route = createFileRoute("/marshal/job-history")({
  head: () => ({
    meta: [
      { title: "Marshal · Job History — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Job History safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Job History — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Job History safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalRequestsPage,
});
