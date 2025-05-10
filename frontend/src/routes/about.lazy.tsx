import { createLazyFileRoute } from "@tanstack/react-router";
import { About } from "../Pages/About";

export const Route = createLazyFileRoute("/about")({
  component: About,
});
