import { createFileRoute } from "@tanstack/react-router";
import { MarshalKycPage } from "@/features/marshal/pages/marshal-kyc-page";

export const Route = createFileRoute("/marshal/kyc")({
  head: () => ({
    meta: [
      { title: "Marshal · KYC — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · KYC safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · KYC — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · KYC safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalKycPage,
});
