import { createFileRoute } from "@tanstack/react-router";
import { DataProtection } from "../../Pages/Policies";

export const Route = createFileRoute("/policies/data-privacy")({
  component: DataProtection,
});
