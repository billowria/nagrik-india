import { createFileRoute } from "@tanstack/react-router";
import { RequesterHomePage } from "@/features/requester/pages/requester-home-page";

export const Route = createFileRoute("/requester/home")({
  head: () => ({
    meta: [
      { title: "Requester · Home — Nagrik" },
      {
        name: "description",
        content: "Nagrik Requester · Home safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Requester · Home — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Requester · Home safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequesterHomePage,
});
