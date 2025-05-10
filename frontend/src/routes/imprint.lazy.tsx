import { createLazyFileRoute } from "@tanstack/react-router";
import { Imprint } from "../Pages/Imprint";

export const Route = createLazyFileRoute("/imprint")({
  component: Imprint,
});
