import { HeadShopList } from "@/Pages/HeadShop";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/headShop")({
  component: HeadShopList,
});
