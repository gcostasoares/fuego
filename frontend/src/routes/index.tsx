import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../Pages/Home'

export const Route = createFileRoute('/')({
  component: Home,
})
