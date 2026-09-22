import { createFileRoute } from "@tanstack/react-router";
import { MarshalRequestsPage } from "@/features/marshal/pages/marshal-requests-page";

export const Route = createFileRoute("/marshal/requests")({
  head: () => ({
    meta: [
      { title: "Marshal · Requests — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Requests safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Requests — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Requests safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalRequestsPage,
});
