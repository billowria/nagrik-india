import { createFileRoute } from "@tanstack/react-router";
import { MarshalProfilePage } from "@/features/marshal/pages/marshal-profile-page";

export const Route = createFileRoute("/marshal/profile")({
  head: () => ({
    meta: [
      { title: "Marshal · Profile — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Profile safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Profile — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Profile safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalProfilePage,
});
