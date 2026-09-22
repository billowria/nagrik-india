import { createFileRoute } from "@tanstack/react-router";
import { RoleSelectPage } from "@/features/onboarding/pages/role-select-page";

export const Route = createFileRoute("/onboarding/role-select")({
  head: () => ({
    meta: [
      { title: "Onboarding · Role Select — Nagrik" },
      {
        name: "description",
        content: "Nagrik Onboarding · Role Select safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Onboarding · Role Select — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Onboarding · Role Select safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoleSelectPage,
});
