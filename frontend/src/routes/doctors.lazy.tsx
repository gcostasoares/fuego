import { DoctorList } from '@/Pages/Doctor'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/doctors')({
  component: DoctorList,
})

