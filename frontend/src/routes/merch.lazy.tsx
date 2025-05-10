import Merch from '@/Pages/Merch'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/merch')({
  component: Merch,
})

