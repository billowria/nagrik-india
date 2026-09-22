import { createFileRoute } from "@tanstack/react-router";
import { MarshalWalletPage } from "@/features/marshal/pages/marshal-wallet-page";

export const Route = createFileRoute("/marshal/wallet")({
  head: () => ({
    meta: [
      { title: "Marshal · Wallet — Nagrik" },
      {
        name: "description",
        content: "Nagrik Marshal · Wallet safety-first civic assistance experience.",
      },
      { property: "og:title", content: "Marshal · Wallet — Nagrik" },
      {
        property: "og:description",
        content: "Nagrik Marshal · Wallet safety-first civic assistance experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarshalWalletPage,
});
