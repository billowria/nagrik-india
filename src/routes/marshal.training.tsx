import { createFileRoute } from "@tanstack/react-router";
import { MarshalTrainingPage } from "@/features/marshal/pages/marshal-training-page";

export const Route = createFileRoute("/marshal/training")({
  head: () => ({
    meta: [
      { title: "Marshal · Training — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Training safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Training — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Training safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalTrainingPage,
});
