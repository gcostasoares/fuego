import { GrowEquipmentList } from "@/Pages/GrowEquipment";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/growEquipment")({
  component: GrowEquipmentList,
});
