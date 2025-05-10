import { PharmaciesList } from '@/Pages/Pharmacy'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/pharmacies')({
  component: PharmaciesList,
})

