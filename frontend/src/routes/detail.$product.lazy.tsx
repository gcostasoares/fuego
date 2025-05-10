import { createLazyFileRoute } from "@tanstack/react-router";
import { ProductDetail } from "../Pages/Products";

export const Route = createLazyFileRoute("/detail/$product")({
  component: ProductDetail,
});
