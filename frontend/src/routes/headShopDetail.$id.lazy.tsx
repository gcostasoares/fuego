import { HeadShopDetail } from '@/Pages/HeadShop'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/headShopDetail/$id')({
  component: HeadShopDetail,
})
