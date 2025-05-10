import { PharmacyDetail } from '@/Pages/Pharmacy'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/pharmacyDetail/$id')({
  component: PharmacyDetail,
})
