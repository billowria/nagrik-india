import { createFileRoute } from "@tanstack/react-router";
import { RoleSelectPage } from "@/features/onboarding/pages/role-select-page";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Nagrik" },
      {
        name: "description",
        content: "Nagrik Onboarding safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Onboarding — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Onboarding safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoleSelectPage,
});
