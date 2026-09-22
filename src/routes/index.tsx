import { createFileRoute } from "@tanstack/react-router";
import { SplashPage } from "@/features/onboarding/pages/splash-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nagrik — Safer communities, together" },
      {
        name: "description",
        content: "Safety-first civic assistance from verified Nagrik Marshals.",
      },
      { property: "og:title", content: "Nagrik — Safer communities, together" },
      {
        property: "og:description",
        content: "Safety-first civic assistance from verified Nagrik Marshals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SplashPage,
});
