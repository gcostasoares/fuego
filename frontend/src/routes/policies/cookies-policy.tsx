import { createFileRoute } from "@tanstack/react-router";
import { CookiesPolicy } from "../../Pages/Policies";

export const Route = createFileRoute("/policies/cookies-policy")({
  component: CookiesPolicy,
});
