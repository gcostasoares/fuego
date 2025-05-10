import { createFileRoute } from "@tanstack/react-router";
import { TermsOfUse } from "../../Pages/Policies";

export const Route = createFileRoute("/policies/terms-of-use")({
  component: TermsOfUse,
});
