import { ShopDetails } from '@/Pages/CBDShop/CBDShopDetails'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/detailShop/$shop')({
  component: ShopDetails,
})
