import { createFileRoute } from "@tanstack/react-router";
import { RequesterProfilePage } from "@/features/requester/pages/requester-profile-page";

export const Route = createFileRoute("/requester/profile")({
  head: () => ({
    meta: [
      { title: "Requester · Profile — Nagrik" },
      {
        name: "description",
        content: "Nagrik Requester · Profile safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Requester · Profile — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Requester · Profile safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequesterProfilePage,
});
