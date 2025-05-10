import { DoctorDetail } from "@/Pages/Doctor";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/doctorDetail/$id")({
  component: DoctorDetail,
});
