import { GrowEquipmentDetail } from '@/Pages/GrowEquipment'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/growEquipmentDetail/$id')({
  component: GrowEquipmentDetail,
})

