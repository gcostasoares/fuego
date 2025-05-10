import { createLazyFileRoute } from "@tanstack/react-router";
import { ShopList } from "@/Pages/CBDShop";

export const Route = createLazyFileRoute("/shop")({
  component: ShopList,
});
