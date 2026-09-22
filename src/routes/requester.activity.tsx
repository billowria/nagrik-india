import { createFileRoute } from "@tanstack/react-router";
import { ActivityPage } from "@/features/activity/pages/activity-page";

export const Route = createFileRoute("/requester/activity")({
  head: () => ({
    meta: [
      { title: "Requester · Activity — Nagrik" },
      {
        name: "description",
        content: "Nagrik Requester · Activity safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Requester · Activity — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Requester · Activity safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActivityPage,
});
